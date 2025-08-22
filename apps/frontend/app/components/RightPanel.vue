<script setup lang="ts">
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue';
import { useExplorer } from '~/composables/useExplorer';
import { useFiles } from '~/composables/useFiles';
import Breadcrumbs from '~/components/Breadcrumbs.vue';
import ContentGridItem from '~/components/ContentGridItem.vue';
import ContentListRow from '~/components/ContentListRow.vue';
import ContextMenu from '~/components/ContextMenu.vue';
import ConfirmModal from '~/components/ConfirmModal.vue';
import NamePromptModal from '~/components/NamePromptModal.vue';
import Dropzone from '~/components/Dropzone.vue';
import HeaderActions from '~/components/HeaderActions.vue';
import ContentToolbar from '~/components/ContentToolbar.vue';

const props = defineProps<{ selectedFolder: any | null }>();
const emit = defineEmits<{
  (e: 'folder-selected', folder: any): void;
}>();

const { getRootFolders, createFolder, getFolderContents, getFolderPath, renameFolder, deleteFolder, refreshRootList, refreshFolderContents } = useExplorer();
const { uploadFiles, renameFile, deleteFile } = useFiles();
const toast = useToast?.();

const items = ref<any[]>([]);
const rootItems = ref<any[]>([]);
const breadcrumb = ref<any[]>([]);
const showNew = ref(false);

// View & Sort (di toolbar konten)
const viewMode = ref<'grid' | 'list'>('grid');
const sortOrder = ref<'asc' | 'desc'>('asc');

// Folder aktif dari breadcrumb terakhir
const currentFolderId = computed<number | null>(() => {
  if (!breadcrumb.value?.length) return null;
  const last = breadcrumb.value[breadcrumb.value.length - 1];
  return (last?.id ?? null) as number | null;
});

const currentFolderEnc = computed<string | null>(() => (currentFolderId.value != null ? encrypt(String(currentFolderId.value)) : null));
const isRoot = computed(() => currentFolderEnc.value === null);
const canGoBack = computed(() => (breadcrumb.value?.length || 0) > 1);

// Confirm
const showConfirm = ref(false);
const confirmTitle = ref('Delete item');
const confirmMessage = ref('');
let confirmTarget: any = null;

// Loaders
const loadRoot = async () => {
  const { data } = await getRootFolders({ limit: 50, order_by: 'asc', parent_id: null });
  const list = (data.value?.data?.items ?? []).map((it: any) => ({
    ...it,
    type: (typeof it.type === 'string' ? it.type.toLowerCase() : it.type) ?? 'folder',
  }));
  rootItems.value = list;
  items.value = list;
  breadcrumb.value = [{ id: null, name: 'Root' }];
};

const loadContents = async () => {
  if (!props.selectedFolder?.id) {
    await loadRoot();
    return;
  }
  const enc = encrypt(String(props.selectedFolder.id));
  const { data: contents } = await getFolderContents(enc);
  const { data: path } = await getFolderPath(enc);
  items.value = (contents.value?.data?.items ?? []).map((it: any) => ({
    ...it,
    type: (typeof it.type === 'string' ? it.type.toLowerCase() : it.type) ?? (it.hasChildren ? 'folder' : 'file'),
  }));
  const pathArr = path.value?.data ?? [];
  breadcrumb.value = [{ id: null, name: 'Root' }, ...pathArr];
};

watch(() => props.selectedFolder?.id, loadContents, { immediate: true });

// Sorting
const sortedItems = computed(() => {
  const arr = [...items.value];
  arr.sort((a, b) => {
    const av = (a.name || '').toString().toLowerCase();
    const bv = (b.name || '').toString().toLowerCase();
    if (av < bv) return sortOrder.value === 'asc' ? -1 : 1;
    if (av > bv) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
  return arr;
});

// Open / Breadcrumb
const openItem = (item: any) => {
  if (item.type === 'folder') emit('folder-selected', item);
};
const handleItemDoubleClick = (item: any) => openItem(item);

const navigateBreadcrumb = async (folder: any) => {
  if (!folder?.id) {
    if (rootItems.value.length === 0) await loadRoot();
    else {
      items.value = rootItems.value;
      breadcrumb.value = [{ id: null, name: 'Root' }];
    }
    return;
  }
  emit('folder-selected', folder);
};

// === Back logic (toolbar) ===
function goBack() {
  // jika Root → ignore
  if (!canGoBack.value) return;
  const parent = breadcrumb.value[breadcrumb.value.length - 2]; // sebelum terakhir
  if (!parent?.id) {
    // kembali ke Root (tanpa mengubah selectedFolder parent)
    if (rootItems.value.length === 0) {
      loadRoot();
    } else {
      items.value = rootItems.value;
      breadcrumb.value = [{ id: null, name: 'Root' }];
    }
  } else {
    emit('folder-selected', parent);
  }
}

const onRightClickBlank = (evt: MouseEvent) => {
  // hanya di area konten (biar aman, boleh langsung tampilkan menu background)
  evt.preventDefault();
  menuItem.value = null; // <— kunci: null = background menu
  positionMenu(evt.clientX, evt.clientY);
  showMenu.value = true;
};

// --- Modal Rename
const showRename = ref(false);
const renameInitial = ref('');
let renameTarget: any = null;

function openRenameModal(target: any) {
  renameTarget = target;
  renameInitial.value = target?.name ?? '';
  showRename.value = true;
}

async function submitRename(newName: string) {
  const t = renameTarget;
  if (!t) return;
  if (!newName || newName === t.name) return;

  if (t.type === 'folder') {
    await renameFolder({ id: encrypt(String(t.id)), name: newName });
  } else {
    // ==== File rename ====
    await renameFile(encrypt(String(t.id)), newName);
  }

  // segarkan view aktif setelah rename (baik folder atau file)
  if (currentFolderEnc.value) {
    await refreshFolderContents(currentFolderEnc.value);
    await loadContents();
  } else {
    await refreshRootList({ limit: 50, order_by: 'asc', parent_id: null });
    await loadRoot();
  }
}

// Context menu
const showMenu = ref(false);
const menuX = ref(0);
const menuY = ref(0);
const menuItem = ref<any | null>(null);
const closeMenu = () => (showMenu.value = false);
const positionMenu = (x: number, y: number) => {
  const MARGIN = 8,
    WIDTH = 220,
    HEIGHT = 170;
  const vw = window.innerWidth,
    vh = window.innerHeight;
  menuX.value = Math.min(x, vw - WIDTH - MARGIN);
  menuY.value = Math.min(y, vh - HEIGHT - MARGIN);
};
const onRightClickItem = (item: any, evt: MouseEvent) => {
  evt.preventDefault();
  menuItem.value = item;
  positionMenu(evt.clientX, evt.clientY);
  showMenu.value = true;
};

onMounted(() => {
  window.addEventListener('click', closeMenu);
  window.addEventListener('keydown', (e) => e.key === 'Escape' && closeMenu());
});
onBeforeUnmount(() => {
  window.removeEventListener('click', closeMenu);
  window.removeEventListener('keydown', (e) => e.key === 'Escape' && closeMenu());
});

// Actions
const doOpen = () => {
  if (!menuItem.value) return;
  if (menuItem.value.type === 'folder') emit('folder-selected', menuItem.value);
  showMenu.value = false;
};

const doRename = () => {
  if (!menuItem.value) return;
  openRenameModal(menuItem.value);
};

watch(showRename, (open) => {
  if (!open) renameTarget = null;
});

function askDelete(item: any) {
  confirmTarget = item;
  confirmTitle.value = `Delete "${item?.name}"?`;
  confirmMessage.value = 'This cannot be undone.';
  showConfirm.value = true;
}

async function confirmDelete() {
  const item = confirmTarget;
  if (!item) return;

  if (item.type === 'folder') {
    await deleteFolder({ id: encrypt(String(item.id)) });
  } else {
    // ==== File delete ====
    await deleteFile(encrypt(String(item.id)));
  }

  // refresh view setelah delete
  if (currentFolderEnc.value) {
    await refreshFolderContents(currentFolderEnc.value);
    await loadContents();
  } else {
    await refreshRootList({ limit: 50, order_by: 'asc', parent_id: null });
    await loadRoot();
  }

  confirmTarget = null;
}

// New folder (parent = folder yang dibuka)
async function handleNewFolder(name: string) {
  const pidEnc = currentFolderEnc.value; // null jika Root
  await createFolder({ name, parent_id: pidEnc });
  if (pidEnc) {
    await refreshFolderContents(pidEnc);
    await loadContents();
  } else {
    await refreshRootList({ limit: 50, order_by: 'asc', parent_id: null });
    await loadRoot();
  }
}

// Upload
const uploading = ref(false);
const progress = ref(0);
const ctxUploadBtn = ref<HTMLInputElement | null>(null);
const currentFolderForUpload = computed<string>(() => currentFolderEnc.value ?? '');

async function doUpload(files: File[]) {
  if (isRoot.value) {
    toast?.add?.({
      title: 'Upload tidak diizinkan',
      description: 'Anda tidak dapat mengunggah file di Root.',
      color: 'warning',
    });
    return;
  }
  if (!files?.length) return;
  try {
    uploading.value = true;
    progress.value = 15;
    await uploadFiles(currentFolderForUpload.value, files);
    progress.value = 80;
    if (currentFolderEnc.value) {
      await refreshFolderContents(currentFolderEnc.value);
      await loadContents();
    } else {
      await refreshRootList({ limit: 50, order_by: 'asc', parent_id: null });
      await loadRoot();
    }
    progress.value = 100;
    toast?.add?.({ title: 'Upload completed', description: `${files.length} file(s) uploaded`, color: 'success' });
  } catch (err: any) {
    console.error(err);
    toast?.add?.({ title: 'Upload failed', description: err?.message ?? 'Unknown error', color: 'error' });
  } finally {
    setTimeout(() => {
      uploading.value = false;
      progress.value = 0;
    }, 300);
  }
}
function onUploadSelected(files: File[]) {
  doUpload(files);
}
function onDropFiles(files: File[]) {
  doUpload(files);
}
</script>

<template>
  <div class="flex-1 flex flex-col">
    <!-- Header: Breadcrumbs + HeaderActions (New Folder + Upload) -->
    <div class="p-4 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between gap-3">
        <Breadcrumbs
          :items="breadcrumb"
          @navigate="navigateBreadcrumb"
        />

        <HeaderActions
          :uploading="uploading"
          :is-root="isRoot"
          @new-folder="showNew = true"
          @upload-selected="onUploadSelected"
        />
      </div>

      <transition name="fade">
        <div
          v-if="uploading"
          class="mt-3"
        >
          <UProgress
            :value="progress"
            color="info"
          />
        </div>
      </transition>
    </div>

    <!-- Body + Dropzone -->
    <Dropzone
      :disabled="uploading"
      @dropped="onDropFiles"
    >
      <template #default="{ isOver }">
        <div
          class="flex-1 overflow-y-auto p-4"
          :class="isOver ? 'bg-blue-50/50' : ''"
          @contextmenu.stop.prevent="onRightClickBlank"
        >
          <!-- Toolbar di dalam konten -->
          <ContentToolbar
            :can-go-back="canGoBack"
            :view-mode="viewMode"
            :sort-order="sortOrder"
            @back="goBack"
            @update:viewMode="(v) => (viewMode = v)"
            @update:sortOrder="(v) => (sortOrder = v)"
          />

          <!-- Grid/List -->
          <div
            v-if="viewMode === 'grid'"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
          >
            <ContentGridItem
              v-for="it in sortedItems"
              :key="it.id ?? it.name"
              :item="it"
              @open="handleItemDoubleClick"
              @context="({ item, evt }) => onRightClickItem(item, evt)"
            />
          </div>

          <div
            v-else
            class="bg-white border border-gray-200 rounded-lg overflow-hidden"
          >
            <div class="grid grid-cols-12 text-xs font-semibold text-gray-600 bg-gray-50 border-b border-gray-200 p-2">
              <div class="col-span-6">Name</div>
              <div class="col-span-3">Type</div>
              <div class="col-span-3">Size</div>
            </div>
            <ContentListRow
              v-for="it in sortedItems"
              :key="it.id ?? it.name"
              :item="it"
              @open="handleItemDoubleClick"
              @context="({ item, evt }) => onRightClickItem(item, evt)"
            />
          </div>

          <div
            v-if="sortedItems.length === 0"
            class="text-center py-12"
          >
            <svg
              class="w-12 h-12 text-gray-400 mx-auto mb-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M3 7h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M3 7l3-3h12l3 3"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
            <p class="text-gray-500">This folder is empty</p>
          </div>
        </div>
      </template>
    </Dropzone>

    <!-- Context Menu -->
    <ContextMenu
      :show="showMenu"
      :x="menuX"
      :y="menuY"
      :min-width="220"
      @close="showMenu = false"
    >
      <!-- ============ MENU untuk FOLDER ============ -->
      <template v-if="menuItem && menuItem.type === 'folder'">
        <button
          class="w-full text-left px-3 py-2 hover:bg-gray-100"
          @click="doOpen"
        >
          Open
        </button>
        <button
          class="w-full text-left px-3 py-2 hover:bg-gray-100"
          @click="doRename"
        >
          Rename
        </button>
        <button
          class="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
          @click="askDelete(menuItem!)"
        >
          Delete
        </button>
      </template>

      <!-- ============ MENU untuk FILE ============ -->
      <template v-else-if="menuItem && menuItem.type !== 'folder'">
        <button
          class="w-full text-left px-3 py-2 hover:bg-gray-100"
          @click="doRename"
        >
          Rename
        </button>
        <button
          class="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
          @click="askDelete(menuItem!)"
        >
          Delete
        </button>
      </template>

      <!-- ============ MENU untuk AREA KOSONG (BACKGROUND) ============ -->
      <template v-else>
        <button
          class="w-full text-left px-3 py-2 hover:bg-gray-100"
          :disabled="isRoot"
          :title="isRoot ? 'Tidak bisa upload di Root' : ''"
          @click="
            () => {
              showMenu = false;
              ctxUploadBtn?.click();
            }
          "
        >
          Upload here…
        </button>
        <button
          class="w-full text-left px-3 py-2 hover:bg-gray-100"
          @click="
            () => {
              showMenu = false;
              showNew = true;
            }
          "
        >
          New folder
        </button>
      </template>
    </ContextMenu>

    <!-- Confirm Delete -->
    <ConfirmModal
      v-model="showConfirm"
      :title="confirmTitle"
      :message="confirmMessage"
      confirm-text="Delete"
      confirm-color="error"
      @confirm="confirmDelete"
    />

    <!-- Modal: New Folder -->
    <NamePromptModal
      v-model="showNew"
      title="Create new folder"
      label="Folder name"
      placeholder="e.g. Documents"
      confirm-text="Create"
      @submit="handleNewFolder"
    />

    <NamePromptModal
      v-model="showRename"
      title="Rename"
      label="New name"
      :initial="renameInitial"
      confirm-text="Save"
      @submit="submitRename"
    />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

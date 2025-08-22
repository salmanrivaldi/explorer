<script setup lang="ts">
import FolderTree from '~/components/FolderTree.vue';
import ContextMenu from '~/components/ContextMenu.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useExplorer } from '~/composables/useExplorer';

const emit = defineEmits<{ (e: 'folder-selected', folder: any): void }>();

const { getRootFolders, createFolder, deleteFolder, renameFolder } = useExplorer();

const expandedFolders = ref<Record<number, boolean>>({});
const selectedFolder = ref<any>(null);

const limit = ref(10);
const rootFolders = ref<any[]>([]);
const hasMore = ref(true);

// Context menu state
const showMenu = ref(false);
const menuX = ref(0);
const menuY = ref(0);
const menuFolder = ref<any | null>(null);

const findNodeById = (nodes: any[], id: number): any | null => {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children?.length) {
      const hit = findNodeById(n.children, id);
      if (hit) return hit;
    }
  }
  return null;
};

const loadFolders = async (parent_id: string | null = null) => {
  const { data, error } = await getRootFolders({
    limit: limit.value,
    order_by: 'asc',
    parent_id,
  });

  if (error?.value) {
    console.error('getRootFolders error:', error.value);
    return;
  }

  const resp: any = data.value ?? {};
  const items: any[] = resp?.data?.items ?? resp?.items ?? [];
  const meta: any = resp?.data?.meta ?? resp?.meta ?? null;

  if (!parent_id) {
    const newItems = items.filter((i: any) => !rootFolders.value.some((f: any) => f.id === i.id));
    if (limit.value <= 10 && rootFolders.value.length === 0) rootFolders.value = newItems;
    else rootFolders.value.push(...newItems);

    hasMore.value = meta ? rootFolders.value.length < (meta.total_data ?? rootFolders.value.length) : items.length === limit.value;
  } else {
    const parentNumericId = Number(decrypt(parent_id));
    const parentNode = findNodeById(rootFolders.value, parentNumericId);
    if (parentNode) parentNode.children = items;
  }
};

const closeMenu = () => (showMenu.value = false);

const positionMenu = (x: number, y: number) => {
  const MARGIN = 8;
  const WIDTH = 200;
  const HEIGHT = 140;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  menuX.value = Math.min(x, vw - WIDTH - MARGIN);
  menuY.value = Math.min(y, vh - HEIGHT - MARGIN);
};

const onWinKey = (e: KeyboardEvent) => e.key === 'Escape' && closeMenu();

await loadFolders();

onMounted(async () => {
  window.addEventListener('click', closeMenu);
  window.addEventListener('keydown', onWinKey);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', closeMenu);
  window.removeEventListener('keydown', onWinKey);
});

const loadMore = async () => {
  if (!hasMore.value) return;
  limit.value += 10;
  await loadFolders(null);
};

const toggleExpand = async (folder: any) => {
  expandedFolders.value[folder.id] = !expandedFolders.value[folder.id];
  if (expandedFolders.value[folder.id] && !folder.children) {
    await loadFolders(encrypt(String(folder.id)));
  }
};

// klik kanan: hanya buka menu; klik kiri: pilih
const handleFolderClick = (folder: any, evt?: MouseEvent) => {
  if (evt?.type === 'contextmenu') {
    menuFolder.value = folder;
    positionMenu(evt.clientX, evt.clientY);
    showMenu.value = true;
    return;
  }
  selectedFolder.value = folder;
  emit('folder-selected', folder);
};

const refreshChildren = async (parentId: number | null) => {
  if (parentId === null) {
    rootFolders.value = [];
    limit.value = 10;
    await loadFolders(null);
  } else {
    await loadFolders(encrypt(String(parentId)));
  }
};

const onCreateSub = async () => {
  if (!menuFolder.value) return;
  const name = prompt(`Create folder inside "${menuFolder.value.name}" as:`);
  if (!name) return;
  await createFolder({ name, parent_id: encrypt(String(menuFolder.value.id)) });
  await refreshChildren(menuFolder.value.id);
  showMenu.value = false;
};

const onRename = async () => {
  if (!menuFolder.value) return;
  const name = prompt('Rename folder:', menuFolder.value.name);
  if (!name || name === menuFolder.value.name) return;
  await renameFolder({ id: encrypt(String(menuFolder.value.id)), name });
  const node = findNodeById(rootFolders.value, menuFolder.value.id);
  if (node) node.name = name;
  showMenu.value = false;
};

const onDelete = async () => {
  if (!menuFolder.value) return;
  const ok = confirm(`Delete folder "${menuFolder.value.name}"? This cannot be undone.`);
  if (!ok) return;
  await deleteFolder({ id: encrypt(String(menuFolder.value.id)) });

  const removeNode = (nodes: any[], id: number): boolean => {
    const idx = nodes.findIndex((n) => n.id === id);
    if (idx >= 0) {
      nodes.splice(idx, 1);
      return true;
    }
    for (const n of nodes) if (n.children?.length && removeNode(n.children, id)) return true;
    return false;
  };
  removeNode(rootFolders.value, menuFolder.value.id);
  if (selectedFolder.value?.id === menuFolder.value.id) {
    selectedFolder.value = null;
    emit('folder-selected', null as any);
  }
  showMenu.value = false;
};
</script>

<template>
  <div class="relative w-80 bg-white border-r border-gray-200 flex flex-col">
    <div class="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-800">Explorer</h2>
    </div>

    <ClientOnly>
      <div class="flex-1 overflow-y-auto">
        <div class="p-2">
          <FolderTree
            :nodes="rootFolders"
            :expanded-folders="expandedFolders"
            :selected-folder="selectedFolder"
            @toggleExpand="toggleExpand"
            @clickFolder="handleFolderClick"
          />

          <button
            v-if="hasMore"
            @click="loadMore"
            class="flex items-center w-full p-2 mt-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <svg
              class="w-4 h-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 6v12m6-6H6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            <span class="text-sm">Load More</span>
          </button>

          <div
            v-if="!rootFolders.length"
            class="px-3 py-6 text-sm text-gray-500"
          >
            No folders yet.
          </div>
        </div>
      </div>

      <template #fallback>
        <div class="flex-1 overflow-y-auto">
          <div class="p-2 space-y-2">
            <div
              v-for="i in 6"
              :key="i"
              class="h-6 bg-gray-100 rounded animate-pulse"
            ></div>
          </div>
        </div>
      </template>
    </ClientOnly>

    <ContextMenu
      :show="showMenu"
      :x="menuX"
      :y="menuY"
      :min-width="200"
      @close="showMenu = false"
    >
      <button
        class="w-full text-left px-3 py-2 hover:bg-gray-100"
        @click="onCreateSub"
      >
        Create Folder
      </button>
      <button
        class="w-full text-left px-3 py-2 hover:bg-gray-100"
        @click="onRename"
      >
        Rename
      </button>
      <button
        class="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
        @click="onDelete"
      >
        Delete
      </button>
    </ContextMenu>
  </div>
</template>

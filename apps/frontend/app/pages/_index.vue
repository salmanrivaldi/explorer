<script setup lang="ts">
import { ref } from 'vue';
import { ChevronRightIcon, ChevronDownIcon, FolderIcon, FolderOpenIcon, EllipsisHorizontalIcon as MoreHorizontalIcon, DocumentIcon as FileIcon } from '@heroicons/vue/24/outline';
import { useExplorer } from '~/composables/useExplorer';

const { getRootFolders, getFolderContents, getFolderPath } = useExplorer();

const expandedFolders = ref<Record<number, boolean>>({});
const selectedFolder = ref<any>(null);
const rightPanelContent = ref<any[]>([]);
const breadcrumb = ref<any[]>([]);

const limit = ref(10);
const rootFolders = ref<any[]>([]);
const hasMore = ref(true);

// load root folders or children
const loadFolders = async (parent_id: string | null = null) => {
  const { data } = await getRootFolders({
    limit: limit.value,
    parent_id,
  });

  const items = data.value?.data?.items || [];
  const meta = data.value?.data?.meta;

  if (!parent_id) {
    const newItems = items.filter((i) => !rootFolders.value.some((f) => f.id === i.id));
    rootFolders.value.push(...newItems);
    hasMore.value = meta ? rootFolders.value.length < meta.total_data : items.length === limit.value;
  } else {
    const parent = rootFolders.value.find((f) => {
      return f.id === Number(decrypt(parent_id));
    });
    if (parent) parent.children = items;
  }
};

await loadFolders();

const loadMore = async () => {
  if (!hasMore.value) return;
  limit.value += 10;
  await loadFolders();
};

const toggleExpand = async (folder: any) => {
  expandedFolders.value[folder.id] = !expandedFolders.value[folder.id];

  if (expandedFolders.value[folder.id] && !folder.children) {
    await loadFolders(encrypt(String(folder.id)));
  }
};

const handleFolderClick = async (folder: any) => {
  selectedFolder.value = folder;
  const { data: contents } = await getFolderContents(folder.id);
  const { data: path } = await getFolderPath(folder.id);

  rightPanelContent.value = contents.value?.data?.items || [];
  breadcrumb.value = path.value?.data || [];
};

const handleItemDoubleClick = async (item: any) => {
  if (item.type === 'folder') await handleFolderClick(item);
};

const navigateBreadcrumb = async (folder: any) => await handleFolderClick(folder);
</script>

<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Panel Kiri -->
    <div class="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div class="p-4 border-b border-gray-200 bg-gray-50">
        <h2 class="text-lg font-semibold text-gray-800">Folders</h2>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div class="p-2">
          <template
            v-for="folder in rootFolders"
            :key="folder.id"
          >
            <div :class="`flex items-center p-2 rounded cursor-pointer hover:bg-gray-100 ${selectedFolder?.id === folder.id ? 'bg-blue-100 border-l-4 border-blue-500' : ''}`">
              <button
                @click.stop="toggleExpand(folder)"
                class="mr-1 p-1 hover:bg-gray-200 rounded-full cursor-pointer"
              >
                <ChevronDownIcon
                  v-if="expandedFolders[folder.id]"
                  class="w-4 h-4 text-gray-600"
                />
                <ChevronRightIcon
                  v-else
                  class="w-4 h-4 text-gray-600"
                />
              </button>

              <div
                class="flex items-center flex-1"
                @click="handleFolderClick(folder)"
              >
                <FolderOpenIcon
                  v-if="selectedFolder?.id === folder.id"
                  class="w-4 h-4 text-blue-600 mr-2"
                />
                <FolderIcon
                  v-else
                  class="w-4 h-4 text-yellow-600 mr-2"
                />
                <span class="text-sm text-gray-700 select-none">{{ folder.name }}</span>
              </div>
            </div>

            <!-- children -->
            <div
              v-if="expandedFolders[folder.id]"
              class="ml-5 border-l border-gray-200 pl-2"
            >
              <div
                v-for="child in folder.children || []"
                :key="child.id"
                class="flex items-center p-2 rounded cursor-pointer hover:bg-gray-100"
                @click="handleFolderClick(child)"
              >
                <FolderOpenIcon
                  v-if="selectedFolder?.id === child.id"
                  class="w-4 h-4 text-blue-600 mr-2"
                />
                <FolderIcon
                  v-else
                  class="w-4 h-4 text-yellow-600 mr-2"
                />
                <span class="text-sm text-gray-700 select-none">{{ child.name }}</span>
              </div>
            </div>
          </template>

          <button
            v-if="hasMore"
            @click="loadMore"
            class="flex items-center w-full p-2 mt-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <MoreHorizontalIcon class="w-4 h-4 mr-2" />
            <span class="text-sm">Load More</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Panel Kanan -->
    <div class="flex-1 flex flex-col">
      <div class="p-4 border-b border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-800">Contents of: {{ selectedFolder?.name || 'Root' }}</h2>
          <span class="text-sm text-gray-500"> {{ rightPanelContent.length }} items </span>
        </div>

        <div class="flex items-center gap-1 text-sm text-gray-600 mt-2">
          <template
            v-for="(crumb, index) in breadcrumb"
            :key="crumb.id"
          >
            <button
              class="hover:underline text-blue-600"
              @click="navigateBreadcrumb(crumb)"
            >
              {{ crumb.name }}
            </button>
            <span v-if="index < breadcrumb.length - 1">/</span>
          </template>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <div
            v-for="(item, index) in rightPanelContent"
            :key="index"
            class="flex items-center p-3 border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 cursor-pointer transition-all bg-white"
            @dblclick="handleItemDoubleClick(item)"
          >
            <FolderIcon
              v-if="item.type === 'folder'"
              class="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0"
            />
            <FileIcon
              v-else
              class="w-6 h-6 text-gray-600 mr-3 flex-shrink-0"
            />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-800 truncate">{{ item.name }}</p>
              <p class="text-xs text-gray-500 capitalize">{{ item.type }} {{ item.hasChildren ? '(has items)' : '' }}</p>
            </div>
          </div>
        </div>

        <div
          v-if="rightPanelContent.length === 0"
          class="text-center py-12"
        >
          <FolderIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500">This folder is empty</p>
        </div>
      </div>
    </div>
  </div>
</template>

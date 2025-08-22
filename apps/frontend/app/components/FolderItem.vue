<script setup lang="ts">
import { ChevronRightIcon, ChevronDownIcon, FolderIcon, FolderOpenIcon } from '@heroicons/vue/24/outline';

defineOptions({ name: 'FolderItem' }); // penting agar rekursi dikenali

const props = defineProps<{
  folder: any;
  expandedFolders: Record<number, boolean>;
  selectedFolder: any;
}>();

const emit = defineEmits<{
  (e: 'toggleExpand', folder: any): void;
  (e: 'clickFolder', folder: any, evt?: MouseEvent): void; // evt dipakai utk context menu
}>();

const onToggle = () => emit('toggleExpand', props.folder);
const onLeftClick = () => emit('clickFolder', props.folder); // left click → pilih folder
const onRightClick = (evt: MouseEvent) => emit('clickFolder', props.folder, evt); // right click → menu
</script>

<template>
  <div>
    <div
      :class="`flex items-center p-2 rounded cursor-pointer hover:bg-gray-100 ${selectedFolder?.id === folder.id ? 'bg-blue-100 border-l-4 border-blue-500' : ''}`"
      @contextmenu.prevent="onRightClick"
    >
      <button
        @click.stop="onToggle"
        class="mr-1 p-1 hover:bg-gray-200 rounded-full cursor-pointer"
        aria-label="Toggle"
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
        @click="onLeftClick"
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

    <div
      v-if="expandedFolders[folder.id]"
      class="ml-5 border-l border-gray-200 pl-2"
    >
      <!-- Rekursi: forward semua event termasuk evt contextmenu -->
      <FolderItem
        v-for="child in folder.children || []"
        :key="child.id"
        :folder="child"
        :expandedFolders="expandedFolders"
        :selectedFolder="selectedFolder"
        @toggleExpand="$emit('toggleExpand', $event)"
        @clickFolder="(f, e) => $emit('clickFolder', f, e)"
      />
    </div>
  </div>
</template>

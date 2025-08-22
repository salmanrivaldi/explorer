<script setup lang="ts">
import FolderItem from '~/components/FolderItem.vue';

const props = defineProps<{
  nodes: any[];
  expandedFolders: Record<number, boolean>;
  selectedFolder: any | null;
}>();

const emit = defineEmits<{
  (e: 'toggleExpand', folder: any): void;
  (e: 'clickFolder', folder: any, evt?: MouseEvent): void;
}>();
</script>

<template>
  <div>
    <FolderItem
      v-for="folder in nodes"
      :key="folder.id"
      :folder="folder"
      :expandedFolders="expandedFolders"
      :selectedFolder="selectedFolder"
      @toggleExpand="(f) => emit('toggleExpand', f)"
      @clickFolder="(f, e) => emit('clickFolder', f, e)"
    />
  </div>
</template>

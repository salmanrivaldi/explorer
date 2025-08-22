<script setup lang="ts">
import { ref } from 'vue';
import LeftPanel from '~/components/LeftPanel.vue';
import RightPanel from '~/components/RightPanel.vue';

const selectedFolder = ref<any>(null);
const onFolderSelected = (folder: any) => (selectedFolder.value = folder);
</script>

<template>
  <div class="flex h-screen bg-gray-50">
    <LeftPanel @folder-selected="onFolderSelected" />
    <RightPanel
      :selectedFolder="selectedFolder"
      @folder-selected="onFolderSelected"
    />
  </div>
</template>

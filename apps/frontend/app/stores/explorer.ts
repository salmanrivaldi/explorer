import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useFolderStore } from './folder';

export const useExplorerStore = defineStore('explorer', () => {
  const folderStore = useFolderStore();

  const visibleFolders = ref<any[]>([]);
  const displayLimit = ref(10);
  const selectedFolder = ref<any | null>(null);

  const loadFolders = async () => {
    await folderStore.fetchFolders();
    visibleFolders.value = (folderStore.folders ?? []).slice(0, displayLimit.value);
  };

  const loadMore = () => {
    displayLimit.value += 10;
    visibleFolders.value = (folderStore.folders ?? []).slice(0, displayLimit.value);
  };

  const selectFolder = async (folder: any) => {
    selectedFolder.value = folder;
    await folderStore.fetchFolderContents(folder.id);
  };

  return {
    visibleFolders,
    displayLimit,
    selectedFolder,
    loadFolders,
    loadMore,
    selectFolder,
  };
});

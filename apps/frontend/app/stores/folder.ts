// stores/folder.ts
import { defineStore } from 'pinia';

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
}

export interface FolderContent {
  id: string;
  name: string;
  type: 'file' | 'folder';
}

export interface FolderState {
  folders: Folder[] | null;
  contents: FolderContent[] | null;
  visibleCount: number;
}

export const useFolderStore = defineStore('folder', {
  state: (): FolderState => ({
    folders: null,
    contents: null,
    visibleCount: 20, // default visible item
  }),

  getters: {
    visibleFolders: (state) => state.folders?.slice(0, state.visibleCount) ?? [],
  },

  actions: {
    getBaseUrl() {
      return useRuntimeConfig().public.apiBase;
    },

    async fetchFolders() {
      const { data } = await useAsyncData('folders', () => $fetch<Folder[]>(`${this.getBaseUrl()}/folders`));
      this.folders = data.value ?? [];
    },

    async fetchSubfolders(id: string) {
      const { data } = await useAsyncData(`subfolders-${id}`, () => $fetch<Folder[]>(`${this.getBaseUrl()}/folders/${id}/subfolders`));
      this.folders = data.value ?? [];
    },

    async fetchFolderDetails(id: number) {
      const { data } = await useAsyncData(`folder-${id}`, () => $fetch<Folder>(`${this.getBaseUrl()}/folders/${id}`));
      return data.value;
    },

    async fetchFolderContents(id: string) {
      const { data } = await useAsyncData(`contents-${id}`, () => $fetch<FolderContent[]>(`${this.getBaseUrl()}/folders/${id}/contents`));
      this.contents = data.value ?? [];
    },

    // untuk load lebih banyak folder
    loadMore() {
      this.visibleCount += 20;
    },
  },
});

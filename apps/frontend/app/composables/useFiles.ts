// apps/frontend/app/composables/useFiles.ts
import { useRuntimeConfig } from '#imports';

export const useFiles = () => {
  const config = useRuntimeConfig();
  const baseUrl = `${String(config.public.apiBase).replace(/\/+$/, '')}/files`;

  // Upload ke folder tertentu (folderEncOrRoot = encrypted folder id; root = '' atau null dari pemanggil)
  async function uploadFiles(folderEncOrRoot: string, files: File[]) {
    const form = new FormData();
    for (const f of files) form.append('files', f);

    return await $fetch(`${baseUrl}/upload/${encodeURIComponent(folderEncOrRoot ?? '')}`, {
      method: 'POST',
      body: form,
    });
  }

  // Rename file (id terenkripsi, body: { name })
  async function renameFile(idEnc: string, name: string) {
    return await $fetch(`${baseUrl}/${encodeURIComponent(idEnc)}`, {
      method: 'PUT',
      body: { name },
    });
  }

  // Delete file (id terenkripsi)
  async function deleteFile(idEnc: string) {
    return await $fetch(`${baseUrl}/${encodeURIComponent(idEnc)}`, {
      method: 'DELETE',
    });
  }

  return {
    uploadFiles,
    renameFile,
    deleteFile,
  };
};

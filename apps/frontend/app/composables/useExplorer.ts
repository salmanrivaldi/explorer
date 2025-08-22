// ~/composables/useExplorer.ts
import { useRuntimeConfig } from '#imports';
import type { FolderResponse, FolderQueryParams, FolderContentsResponse, FolderPathResponse } from '~/types/folder';

export const useExplorer = () => {
  const config = useRuntimeConfig();
  const baseUrl = `${String(config.public.apiBase).replace(/\/+$/, '')}/folders`;

  const fx = <T>(url: string, opts: Parameters<typeof $fetch<T>>[1] = {}) => $fetch<T>(url, { timeout: 15_000, ...opts });

  const k = {
    list: (p: FolderQueryParams = {}) => `root-folders|p:${p.page ?? 1}|l:${p.limit ?? 10}|o:${p.order_by ?? 'asc'}|pid:${p.parent_id ?? ''}`,
    contents: (id: string) => `folder-contents|${id}`,
    path: (id: string) => `folder-path|${id}`,
    create: (payload: { name: string; pid?: string | null }) => `create-folder|${payload.name}|pid:${payload.pid ?? ''}`,
    rename: (id: string) => `rename-folder|${id}`,
    delete: (id: string) => `delete-folder|${id}`,
  };

  // ROOT/CHILD LIST — client-only + default
  const getRootFolders = (params: FolderQueryParams = {}) =>
    useAsyncData<FolderResponse>(
      k.list(params),
      () => {
        const query: Record<string, any> = {
          limit: params.limit ?? 10,
          page: params.page ?? 1,
          order_by: params.order_by ?? 'asc',
          parent_id: params.parent_id ?? null, // root explicit
        };
        return fx<FolderResponse>(baseUrl, { params: query });
      },
      {
        default: () =>
          ({
            code: 200,
            status: 'OK',
            message: '',
            data: { items: [], meta: { limit: 0, page: 1, total_pages: 0, total_data: 0 } },
          } as FolderResponse),
      },
    );

  // CONTENTS — client-only + default
  const getFolderContents = (id: string) =>
    useAsyncData<FolderContentsResponse>(k.contents(id), () => fx<FolderContentsResponse>(`${baseUrl}/${encodeURIComponent(id)}/contents`), {
      default: () =>
        ({
          code: 200,
          status: 'OK',
          message: '',
          data: { items: [], meta: { limit: 0, page: 1, total_pages: 0, total_data: 0 } },
        } as FolderContentsResponse),
    });

  // PATH — client-only + default
  const getFolderPath = (id: string) =>
    useAsyncData<FolderPathResponse>(k.path(id), () => fx<FolderPathResponse>(`${baseUrl}/${encodeURIComponent(id)}/path`), {
      default: () =>
        ({
          code: 200,
          status: 'OK',
          message: '',
          data: [],
        } as FolderPathResponse),
    });

  const createFolder = (payload: { name: string; parent_id?: string | null }) =>
    useAsyncData(k.create(payload), () =>
      fx(`${baseUrl}`, {
        method: 'POST',
        body: {
          name: payload.name,
          parent_id: payload.parent_id,
        },
      }),
    );

  const renameFolder = (payload: { id: string; name: string }) =>
    useAsyncData(k.rename(payload.id), () =>
      fx(`${baseUrl}/${encodeURIComponent(payload.id)}`, {
        method: 'PUT',
        body: { name: payload.name },
      }),
    );

  const deleteFolder = (payload: { id: string }) => useAsyncData(k.delete(payload.id), () => fx(`${baseUrl}/${encodeURIComponent(payload.id)}`, { method: 'DELETE' }));

  const refreshRootList = (params: FolderQueryParams = {}) => refreshNuxtData(k.list(params));
  const refreshFolderContents = (encId: string) => Promise.all([refreshNuxtData(k.contents(encId)), refreshNuxtData(k.path(encId))]);

  return {
    getRootFolders,
    getFolderContents,
    getFolderPath,
    createFolder,
    renameFolder,
    deleteFolder,
    refreshRootList,
    refreshFolderContents,
  };
};

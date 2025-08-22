import { folderDTO } from '@backend/dto/folder.dto';
import { fileDTO } from '@backend/dto/file.dto';
import { FolderService as s } from '@backend/services/folder.service';
import { FileService as fs } from '@backend/services/file.service';
import { ApiResponse } from '@backend/utils/response';

export const FolderController = {
  getAll: async ({ query }: { query: any }): Promise<ApiResponse> => {
    const folders = await s.getAllFolders(query);
    return {
      code: 200,
      status: 'success',
      message: 'Success fetching folders',
      data: {
        items: folders.items.map(folderDTO),
        meta: {
          limit: query?.limit,
          page: query?.page,
          total_pages: Math.ceil(folders.total / query?.limit) || 0,
          total_data: folders.total,
        },
      },
    };
  },

  create: async ({ body }: { body: { name: string; parent_id: string } }): Promise<ApiResponse> => {
    await s.createFolder(body.name, body.parent_id);
    return {
      code: 200,
      status: 'success',
      message: 'Folder created successfully',
    };
  },

  rename: async ({ params, body }: { params: { id: string }; body: { name: string } }): Promise<ApiResponse> => {
    await s.renameFolder(params.id, body.name);
    return {
      code: 200,
      status: 'success',
      message: 'Folder renamed successfully',
    };
  },

  remove: async ({ params }: { params: { id: string } }): Promise<ApiResponse> => {
    await s.deleteFolder(params.id);
    return {
      code: 200,
      status: 'success',
      message: 'Folder deleted successfully',
    };
  },

  getContents: async ({ params, query }: { params: { id: string }; query: any }): Promise<ApiResponse> => {
    query.parent_id = params.id;

    const [subfolders, files] = await Promise.all([
      //
      s.getAllFolders(query),
      fs.getFilesInFolder(params.id, query),
    ]);

    const items = [
      ...subfolders.items.map((f: any) => ({ ...folderDTO(f), type: 'folder' })), //
      ...files.items.map((f: any) => ({ ...fileDTO(f), type: 'file' })),
    ];

    return {
      code: 200,
      status: 'success',
      message: 'Success fetching folder contents',
      data: {
        items: items,
        meta: {
          limit: query?.limit,
          page: query?.page,
          total_pages: Math.ceil(items.length / query?.limit) || 0,
          total_data: items.length,
        },
      },
    };
  },

  getPath: async ({ params }: { params: { id: string } }): Promise<ApiResponse> => {
    const path = await s.getFolderPath(params.id);
    return {
      code: 200,
      status: 'success',
      message: 'Success fetching folder path',
      data: path.map(folderDTO),
    };
  },
};

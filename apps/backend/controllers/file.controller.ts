// apps/backend/src/controllers/file.controller.ts
import { fileDTO } from '@backend/dto/file.dto';
import { FileService } from '@backend/services/file.service';
import { ApiResponse } from '@backend/utils/response';

export const FileController = {
  getFilesInFolder: async ({ params, query }: { params: { id: string }; query: any }): Promise<ApiResponse> => {
    const files = await FileService.getFilesInFolder(params.id, query);
    return {
      code: 200,
      status: 'success',
      message: 'Success fetching files in folder',
      data: {
        items: files.items.map(fileDTO),
        meta: {
          limit: query?.limit,
          page: query?.page,
          total_pages: Math.ceil(files.total / query?.limit) || 0,
          total_data: files.total,
        },
      },
    };
  },

  renameFile: async ({ params, body }: { params: { id: string }; body: { name: string } }): Promise<ApiResponse> => {
    await FileService.renameFile(params.id, body.name);
    return {
      code: 200,
      status: 'success',
      message: 'File renamed successfully',
    };
  },

  deleteFile: async ({ params }: { params: { id: string } }): Promise<ApiResponse> => {
    await FileService.deleteFile(params.id);
    return {
      code: 200,
      status: 'success',
      message: 'File deleted successfully',
    };
  },

  uploadFile: async ({ params, body }: { params: { folder_id: string }; body: { files: File[] } }): Promise<ApiResponse> => {
    const created = await FileService.uploadFiles(params.folder_id, body.files);

    return {
      code: 201,
      status: 'success',
      message: 'Files uploaded successfully',
      data: {
        items: created.map((f: any) => fileDTO(f)),
      },
    };
  },
};

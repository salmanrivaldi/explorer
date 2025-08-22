import { File } from '@db/generated/client';
export function fileDTO(folder: File) {
  return {
    id: folder.id,
    folder_id: folder.folderId,
    name: folder.name,
    original_name: folder.originalName,
    path: folder.path,
    mime_type: folder.mimeType,
    size: folder.size,
  };
}

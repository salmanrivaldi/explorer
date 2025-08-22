import { Folder } from '@db/generated/client';

export function folderDTO(folder: Folder) {
  return {
    id: folder.id,
    name: folder.name,
    parent_id: folder.parentId,
    created_at: folder.createdAt,
  };
}

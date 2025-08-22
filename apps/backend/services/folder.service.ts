import path from 'node:path';
import fs from 'node:fs/promises';

import { prisma } from '@db/client';
import { FolderRepository as r } from '@backend/respositories/folder.repository';
import { decrypt } from '@backend/utils/encryption';
import { findAllParams } from '@backend/utils/response';
import { UPLOAD_DIR } from '@backend/utils/storage';

export const FolderService = {
  getAllFolders: async (query: findAllParams) => {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const parent_id = query?.parent_id ? Number(decrypt(String(query?.parent_id))) : null;
    const order_by = query?.order_by || 'asc';
    return r.findAll({ page, limit, parent_id, order_by });
  },

  createFolder: async (name: string, parentId?: string) => {
    if (parentId) {
      const decryptedParentID = Number(decrypt(parentId));
      const folder = await r.findOne(decryptedParentID);
      if (!folder) throw new Error('Folder not found!');
      return r.create(name, decryptedParentID);
    }
    return r.create(name);
  },

  renameFolder: async (id: string, newName: string) => {
    const decryptedID = Number(decrypt(id));
    const folder = await r.findOne(decryptedID);
    if (!folder) throw new Error('Folder not found!');
    return r.update(decryptedID, newName);
  },

  deleteFolder: async (id: string) => {
    const folderId = Number(decrypt(id));
    const folder = await r.findOne(folderId);
    if (!folder) throw new Error('Folder not found!');

    await deleteFolderRecursive(folderId);
    return { ok: true };
  },

  getFolderPath: async (id: string) => {
    const decryptedID = Number(decrypt(id));
    const folder = await r.findOne(decryptedID);
    if (!folder) throw new Error('Folder not found!');
    return r.getPath(decryptedID);
  },
};

async function deleteFolderRecursive(folderId: number): Promise<void> {
  const files = await prisma.file.findMany({ where: { folderId } });
  for (const f of files) {
    const abs = path.join(UPLOAD_DIR, f.path);

    const normBase = path.normalize(UPLOAD_DIR + path.sep);
    const normAbs = path.normalize(abs);
    if (!normAbs.startsWith(normBase)) continue;

    try {
      await fs.unlink(normAbs);
    } catch {}
  }

  const children = await prisma.folder.findMany({ where: { parentId: folderId } });
  for (const child of children) {
    await deleteFolderRecursive(child.id);
  }

  await prisma.folder.delete({ where: { id: folderId } });

  const folderDir = path.join(UPLOAD_DIR, String(folderId));
  try {
    await fs.rm(folderDir, { recursive: true, force: true });
  } catch {}
}

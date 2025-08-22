import { FileRepository as r } from '@backend/respositories/file.repository';
import { decrypt } from '@backend/utils/encryption';
import { findAllParams } from '@backend/utils/response';
import path from 'node:path';
import fs from 'node:fs/promises';
import { ensureDir, UPLOAD_DIR } from '@backend/utils/storage';

export const FileService = {
  getFilesInFolder: async (folderId: string, query: findAllParams) => {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const order_by = query?.order_by || 'desc';

    const decryptedFolderID = Number(decrypt(folderId));
    return r.findByFolder(decryptedFolderID, { page, limit, order_by });
  },

  renameFile: async (id: string, newName: string) => {
    const decryptedID = Number(decrypt(id));
    const file = await r.findOne(decryptedID);
    if (!file) throw new Error('File not found!');
    return r.update(decryptedID, newName);
  },

  deleteFile: async (id: string) => {
    const decryptedID = Number(decrypt(id));
    const file = await r.findOne(decryptedID);
    if (!file) throw new Error('File not found!');

    const rel = String(file.path ?? path.join(String(file.folderId ?? ''), String(file.name ?? ''))).replace(/^[/\\]+/, '');

    const abs = path.join(UPLOAD_DIR, rel);
    const normBase = path.normalize(UPLOAD_DIR + path.sep);
    const normAbs = path.normalize(abs);
    if (!normAbs.startsWith(normBase)) {
      console.warn('[deleteFile] Invalid stored path, skipping unlink:', { rel, abs });
    } else {
      try {
        await fs.unlink(normAbs);
      } catch (err: any) {
        if (err?.code !== 'ENOENT') {
          throw err;
        }
      }
    }

    return r.delete(decryptedID);
  },

  uploadFiles: async (folderIdEnc: string, files: File[]) => {
    const dec = Number(decrypt(folderIdEnc));
    if (!Number.isFinite(dec)) {
      throw new Error('Invalid folder ID');
    }
    const folderId = dec;

    const dir = path.join(UPLOAD_DIR, String(folderId));
    await ensureDir(dir);

    const metaToCreate: {
      name: string;
      originalName: string;
      mimeType?: string | null;
      size: number;
      path: string;
    }[] = [];

    for (const f of files) {
      if (!(f instanceof File)) continue;

      const originalName = f.name;
      const ext = path.extname(originalName); // .jpg, .pdf, dll
      const timestamp = Date.now().toString();

      const finalName = `${timestamp}${ext}`;
      const finalPath = path.join(dir, finalName);

      await Bun.write(finalPath, f);

      metaToCreate.push({
        name: finalName,
        originalName,
        mimeType: f.type || null,
        size: f.size,
        path: path.relative(UPLOAD_DIR, finalPath).replaceAll('\\', '/'),
      });
    }

    if (metaToCreate.length) {
      await r.createMany(folderId, metaToCreate);
    }

    return metaToCreate;
  },
};

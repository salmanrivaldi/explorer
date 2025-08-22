import { Elysia } from 'elysia';
import { FileController as c } from '@backend/controllers/file.controller';
import { FileValidation as v } from '@backend/validations/file.validation';
import { UPLOAD_DIR } from '@backend/utils/storage';
import path from 'node:path';

const FileRoutes = new Elysia({ prefix: '/api/files' })
  .get('/:folder_id', c.getFilesInFolder, v.getInFolder)
  .put('/:id', c.renameFile, v.renameFile)
  .delete('/:id', c.deleteFile, v.deleteFile)
  .post('/upload/:folder_id?', c.uploadFile, v.uploadFile)
  .get('/*', async ({ params, set }) => {
    const rel = String(params['*'] || '').replace(/^\/+/, '');

    const abs = path.join(UPLOAD_DIR, rel);
    const normBase = path.normalize(UPLOAD_DIR + path.sep);
    const normAbs = path.normalize(abs);

    if (!normAbs.startsWith(normBase)) {
      set.status = 400;
      return 'Invalid path';
    }

    try {
      // @ts-ignore Bun global
      const file = Bun.file(normAbs);
      if (!(await file.exists())) {
        set.status = 404;
        return 'Not found';
      }
      // cache header opsional:
      set.headers['Cache-Control'] = 'public, max-age=31536000, immutable';
      return new Response(file);
    } catch {
      set.status = 404;
      return 'Not found';
    }
  });

export default FileRoutes;

import { FolderController as c } from '@backend/controllers/folder.controller';
import { FolderValidation as v } from '@backend/validations/folder.validation';
import { Elysia } from 'elysia';

const FolderRoutes = new Elysia({ prefix: '/api/folders' })
  .get('/', c.getAll, v.getAll)
  .get('/:id/contents', c.getContents, v.getContents)
  .get('/:id/path', c.getPath, v.getPath)
  .post('/', c.create, v.create)
  .put('/:id', c.rename, v.rename)
  .delete('/:id', c.remove, v.remove);

export default FolderRoutes;

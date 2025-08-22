import { t } from 'elysia';
const NullableString = t.Union([t.String(), t.Null()]);

const FileIdParam = t.Object({
  id: t.String(),
});

const FolderIdParam = t.Object({
  folder_id: t.Optional(NullableString),
});

const RenameBody = t.Object({
  name: t.String({ minLength: 1 }),
});

export const FileValidation = {
  getInFolder: {
    params: FolderIdParam,
  },
  renameFile: {
    params: FileIdParam,
    body: RenameBody,
  },
  deleteFile: {
    params: FileIdParam,
  },
  uploadFile: {
    params: FolderIdParam,
    body: t.Object({
      files: t.Files(),
    }),
  },
};

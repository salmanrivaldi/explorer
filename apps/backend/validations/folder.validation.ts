import { t } from 'elysia';

const NullableString = t.Union([t.String(), t.Null()]);

const FolderQuerySchema = t.Object({
  page: t.Numeric({ default: 1 }),
  limit: t.Numeric({ default: 10 }),
  orderBy: t.Optional(t.String({ default: 'desc' })),
  parent_id: t.Optional(t.String()),
});

const FolderIdParamSchema = t.Object({
  id: t.String(),
});

const FolderNameBodySchema = t.Object({
  name: t.String({ minLength: 1 }),
  parent_id: t.Optional(NullableString),
});

export const FolderValidation = {
  getAll: { query: FolderQuerySchema },

  create: {
    body: FolderNameBodySchema,
  },

  rename: {
    params: FolderIdParamSchema,
    body: FolderNameBodySchema,
  },

  remove: { params: FolderIdParamSchema },

  getContents: {
    params: FolderIdParamSchema,
  },

  getPath: {
    params: FolderIdParamSchema,
  },
};

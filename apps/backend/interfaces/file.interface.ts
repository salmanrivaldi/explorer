import { findAllParams } from '@backend/utils/response';
import { File } from '@db/generated/client';

export interface IFileRepository {
  findByFolder(folderId: number, params: findAllParams): Promise<{ items: File[]; total: number }>;
  findOne(id: number): Promise<File | null>;
  update(id: number, name: string): Promise<File>;
  delete(id: number): Promise<File>;
  createMany(folderId: number | null, files: { name: string; mimeType?: string | null; size: number; path: string }[]): Promise<{ count: number }>;
}

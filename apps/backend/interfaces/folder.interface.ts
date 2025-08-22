import { Folder } from '@db/generated/client';
import { findAllParams } from '@backend/utils/response';

export interface IFolderRepository {
  findAll(params: findAllParams): Promise<{ items: Folder[]; total: number }>;
  create(name: string, parentId?: number): Promise<Folder>;
  findOne(id: number): Promise<Folder | null>;
  update(id: number, name: string): Promise<Folder>;
  delete(id: number): Promise<Folder>;
  getPath(id: number): Promise<Folder[]>;
}

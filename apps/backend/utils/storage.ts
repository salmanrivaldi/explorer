import path from 'node:path';
import fs from 'node:fs/promises';

export function sanitize(name: string) {
  return name.replace(/[\\/:*?"<>|]+/g, '_');
}

export function uniqueSuffix() {
  return Math.random().toString(36).slice(2, 8);
}

export const UPLOAD_DIR = path.resolve(process.cwd(), 'apps', 'backend', 'uploads');

export async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true });
}

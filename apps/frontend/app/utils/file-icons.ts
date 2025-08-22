// app/utils/file-icons.ts
import type { Component } from 'vue';
import { DocumentIcon as FileOutlineIcon } from '@heroicons/vue/24/outline';
import {
  DocumentTextIcon as DocIcon,
  ChartBarIcon as ExcelIcon,
  PresentationChartBarIcon as PptIcon,
  MusicalNoteIcon as AudioIcon,
  FilmIcon as VideoIcon,
  CodeBracketIcon as CodeIcon,
  DocumentIcon as PdfIcon,
  DocumentPlusIcon as TxtIcon,
  ArchiveBoxIcon as ZipIcon,
} from '@heroicons/vue/24/solid';

export type IconResult = { component: Component; colorClass: string } | null;

/** Selalu kembalikan string */
function ext(name?: string): string {
  const n: string = (name ?? '').toLowerCase();
  const m = n.match(/\.([a-z0-9]+)$/i);
  return m ? m[1] ?? '' : '';
}

/** Selalu kembalikan string */
function mt(mime?: string | null): string {
  return String(mime ?? '').toLowerCase();
}

export function isFolder(item: any): boolean {
  return String(item?.type ?? '').toLowerCase() === 'folder';
}

export function isImage(item: any): boolean {
  const e: string = ext(item?.name ?? '');
  const m: string = mt(item?.mimeType ?? '');
  return m.startsWith('image/') || /^(png|jpe?g|gif|webp|bmp|svg)$/.test(e);
}

export function iconFor(item: any): IconResult {
  if (isFolder(item)) return null;

  const e: string = ext(item?.name ?? '');
  const m: string = mt(item?.mimeType ?? '');

  // pdf
  if (e === 'pdf' || m === 'application/pdf') return { component: PdfIcon, colorClass: 'text-red-600' };
  // word
  if (['doc', 'docx'].includes(e) || m.includes('word')) return { component: DocIcon, colorClass: 'text-blue-600' };
  // excel
  if (['xls', 'xlsx', 'csv'].includes(e) || m.includes('spreadsheet')) return { component: ExcelIcon, colorClass: 'text-green-600' };
  // ppt
  if (['ppt', 'pptx'].includes(e) || m.includes('presentation')) return { component: PptIcon, colorClass: 'text-orange-500' };
  // text
  if (['txt', 'md', 'rtf'].includes(e) || m.startsWith('text/')) return { component: TxtIcon, colorClass: 'text-gray-700' };
  // zip / archive
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(e)) return { component: ZipIcon, colorClass: 'text-amber-600' };
  // audio
  if (m.startsWith('audio/') || ['mp3', 'wav', 'aac', 'flac', 'ogg'].includes(e)) return { component: AudioIcon, colorClass: 'text-purple-600' };
  // video
  if (m.startsWith('video/') || ['mp4', 'mov', 'mkv', 'webm'].includes(e)) return { component: VideoIcon, colorClass: 'text-indigo-600' };
  // code
  if (['js', 'ts', 'json', 'yml', 'yaml', 'xml', 'html', 'css', 'scss', 'py', 'java', 'kt', 'rb', 'go', 'rs', 'c', 'cpp', 'cs'].includes(e)) {
    return { component: CodeIcon, colorClass: 'text-teal-600' };
  }

  // default
  return { component: FileOutlineIcon, colorClass: 'text-gray-600' };
}

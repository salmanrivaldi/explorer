// ~/types/folder.ts  (lanjutan dari tipe yang sudah ada)
export interface FolderResponse {
  code: number;
  status: string;
  message: string;
  data: {
    items: Folder[];
    meta: {
      limit: number;
      page: number;
      total_pages: number;
      total_data: number;
    };
  };
}

export interface FolderQueryParams {
  limit?: number;
  page?: number;
  order_by?: string | null;
  parent_id?: string | null;
}

export interface ContentItem {
  id: number;
  name: string;
  type: 'folder' | 'file';
  hasChildren?: boolean;
}

export interface FolderContentsResponse {
  code: number;
  status: string;
  message: string;
  data: {
    items: ContentItem[];
    meta?: {
      limit?: number;
      page?: number;
      total_pages?: number;
      total_data?: number;
    };
  };
}

export interface BreadcrumbItem {
  id: number;
  name: string;
}

export interface FolderPathResponse {
  code: number;
  status: string;
  message: string;
  data: BreadcrumbItem[];
}

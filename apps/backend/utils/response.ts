export interface PaginationMeta {
  limit: number;
  page: number;
  total_pages: number;
  total_data: number;
}

export interface Paginated<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T = any> {
  code: number;
  status: 'success' | 'error';
  message: string;
  data?: T | Paginated<T> | null;
}

export interface findAllParams {
  page: number;
  limit: number;
  parent_id?: number | null;
  order_by: any;
}

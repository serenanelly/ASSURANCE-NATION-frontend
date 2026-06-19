export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string>;
  timestamp?: string;
  path?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PaginatedParams {
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
}

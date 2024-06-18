export class WebResponse<T> {
  data?: T;
  errors?: string;
  pagination?: Pagination;
}

export class Pagination {
  size: number;
  total_page: number;
  current_page: number;
}

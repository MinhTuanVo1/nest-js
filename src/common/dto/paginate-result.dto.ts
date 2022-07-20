export class PaginateResultDto<T> {
  data: T[];
  page: number;
  limit: number;
  totalCount: number;
}

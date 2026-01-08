export type TAPIResponse<T> = {
  status: true;
  message: string;
  data: T ;
  pagination?: TPagination;
};

export type TAPIResponseItems<T> = {
  status: true;
  message: string;
  data:  { items: T } ;
  pagination?: TPagination;
};

export type TPagination = {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: null | number;
  prevPage: null | number;
};

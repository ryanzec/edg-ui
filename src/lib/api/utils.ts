export type ResponseError = {
  message: string;
  meta?: {
    // this is generic so we need to use the any type

    [key: string]: any;
  };
};

export type ResponseStructure<TData> = {
  data?: TData;
  error?: ResponseError;
  meta?: {
    currentPage?: number;
    totalPageCount?: number;
    totalItemCount?: number;
    itemsPerPage?: number;

    // this is generic so we need to use the any type

    [key: string]: any;
  };
};

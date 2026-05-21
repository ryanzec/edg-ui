// @todo the idea is to be able to type this to disallow keys that are not part of the generic but not sure how
// @todo to do that so keeping this here until I do as once I can, the change only has to happen here
export type RequestStructure<TData> = TData;

export type ResponseMeta = {
  currentPage?: number;
  totalPageCount?: number;
  totalItemCount?: number;
  itemsPerPage?: number;
  prevCursor?: string;
  nextCursor?: string;
  requestId?: string;

  // this is generic so we need to allow any type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export type ResponseError = {
  message: string;
  meta?: ResponseMeta;
};

export type ResponseStructure<TData, TMeta = ResponseMeta, TError = ResponseError> = {
  data?: TData;
  meta?: TMeta;
  error?: TError;
};

export type ResponseType<D> = {
  data?: D | D[] | null;
  statusCode?: number;
  message?: string;
};

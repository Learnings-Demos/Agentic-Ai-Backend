export interface SendResponseInterface<T = any> {
  status: number;
  message: string;
  error: string;
  data: T;
}

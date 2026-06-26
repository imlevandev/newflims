export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export const ok = <T>(
  data: T,
  meta?: Record<string, unknown>,
): ApiSuccessResponse<T> => ({
  success: true,
  data,
  meta,
});

export const fail = (
  code: string,
  message: string,
  details?: unknown,
): ApiErrorResponse => ({
  success: false,
  error: {
    code,
    message,
    details,
  },
});

export interface ErrorResponse {
  status: number;
  message: string;
  errors: any[];
}

function createApiError(status: number, message: string, errors: any[] = []): ErrorResponse {
  return {
    status,
    message,
    errors
  };
}

function UnauthorizedError(): ErrorResponse {
  return createApiError(401, "Пользователь не авторизован");
}

function BadRequestError(message: string, errors: any[] = []): ErrorResponse {
  return createApiError(400, message, errors);
}

export {  UnauthorizedError, BadRequestError };
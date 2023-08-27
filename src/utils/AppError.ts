class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  error: object;
  constructor(message: string | undefined, statusCode: number, error: object) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.error = error;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;

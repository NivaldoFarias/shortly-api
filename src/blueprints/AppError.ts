class AppError extends Error {
  statusCode: number;
  detail: string;
  log: string;

  constructor(message: string, statusCode: number, detail: string, log: string) {
    super(message);

    this.statusCode = statusCode;
    this.detail = detail;
    this.log = log;

    Error.captureStackTrace(this, this.constructor);
  }
}

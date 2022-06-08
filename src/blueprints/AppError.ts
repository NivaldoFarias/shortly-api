export class AppError {
  log;
  statusCode;
  message;
  detail;
  constructor(log: string, statusCode: number = 400, message: string, detail: string) {
    this.log = log;
    this.statusCode = statusCode;
    this.message = message;
    this.detail = detail;
  }
}

import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';

import { ERROR } from './../blueprints/chalk.js';
import { AppError } from '../blueprints/AppError.js';

function ExceptionHandler(error: any, _req: Request, res: Response, _next: NextFunction) {
  console.log(chalk.bold.red(`${ERROR} ${error.log ?? error}`));
  return error instanceof AppError
    ? res.status(error.statusCode).send({
        message: error.message,
        detail: error.detail,
      })
    : res.status(500).send({
        message: `Internal server error`,
        detail: error,
      });
}

export default ExceptionHandler;

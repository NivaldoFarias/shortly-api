import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import chalk from 'chalk';

import { AppError } from './../blueprints/AppError.js';
import { MIDDLEWARE } from './../blueprints/chalk.js';

async function requireToken(req: Request, res: Response, next: NextFunction) {
  const authorization = req.header('authorization') ?? '';
  const token = authorization.replace('Bearer ', '').trim() ?? null;
  const secretKey = process.env.JWT_SECRET ?? 'JWT_SECRET';

  try {
    const { sub } = jwt.verify(token, secretKey);
    res.locals.subject = sub;
  } catch (_error) {
    throw new AppError(`Invalid token`, 401, `Invalid token`, 'Ensure to provide a valid token');
  }
  console.log(chalk.bold.magenta(`${MIDDLEWARE} Valid token`));
  return next();
}

export default requireToken;

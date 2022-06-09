import { Request, Response, NextFunction } from 'express';
import SqlString from 'sqlstring';
import chalk from 'chalk';

import { AppError } from './../blueprints/AppError.js';
import { MIDDLEWARE } from './../blueprints/chalk.js';
import client from './../server.js';

async function findUser(_req: Request, res: Response, next: NextFunction) {
  const { subject } = res.locals;
  const query = SqlString.format(`SELECT * FROM users WHERE id = ?`, [subject]);
  const result = await client.query(query);
  const user = result.rows[0] ?? null;

  if (!user) {
    throw new AppError(
      `User with id ${subject} not found`,
      404,
      `User not found`,
      'Ensure to provide a valid user id corresponding to a registered user',
    );
  }
  res.locals.user = user;
  console.log(chalk.bold.magenta(`${MIDDLEWARE} User found`));
  return next();
}

export default findUser;

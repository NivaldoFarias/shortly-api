import { Request, Response, NextFunction } from 'express';
import SqlString from 'sqlstring';
import chalk from 'chalk';

import { AppError } from './../blueprints/AppError.js';
import { MIDDLEWARE } from './../blueprints/chalk.js';
import client from './../server.js';

async function findUser(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const query = SqlString.format(`SELECT * FROM users WHERE id = ?`, [id]);
  const result = await client.query(query);
  const user = result.rows[0] ?? null;

  if (!user) {
    throw new AppError(
      `User with id ${id} not found`,
      404,
      `User not found`,
      'Ensure to provide a valid user id corresponding to a registered user',
    );
  }
  res.locals.id = id;
  console.log(chalk.bold.magenta(`${MIDDLEWARE} User found`));
  return next();
}

export { findUser };

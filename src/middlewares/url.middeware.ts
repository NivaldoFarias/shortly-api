import { Request, Response, NextFunction } from 'express';
import SqlString from 'sqlstring';
import urlExist from 'url-exist';
import chalk from 'chalk';

import { AppError } from './../blueprints/AppError.js';
import { MIDDLEWARE } from './../blueprints/chalk.js';
import UrlSchema from './../models/url.model.js';
import client from './../server.js';

async function checkUrl(req: Request, res: Response, next: NextFunction) {
  const { url } = req.body;
  const urlExists = await urlExist(url);
  const validate = UrlSchema.validate({ url }, { abortEarly: false });

  if (!urlExists || validate.error) {
    throw new AppError(`Invalid url`, 422, `Invalid url`, 'Ensure to provide a valid url');
  }

  console.log(chalk.bold.magenta(`${MIDDLEWARE} Url exists`));
  res.locals.url = url;
  return next();
}

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

async function findUrl(req: Request, res: Response, next: NextFunction) {
  const { id, shortUrl } = req.params;
  let query: any = null;
  if (id) {
    query = SqlString.format(`SELECT *  FROM urls WHERE id = ?`, [id]);
  } else if (shortUrl) {
    query = SqlString.format(`SELECT *  FROM urls WHERE short_url = ?`, [shortUrl]);
  }
  const result = id || shortUrl ? await client.query(query) : null;
  const url = result.rows[0] ?? null;

  if (!url) {
    throw new AppError(
      `Url not found`,
      404,
      `Url not found`,
      'Ensure to provide a valid parameter that corresponds to a registered url',
    );
  }

  res.locals.url = url;
  console.log(chalk.bold.magenta(`${MIDDLEWARE} Url found`));
  return next();
}

async function urlBelongsToUser(_req: Request, res: Response, next: NextFunction) {
  const { url, user } = res.locals;

  if (url.user_id !== user.id) {
    throw new AppError(
      `Url id ${url.id} does not belong to user id ${user.id}`,
      401,
      `Unathorized`,
      'Ensure that the url belongs to the user',
    );
  }

  res.locals.url = url;
  console.log(chalk.bold.magenta(`${MIDDLEWARE} Url belongs to user`));
  return next();
}

export { checkUrl, findUser, findUrl, urlBelongsToUser };

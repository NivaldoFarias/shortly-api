import { Request, Response, NextFunction } from 'express';
import urlExist from 'url-exist';
import jwt from 'jsonwebtoken';
import chalk from 'chalk';

import { AppError } from './../blueprints/AppError.js';
import { MIDDLEWARE } from './../blueprints/chalk.js';
import UrlSchema from './../models/url.model.js';
import client from './../server.js';

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
  const result = await client.query(`SELECT * FROM users WHERE id = $1`, [subject]);
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
  let result = null;
  if (id) {
    result = await client.query(`SELECT urls.id, urls.short_url AS "shortUrl", url  FROM urls WHERE id = $1`, [id]);
  } else {
    result = await client.query(`SELECT * FROM urls WHERE short_url = $1`, [shortUrl]);
  }
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

export { requireToken, checkUrl, findUser, findUrl };

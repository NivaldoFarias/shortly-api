import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import chalk from 'chalk';

import { API } from '../blueprints/chalk.js';
import client from './../server.js';

async function shortenUrl(_req: Request, res: Response) {
  const {
    url,
    user: { id },
  } = res.locals;
  const shortUrl = nanoid(8);
  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const views = 0;

  await client.query(`INSERT INTO urls (short_url, url, views, created_at, user_id) VALUES ($1, $2, $3, $4, $5)`, [
    shortUrl,
    url,
    views,
    createdAt,
    id,
  ]);

  console.log(chalk.bold.blue(`${API} Url instanciated`));
  return res.status(201).send({ shortUrl });
}

async function getUrl(_req: Request, res: Response) {
  const { url } = res.locals;

  console.log(chalk.bold.blue(`${API} Url sent`));
  return res.status(200).send({ url });
}

async function getShortUrl(_req: Request, res: Response) {
  const {
    url: { id, url },
  } = res.locals;

  await client.query(`UPDATE urls SET views = views + 1 WHERE id = $1`, [id]);

  console.log(chalk.bold.blue(`${API} user redirected, url view count increased`));
  return res.redirect(200, url);
}

export { shortenUrl, getUrl, getShortUrl };

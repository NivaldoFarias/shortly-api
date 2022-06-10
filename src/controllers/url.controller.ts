import { Request, Response } from 'express';
import SqlString from 'sqlstring';
import { nanoid } from 'nanoid';
import chalk from 'chalk';

import { API } from './../blueprints/chalk.js';
import client from './../server.js';

async function shortenUrl(_req: Request, res: Response) {
  const {
    url,
    user: { id },
  } = res.locals;
  const shortUrl = nanoid(8);
  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const views = 0;

  const query = SqlString.format(
    `INSERT INTO urls (short_url, url, views, created_at, user_id) VALUES (?, ?, ?, ?, ?)`,
    [shortUrl, url, views, createdAt, id],
  );
  await client.query(query);

  console.log(chalk.bold.blue(`${API} Url instanciated`));
  return res.status(201).send({ shortUrl });
}

async function getUrl(_req: Request, res: Response) {
  const {
    url: { id, short_url: shortUrl, url },
  } = res.locals;

  console.log(chalk.bold.blue(`${API} Url sent`));
  return res.status(200).send({ id, shortUrl, url });
}

async function openUrl(_req: Request, res: Response) {
  const {
    url: { id, url },
  } = res.locals;

  const query = SqlString.format(`UPDATE urls SET views = views + 1 WHERE id = ?`, [id]);
  await client.query(query);

  console.log(chalk.bold.blue(`${API} user redirected, url view count increased`));
  return res.redirect(200, url);
}

async function deleteUrl(_req: Request, res: Response) {
  const {
    url: { id, url, views },
    user,
  } = res.locals;
  const deletedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const deleteQuery = SqlString.format(`DELETE FROM urls WHERE id = ?`, [id]);
  await client.query(deleteQuery);

  const insertQuery = SqlString.format(
    `INSERT INTO deleted_urls (url, total_views, deleted_at, user_id) VALUES (?, ?, ?, ?)`,
    [url, views, deletedAt, user.id],
  );
  await client.query(insertQuery);

  console.log(chalk.bold.blue(`${API} url deleted, deleted_urls table updated`));
  return res.sendStatus(204);
}

export { shortenUrl, getUrl, openUrl, deleteUrl };

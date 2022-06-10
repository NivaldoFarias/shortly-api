import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import chalk from 'chalk';

import { API } from './../blueprints/chalk.js';
import * as urlRepository from './../repositories/url.repository.js';

async function shortenUrl(_req: Request, res: Response) {
  const {
    url,
    user: { id },
  } = res.locals;
  const shortUrl = nanoid(8);
  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const views = 0;

  await urlRepository.shortenUrl(shortUrl, url, views, createdAt, id);

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

  await urlRepository.openUrl(id);

  console.log(chalk.bold.blue(`${API} user redirected, url view count increased`));
  return res.redirect(200, url);
}

async function deleteUrl(_req: Request, res: Response) {
  const {
    url: { id, url, views },
    user,
  } = res.locals;
  const deletedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

  await urlRepository.deleteUrlQuery(id);
  await urlRepository.insertDeletedUrl(url, views, deletedAt, user.id);

  console.log(chalk.bold.blue(`${API} url deleted, deleted_urls table updated`));
  return res.sendStatus(204);
}

export { shortenUrl, getUrl, openUrl, deleteUrl };

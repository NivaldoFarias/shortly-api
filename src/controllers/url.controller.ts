import { Request, Response } from 'express';
import { nanoid } from 'nanoid';

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
  return res.status(201).send({ shortUrl });
}

export { shortenUrl };

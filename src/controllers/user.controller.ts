import { Request, Response } from 'express';
import SqlString from 'sqlstring';
import chalk from 'chalk';

import { API } from './../blueprints/chalk.js';
import client from './../server.js';

async function getUser(_req: Request, res: Response) {
  const { id } = res.locals;

  const userQuery = SqlString.format(
    `SELECT 
        urls.user_id AS "id",
        users.name AS "name",
        COALESCE(SUM(urls.views), 0) AS "visitCount"
    FROM urls
    JOIN users ON urls.user_id = users.id
    WHERE urls.user_id = ?
    GROUP BY user_id, users.name
    ORDER BY "visitCount" DESC`,
    [id],
  );
  const userResult = await client.query(userQuery);

  const urlsQuery = SqlString.format(
    `SELECT 
        id,
        short_url AS "shortUrl",
        url,
        views AS "visitCount"
    FROM urls
    WHERE user_id = ?
    ORDER BY id ASC`,
    [id],
  );
  const urlsResult = await client.query(urlsQuery);

  const output = processResults(userResult.rows[0], urlsResult.rows);

  console.log(chalk.bold.blue(`${API} User info sent`));
  return res.status(200).send(output);

  function processResults(user: any, urls: any) {
    const output = {
      id: user.id,
      name: user.name,
      visitCount: user.visitCount,
      shortenedUrls: urls.map((url: any) => ({
        id: url.id,
        shortUrl: url.shortUrl,
        url: url.url,
        visitCount: url.visitCount,
      })),
    };
    return { ...output };
  }
}

async function getRanking(_req: Request, res: Response) {
  const query = SqlString.format(
    `SELECT 
      users.id,
      users.name,
      COUNT(urls.id) AS "linksCount",
      COALESCE(SUM(urls.views), 0) AS "visitCount"
    FROM users 
    LEFT JOIN urls ON urls.user_id = users.id
    GROUP BY users.id
    ORDER BY "visitCount" DESC
    LIMIT 10`,
  );
  const result = await client.query(query);

  console.log(chalk.bold.blue(`${API} Users ranking sent`));
  return res.status(200).send(result.rows);
}

export { getUser, getRanking };

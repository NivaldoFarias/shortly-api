import { Request, Response } from 'express';
import SqlString from 'sqlstring';
import chalk from 'chalk';

import { API } from './../blueprints/chalk.js';
import client from './../server.js';

async function getUser(_req: Request, res: Response) {
  const {
    user: { id, name },
  } = res.locals;

  const query = SqlString.format(
    `SELECT 
      users.id AS "userId",
      users.name AS "userName",
      SUM(urls.views) AS "totalVisitCount",
      urls.id AS "urlId",
      urls.short_url AS "shortUrl",
      urls.url AS "url",
      urls.views AS "visitCount"
    FROM urls 
    GROUP BY users.id, urls.id
    LEFT JOIN users ON urls.user_id = users.id
    WHERE users.id = ?`,
    [id],
  );
  const result = await client.query(query);
  const output = processResult(result);

  console.log(chalk.bold.blue(`${API} User info sent`));
  return res.status(200).send(output);

  function processResult(result: any) {
    const output = {
      id: result[0].userId,
      name: result[0].userName,
      visitCount: result[0].totalVisitCount,
      shortenedUrls: result.rows.map((row: any) => ({
        id: row.urlId,
        shortUrl: row.shortUrl,
        url: row.url,
        visitCount: row.visitCount,
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
      SUM(urls.views) AS "visitCount"
    FROM users 
    LEFT JOIN urls ON urls.user_id = users.id
    GROUP BY users.id
    ORDER BY "visitCount" DESC
    LIMIT 10`,
  );
  const result = await client.query(query);

  console.log(chalk.bold.blue(`${API} Users ranking sent`));
  return res.status(200).send(result);
}

export { getUser, getRanking };

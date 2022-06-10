import { Request, Response } from 'express';
import chalk from 'chalk';

import { API } from './../blueprints/chalk.js';
import * as userRepository from './../repositories/user.repository.js';

async function getUser(_req: Request, res: Response) {
  const id = res.locals.id;

  const userResult = await userRepository.userQuery(id);
  const urlsResult = await userRepository.urlsQuery(id);
  const output = processResults(userResult.rows[0], urlsResult.rows);

  console.log(chalk.bold.blue(`${API} User info sent`));
  return res.status(200).send(output);

  function processResults(user: any = {}, urls: any = []) {
    const output = {
      id: user.id,
      name: user.name,
      visitCount: user.visitCount,
      shortenedUrls:
        urls.length > 0
          ? urls.map((url: any) => ({
              id: url.id,
              shortUrl: url.shortUrl,
              url: url.url,
              visitCount: url.visitCount,
            }))
          : urls,
    };
    return { ...output };
  }
}

async function getRanking(_req: Request, res: Response) {
  const result = await userRepository.rankingQuery();

  console.log(chalk.bold.blue(`${API} Users ranking sent`));
  return res.status(200).send(result.rows);
}

export { getUser, getRanking };

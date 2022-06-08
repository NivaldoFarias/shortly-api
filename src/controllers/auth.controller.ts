import { Request, Response } from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import chalk from 'chalk';

import client from './../server.js';
import { DATABASE } from './../blueprints/chalk.js';

dotenv.config();

export async function signUp(_req: Request, res: Response) {
  const { name, email, password } = res.locals;
  const cryptPass = bcrypt.hashSync(password, 10);

  await client.query(`INSERT INTO accounts (name, email, password) VALUES ($1, $2, $3)`, [name, email, cryptPass]);
  console.log(chalk.blue(`${DATABASE} ${email} registered successfully`));
  return res.sendStatus(201);
}

export async function signIn(_req: Request, res: Response) {
  const {
    user: { id, email },
    token,
  } = res.locals;
  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

  await client.query(`INSERT INTO sessions (user_id, token, created_at, active) VALUES ($1, $2, $3, $4)`, [
    id,
    token,
    createdAt,
    true,
  ]);
  console.log(chalk.blue(`${DATABASE} ${email} signed in successfully`));
  return res.status(200).send(token);
}

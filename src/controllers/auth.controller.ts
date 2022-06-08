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
  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

  await client.query(`INSERT INTO users (name, email, password, created_at) VALUES ($1, $2, $3, $4)`, [
    name,
    email,
    cryptPass,
    createdAt,
  ]);
  console.log(chalk.blue(`${DATABASE} ${email} registered successfully`));
  return res.sendStatus(201);
}

export async function signIn(_req: Request, res: Response) {
  const {
    user: { id, email },
    token,
  } = res.locals;

  await client.query(`UPDATE users SET active = true WHERE id = $1`, [id]);
  console.log(chalk.blue(`${DATABASE} ${email} signed in successfully`));
  return res.status(200).send(token);
}

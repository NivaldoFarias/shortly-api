import { Request, Response } from 'express';
import SqlString from 'sqlstring';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import chalk from 'chalk';

import client from './../server.js';
import { API } from './../blueprints/chalk.js';

dotenv.config();

async function signUp(_req: Request, res: Response) {
  const { name, email, password } = res.locals;
  const cryptPass = bcrypt.hashSync(password, 10);
  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const query = SqlString.format(`INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)`, [
    name,
    email,
    cryptPass,
    createdAt,
  ]);
  await client.query(query);
  console.log(chalk.blue(`${API} ${email} registered successfully`));
  return res.sendStatus(201);
}

async function signIn(_req: Request, res: Response) {
  const {
    user: { id, email },
    token,
  } = res.locals;

  const query = SqlString.format(`UPDATE users SET active = true WHERE id = ?`, [id]);
  await client.query(query);
  console.log(chalk.blue(`${API} ${email} signed in successfully`));
  return res.status(200).send({ token });
}

export { signUp, signIn };

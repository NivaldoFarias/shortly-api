import { Request, Response } from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import chalk from 'chalk';

import { API } from './../blueprints/chalk.js';
import * as authRepository from './../repositories/auth.repository.js';

dotenv.config();

async function signUp(_req: Request, res: Response) {
  const { name, email, password } = res.locals;
  const cryptPass = bcrypt.hashSync(password, 10);
  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

  await authRepository.signUp(name, email, cryptPass, createdAt);
  console.log(chalk.blue(`${API} ${email} registered successfully`));
  return res.sendStatus(201);
}

async function signIn(_req: Request, res: Response) {
  const {
    user: { id, email },
    token,
  } = res.locals;

  await authRepository.signIn(id);
  console.log(chalk.blue(`${API} ${email} signed in successfully`));
  return res.status(200).send({ token });
}

export { signUp, signIn };

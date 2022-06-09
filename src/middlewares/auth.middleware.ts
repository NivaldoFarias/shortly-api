import { Request, Response, NextFunction } from 'express';
import { stripHtml } from 'string-strip-html';
import SqlString from 'sqlstring';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import chalk from 'chalk';
dotenv.config();

import SignUpSchema from './../models/signup.model.js';
import SignInSchema from './../models/signin.model.js';
import { AppError } from './../blueprints/AppError.js';
import { MIDDLEWARE } from './../blueprints/chalk.js';
import client from './../server.js';

export async function validateSignUp(req: Request, res: Response, next: NextFunction) {
  const { password } = req.body;
  const name = stripHtml(req.body.name).result.trim();
  const email = stripHtml(req.body.email).result.trim();

  const validate = SignUpSchema.validate(
    {
      name,
      email,
      password,
    },
    { abortEarly: false },
  );
  if (validate.error) {
    throw new AppError('Invalid input', 422, `Invalid input`, validate.error.details.map((e) => e.message).join(', '));
  }
  res.locals.name = name;
  res.locals.email = email;
  res.locals.password = password;
  console.log(chalk.magenta(`${MIDDLEWARE} Valid sign up input`));
  return next();
}

export async function validateSignIn(req: Request, res: Response, next: NextFunction) {
  const password = req.body.password;
  const email = stripHtml(req.body.email).result.trim();

  const validate = SignInSchema.validate({ email, password }, { abortEarly: false });

  if (validate.error) {
    throw new AppError(`Invalid input`, 422, 'Invalid input', validate.error.details.map((e) => e.message).join(', '));
  }

  res.locals.email = email;
  res.locals.password = password;
  console.log(chalk.magenta(`${MIDDLEWARE} Valid sign in input`));
  return next();
}

export async function emailIsUnique(_req: Request, res: Response, next: NextFunction) {
  const { email } = res.locals;

  const query = SqlString.format(`SELECT * FROM users WHERE email = ?`, [email]);
  const result = await client.query(query);
  const user = result.rows[0] || null;

  if (user) {
    throw new AppError(
      `Email ${email} is already registered`,
      409,
      `Email already registered`,
      'Ensure to provide an email that is not already registered',
    );
  }
  console.log(chalk.magenta(`${MIDDLEWARE} Email is unique`));
  return next();
}

export async function findUser(req: Request, res: Response, next: NextFunction) {
  const email = stripHtml(req.body.email).result.trim();

  const query = SqlString.format(`SELECT * FROM users WHERE email = ?`, [email]);
  const result = await client.query(query);
  const user = result.rows[0] || null;

  if (!user) {
    throw new AppError(
      `Email ${email} is not registered`,
      404,
      'User not found',
      'Ensure to provide a valid email corresponding to a registered user',
    );
  }
  res.locals.user = user;
  console.log(chalk.magenta(`${MIDDLEWARE} User found`));
  return next();
}

export async function validatePassword(req: Request, res: Response, next: NextFunction) {
  const password = req.body.password;
  const { user } = res.locals;

  if (!bcrypt.compareSync(password, user.password)) {
    throw new AppError(
      `Invalid password`,
      401,
      `Invalid password`,
      'Ensure to provide a valid password corresponding to the provided email',
    );
  }
  console.log(chalk.magenta(`${MIDDLEWARE} Valid password`));
  return next();
}

export async function createToken(_req: Request, res: Response, next: NextFunction) {
  const {
    user: { id },
  } = res.locals;
  const data = {};
  const secretKey = process.env.JWT_SECRET || 'JWT_SECRET';
  const config = { expiresIn: process.env.JWT_EXPIRESIN, subject: id.toString() };
  const token = jwt.sign(data, secretKey, config);

  res.locals.token = token;
  console.log(chalk.magenta(`${MIDDLEWARE} Token created`));
  return next();
}

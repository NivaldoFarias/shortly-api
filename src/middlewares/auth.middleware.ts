import { Request, Response, NextFunction } from 'express';
import { stripHtml } from 'string-strip-html';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

import client from './../server.js';
import SignUpSchema from './../models/signup.model.js';
import SignInSchema from './../models/signin.model.js';

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
  console.log('teste');
  if (validate.error) {
    throw new AppError('Invalid input', 422, `Invalid input`, validate.error.details.map((e) => e.message).join(', '));
  }
  res.locals.name = name;
  res.locals.email = email;
  res.locals.password = password;
  next();
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
  next();
}

export async function emailIsUnique(_req: Request, res: Response, next: NextFunction) {
  const { email } = res.locals;
  const user = await client.query(`SELECT * FROM users WHERE email = $1`, [email]);

  if (user) {
    throw new AppError(
      `Email already registered`,
      409,
      `Email ${email} is already registered`,
      'Ensure to provide an email that is not already registered',
    );
  }
  return next();
}

export async function findUser(req: Request, res: Response, next: NextFunction) {
  const email = stripHtml(req.body.email).result.trim();

  const user = await client.query(`SELECT * FROM users WHERE email = $1`, [email]);

  if (!user) {
    throw new AppError(
      'User not found',
      404,
      `Email ${email} is not registered`,
      'Ensure to provide a valid email corresponding to a registered user',
    );
  }
  res.locals.user = user;
  return next();
}

export async function validatePassword(req: Request, res: Response, next: NextFunction) {
  const password = req.body.password;
  const { user } = res.locals;

  if (!bcrypt.compareSync(password, user.password)) {
    throw new AppError(
      'Wrong password',
      401,
      `Invalid password`,
      'Ensure to provide a valid password corresponding to the provided email',
    );
  }
  return next();
}

export async function createToken(_req: Request, res: Response, next: NextFunction) {
  const data = { user: res.locals.user };
  const secretKey = process.env.JWT_SECRET || 'JWT_SECRET';
  const config = { expiresIn: 60 * 60 * 24 }; // one day in seconds
  const token = jwt.sign(data, secretKey, config);

  res.locals.token = token;
  next();
}

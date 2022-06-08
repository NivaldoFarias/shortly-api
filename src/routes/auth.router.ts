import { Router } from 'express';

import { signUp, signIn } from './../controllers/auth.controller.js';
import {
  validateSignUp,
  validateSignIn,
  emailIsUnique,
  findUser,
  validatePassword,
  createToken,
} from './../middlewares/auth.middleware.js';

const authRouter = Router();

authRouter.post('/api/auth/sign-up', validateSignUp, emailIsUnique, signUp);
authRouter.post('/api/auth/sign-in', validateSignIn, findUser, validatePassword, createToken, signIn);

export default authRouter;

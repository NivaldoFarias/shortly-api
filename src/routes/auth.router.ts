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

authRouter.post('/sign-up', validateSignUp, emailIsUnique, signUp);
authRouter.post('/sign-in', validateSignIn, findUser, validatePassword, createToken, signIn);

export default authRouter;

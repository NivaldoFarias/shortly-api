import { Router } from 'express';

import { findUser } from './../middlewares/user.middleware.js';
import { getUser, getRanking } from './../controllers/user.controller.js';
import requireToken from './../services/requireToken.js';

const userRouter = Router();

userRouter.get(`/users/:id`, requireToken, findUser, getUser);
userRouter.get(`/ranking`, getRanking);

export default userRouter;

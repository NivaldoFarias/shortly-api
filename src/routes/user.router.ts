import { Router } from 'express';

import { getUser, getRanking } from './../controllers/user.controller.js';
import requireToken from './../services/requireToken.js';
import findUser from './../services/findUser.js';

const userRouter = Router();

userRouter.get(`/users/:id`, requireToken, findUser, getUser);
userRouter.get(`/ranking`, getRanking);

export default userRouter;

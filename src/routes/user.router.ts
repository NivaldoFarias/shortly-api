import { Router } from 'express';

import { getUser } from './../controllers/user.controller.js';
import requireToken from './../services/requireToken.js';
import findUser from './../services/findUser.js';

const userRouter = Router();

userRouter.get(`/users/:id`, requireToken, findUser, getUser);
//userRouter.get(`/ranking`, findUser, getRanking);

export default userRouter;

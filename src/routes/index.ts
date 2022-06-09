import express from 'express';

import authRouter from './auth.router.js';
import urlRouter from './url.router.js';
import userRouter from './user.router.js';

const router = express.Router();
router.use(authRouter);
router.use(urlRouter);
router.use(userRouter);

export default router;

import express from 'express';

import authRouter from './auth.router.js';

const router = express.Router();

router.use(authRouter);

export default router;

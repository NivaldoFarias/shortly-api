import { Router } from 'express';

import { checkUrl, findUser, requireToken } from './../middlewares/url.middeware.js';
import { shortenUrl } from './../controllers/url.controller.js';

const urlRouter = Router();

urlRouter.post('urls/shorten', requireToken, checkUrl, findUser, shortenUrl);

export default urlRouter;

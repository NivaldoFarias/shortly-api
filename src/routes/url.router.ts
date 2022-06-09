import { Router } from 'express';

import { checkUrl, findUser, requireToken, findUrl } from './../middlewares/url.middeware.js';
import { shortenUrl, getUrl, getShortUrl } from './../controllers/url.controller.js';

const PATH = '/url';
const urlRouter = Router();

urlRouter.get(`${PATH}/:id`, findUrl, getUrl);
urlRouter.get(`${PATH}/open/:shortUrl`, findUrl, getShortUrl);
urlRouter.post(`${PATH}/shorten`, requireToken, checkUrl, findUser, shortenUrl);

export default urlRouter;

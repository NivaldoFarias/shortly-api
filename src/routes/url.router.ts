import { Router } from 'express';

import { checkUrl, findUrl, urlBelongsToUser } from './../middlewares/url.middeware.js';
import { shortenUrl, getUrl, getShortUrl, deleteUrl } from './../controllers/url.controller.js';
import requireToken from './../services/requireToken.js';
import findUser from './../services/findUser.js';

const PATH = '/url';
const urlRouter = Router();

urlRouter.get(`${PATH}/:id`, findUrl, getUrl);
urlRouter.get(`${PATH}/open/:shortUrl`, findUrl, getShortUrl);
urlRouter.post(`${PATH}/shorten`, requireToken, checkUrl, findUser, shortenUrl);
urlRouter.delete(`${PATH}/:id`, requireToken, findUser, findUrl, urlBelongsToUser, deleteUrl);

export default urlRouter;

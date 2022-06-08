import express, { json, Request, Response } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import chalk from 'chalk';
import cors from 'cors';
dotenv.config();

import { SERVER } from './blueprints/chalk.js';
import router from './routes/index.js';
import ExceptionHandler from './middlewares/errors.middleware.js';

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(json());
app.use(helmet());
app.use(router);
app.use(ExceptionHandler);

app.get('/', async (_req: Request, res: Response) => res.send('Online'));
app.listen(PORT, () => console.log(chalk.bold.yellow(`${SERVER} Server started on port ${PORT}`)));

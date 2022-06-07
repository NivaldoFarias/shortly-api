import express, { json, Request, Response } from 'express';
import cors from 'cors';
import chalk from 'chalk';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config();

import { SERVER } from './blueprints/chalk.js';

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(json());
app.use(helmet());

app.get('/', (_req: Request, res: Response) => res.send('Online'));
app.listen(PORT, () => console.log(chalk.bold.yellow(`${SERVER} Server started on port ${PORT}`)));

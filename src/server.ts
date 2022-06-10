import pg, { ClientConfig } from 'pg';
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config();

import { API, ERROR } from './blueprints/chalk.js';

const { Client } = pg;
const connectionString = process.env.DATABASE_URL ?? '';
const databaseConfig: ClientConfig = { connectionString };
if (process.env.MODE === 'PROD') {
  databaseConfig.ssl = {
    rejectUnauthorized: false,
  };
}

const client = new Client(databaseConfig);

try {
  await client.connect();
  console.log(chalk.bold.blue(`${API} Connected to database`));
} catch (error) {
  console.log(chalk.bold.red(`${ERROR} Internal server error while connecting to database ~ ${error}`));
}

export default client;

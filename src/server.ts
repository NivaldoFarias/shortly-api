import pg from 'pg';
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config();

import { API, ERROR } from './blueprints/chalk.js';

const { Client } = pg;
const databaseConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};
const client = new Client(databaseConfig);

try {
  await client.connect();
  console.log(chalk.bold.blue(`${API} Connected to database`));
} catch (error) {
  console.log(chalk.bold.red(`${ERROR} Internal server error while connecting to database ~ ${error}`));
}

export default client;

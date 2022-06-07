import pg from 'pg';
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config();

import { DATABASE, ERROR } from './../blueprints/chalk.js';

const { Client } = pg;
const databaseConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: process.env.MODE === 'PROD' ? false : true,
  },
};
const client = new Client(databaseConfig);

try {
  await client.connect();
  console.log(chalk.bold.blue(`${DATABASE} Connected to database`));
} catch (error) {
  console.log(chalk.red(`${ERROR} Internal server error while connecting to database`));
}

export default client;

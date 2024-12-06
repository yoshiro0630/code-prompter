import { Knex } from 'knex';
import path from 'path';

const config: Knex.Config = {
  client: 'better-sqlite3',
  connection: {
    filename: path.join(process.cwd(), 'data', 'bolt.db')
  },
  useNullAsDefault: true,
  migrations: {
    directory: './migrations'
  }
};

export default config;
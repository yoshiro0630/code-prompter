module.exports = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: './data/bolt.db'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './src/services/database/migrations'
    }
  }
};
// Update with your config settings.
module.exports = {
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'postgres',
    password : 'root',

  },

  migrations: {
    tableName: 'knex_migrations'
  }

};

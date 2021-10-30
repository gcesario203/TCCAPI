
exports.up = function(knex) {
    return knex.schema.createTable('usuarios',table=>{
        table.increments('id').primary()
        table.string('nome').notNull()
        table.string('email').notNull().unique()
        table.string('senha').notNull()
        table.timestamp('data_de_criacao').defaultTo(knex.fn.now());
        table.timestamp('data_de_alteracao').defaultTo(knex.fn.now());
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('usuarios')
};

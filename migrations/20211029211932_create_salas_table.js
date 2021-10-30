
exports.up = function(knex) {
    return knex.schema.createTable('salas',table=>{
        table.increments('id').primary()
        table.string('nome').notNull()
        table.integer('usuarioId').references('id').inTable('usuarios')
        table.timestamp('data_de_criacao').defaultTo(knex.fn.now());
        table.timestamp('data_de_alteracao').defaultTo(knex.fn.now());
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('salas')
};

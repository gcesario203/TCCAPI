
exports.up = function(knex) {
    return knex.schema.createTable('coreTable',table=>{
        table.increments('id').primary()
        table.integer('usuarioId').references('id').inTable('usuarios')
        table.integer('salaId').references('id').inTable('salas')
        table.integer('mensagemId').references('id').inTable('mensagens')
        table.timestamp('data_de_criacao').defaultTo(knex.fn.now());
    })  
};

exports.down = function(knex) {
    return knex.schema.dropTable('coreTable')
};

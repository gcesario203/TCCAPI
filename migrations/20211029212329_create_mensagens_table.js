
exports.up = function(knex) {
    return knex.schema.createTable('mensagens',table=>{
        table.increments('id').primary()
        table.string('conteudo').notNull()
        table.integer('salaId').references('id').inTable('salas')
        table.timestamp('data_de_criacao').defaultTo(knex.fn.now());
    })  
};

exports.down = function(knex) {
    return knex.schema.dropTable('mensagens')
};


exports.up = function(knex) {
    return knex.schema.createTable('usersxrooms',table=>{
        table.increments('id').primary()
        table.integer('usuarioId').references('id').inTable('usuarios').notNull().onUpdate('CASCADE').onDelete('CASCADE')
        table.integer('salaId').references('id').inTable('salas').notNull().onUpdate('CASCADE').onDelete('CASCADE')
        table.timestamp('data_de_criacao').defaultTo(knex.fn.now());
    })  
};

exports.down = function(knex) {
    return knex.schema.dropTable('usersxrooms')
};

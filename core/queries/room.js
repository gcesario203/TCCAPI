module.exports = app => {

    const room = {
        getRoomsUserRelation: `
        select salas.nome as roomName, count(usuarios.nome) AS usrQtde, usersxrooms."salaId"
                            from usersxrooms
                            inner join usuarios
                                ON usersxrooms."usuarioId" = usuarios.id
                            inner join salas
                                on usersxrooms."salaId" = salas.id
                            GROUP BY salas.nome, usersxrooms."salaId"
                            OFFSET #offset
                            LIMIT #limit;
        `,
        getRoomsFromUser: `
        select salas.id, salas.nome, salas.tipo, usersxrooms.data_de_criacao as criado_em
                from usersxrooms
                    inner join usuarios
                        ON usersxrooms."usuarioId" = usuarios.id
                    inner join salas
                        on usersxrooms."salaId" = salas.id
                    where usersxrooms."usuarioId" = #userId
                    OFFSET #offset
                            LIMIT #limit;
        `,
        getUsersFromRoom: `
        select usuarios.id, usuarios.nome, usersxrooms.data_de_criacao as criado_em
                from usersxrooms
                    inner join usuarios
                        ON usersxrooms."usuarioId" = usuarios.id
                    inner join salas
                        on usersxrooms."salaId" = salas.id
                    where usersxrooms."salaId" = #roomId
                    OFFSET #offset
                            LIMIT #limit;
        `,
    }
    return room
}
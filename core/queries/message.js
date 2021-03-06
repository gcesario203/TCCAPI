module.exports = app => {

    const message = {
        getMessagesByRoom: `
        select mensagens.conteudo,  usuarios.nome, mensagens.data_de_criacao
            from corerelations
        inner join salas
            on corerelations."salaId" = salas.id
        inner join mensagens
            on corerelations."mensagemId" = mensagens.id
        inner join usuarios
            on corerelations."usuarioId" = usuarios.id
            WHERE corerelations."salaId" = #roomId
        GROUP BY usuarios.nome,
                 corerelations."salaId",
                 mensagens.conteudo,
                 mensagens.data_de_criacao
        ORDER BY mensagens.data_de_criacao ASC
        `,
        getMessagesByRoomAndUse: `
        select mensagens.conteudo,  salas.nome, mensagens.data_de_criacao
        from corerelations
    inner join salas
        on corerelations."salaId" = salas.id
    inner join mensagens
        on corerelations."mensagemId" = mensagens.id
        WHERE corerelations."salaId" = #roomId
            AND corerelations."usuarioId" = #userId
    GROUP BY salas.nome,
             corerelations."salaId",
             mensagens.conteudo,
             mensagens.data_de_criacao
    ORDER BY mensagens.data_de_criacao ASC
        `
    }
    return message
}
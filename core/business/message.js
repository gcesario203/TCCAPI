module.exports = app => {
    const { existOrError, validId, notExistsOrError } = app.utils.validation
    const { dbNames } = app.utils.consts
    const { getMessagesByRoomAndUse, getMessagesByRoom } = app.core.queries.message

    const syncMessages = async (req, res) => {
        // Instancia do objeto com o id da sala e suas mensagens
        const lMessagesArray = {
            salaId: req.body.salaId,
            mensagens: req.body.mensagens
        }

        try {
            const existId = await app.db(dbNames.rooms)
                .where({ id: lMessagesArray.salaId })
                .first()


            existOrError(existId, "Sala inexistente")
            existOrError(lMessagesArray.mensagens, "Nenhuma mensagem para ser sincronizada")
        } catch (msg) {
            return res.status(400).send(msg)
        }

        lMessagesArray.mensagens.forEach(async (lMsg)  =>
        {
            await app.db.transaction(async trx =>{
                await app.db(dbNames.messages)
                .transacting(trx)
                .insert({ conteudo: lMsg.conteudo, salaId: lMessagesArray.salaId }, 'id')
                .then( async msgId => {
                     await app.db(dbNames.coreRelation)
                        .transacting(trx)
                        .insert({
                            usuarioId: lMsg.usuarioId,
                            salaId: lMessagesArray.salaId,
                            mensagemId: msgId[0]
                        })

                })
                .then(trx.commit)
                .catch(trx.rollback)
            })
            .then(() => res.status(200).send())
            .catch(err => res.status(500).send(err))
        })
    }

    const callMessagesByRoom = async (req, res) => {
        try {
            validId(req.params.id, "ID invalido")
            const existId = await app.db(dbNames.rooms)
                .where({ id: req.params.id })
                .first()

            existOrError(existId, "Sala inexistente")
        } catch (msg) {
            return res.status(400).send(msg)
        }
        app.db
            .raw(getMessagesByRoom
                .replace('#roomId', req.params.id))
            .then(messages => res.json({ messages: messages.rows }))
            .catch(err => res.status(500).send(err))
    }

    return { syncMessages, callMessagesByRoom }
}
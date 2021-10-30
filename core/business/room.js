module.exports = app => {
    const { existOrError, validId, notExistsOrError } = app.utils.validation
    const { roomType, dbNames } = app.utils.consts
    const { encryptPassword } = app.utils.utility
    const { getRoomsUserRelation, getRoomsFromUser, getUsersFromRoom} = app.core.queries.room

    const save = async (req, res) => {
        const room = {
            id: req.body.id,
            nome: req.body.nome,
            usuarioId: req.body.usuarioId,
            tipo: req.body.tipo,
            chave: req.body.chave
        }
        if (req.params.id) room.id = req.params.id
        try {
            existOrError(room.nome, "Nome não informado")
            existOrError(room.usuarioId, "Dono da Sala não informado")

            if (room.tipo !== roomType.public) {
                existOrError(room.tipo, "Tipo de sala não informado")
            }

            const userId = await app.db(dbNames.users)
                .where({ id: room.usuarioId })
                .first()

            existOrError(userId, "Usuário inexistente")

            if (room.tipo === roomType.private) {
                existOrError(room.chave, "Sala privada sem chave informada")
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (room.tipo === roomType.private) {
            room.chave = encryptPassword(room.chave)
        }
        else {
            room.chave = null
        }

        if (room.id) {
            sala.data_de_alteracao = new Date()
            app.db(dbNames.rooms)
                .update(room)
                .where({ id: room.id })
                .then(_ => res.status(202).send())
                .catch(err => res.status(500).send({ error: err.detail }))
        } else {
            await app.db.transaction(async trx => {
                await app.db(dbNames.rooms)
                    .transacting(trx)
                    .insert(room, 'id')
                    .then(async roomId => {
                        await app.db(dbNames.userRoomRelation)
                                  .transacting(trx)
                                  .insert({usuarioId: room.usuarioId, salaId: roomId[0]})
                    })
                    .then(trx.commit)
                    .catch(trx.rollback)
            })
                .then(() => res.status(200).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            validId(req.params.id, "Usar um id valido")
            existOrError(req.params.id, "Código da Sala não informado")

            const rowsDelete = await app.db(dbNames.rooms)
                .where({ id: req.params.id }).del()


            existOrError(rowsDelete, "Sala não foi encontrada")

            res.status(204).send()
        } catch (msg) {
            return res.status(400).send(msg)
        }
    }

    const limit = 3

    const get = async (req, res) => {
        const page = req.query.page || 1

        const result = await app.db(dbNames.rooms)
            .count('id')
            .first()

        const count = parseInt(result.count)

        app.db(dbNames.rooms)
            .limit(limit)
            .offset(page * limit - limit)
            .then(rooms => res.json({ rooms, count, limit }))
            .catch(err => res.status(500).send({ error: err.detail }))
    }

    const getById = async (req, res) => {
        try {
            validId(req.params.id, "ID invalido")

            const existId = await app.db(dbNames.rooms)
                .where({ id: req.params.id })
                .first()

            existOrError(existId, "Sala inexistente")
        } catch (msg) {
            return res.status(400).send(msg)
        }
        await app.db(dbNames.rooms)
            .where({ id: req.params.id })
            .first()
            .then(room => res.json(room))
            .catch(err => res.status(500).send({ error: err.detail }))
    }

    const joinRoom = async (req, res) => {
        const userxroom = {
            usuarioId: req.body.usuarioId,
            salaId: req.body.salaId
        }
        try {
            const checkRoomId = await app.db(dbNames.rooms)
                .where({ id: userxroom.salaId })
                .first()

            existOrError(checkRoomId, "Sala inexistente")

            const checkUserId = await app.db(dbNames.users)
                .where({ id: userxroom.usuarioId })
                .first()

            existOrError(checkUserId, "Usuário inexistente")

            const userInTheRoom = await app.db(dbNames.userRoomRelation)
                .where({ usuarioId: userxroom.usuarioId })
                .andWhere({ salaId: userxroom.salaId })
                .first()

            existOrError(!userInTheRoom, "Usuário já esta na sala")
        } catch (msg) {
            return res.status(400).send(msg)
        }

        app.db(dbNames.userRoomRelation)
            .insert(userxroom)
            .then(_ => res.status(201).send())
            .catch(err => res.status(500).send({ error: err.detail }))
    }

    const disconnectFromRoom = async (req, res) => {
        const userxroom = {
            usuarioId: req.body.usuarioId,
            salaId: req.body.salaId
        }

        try {
            const checkRoomId = await app.db(dbNames.rooms)
                .where({ id: userxroom.salaId })
                .first()

            existOrError(checkRoomId, "Sala inexistente")

            const checkUserId = await app.db(dbNames.users)
                .where({ id: userxroom.usuarioId })
                .first()

            existOrError(checkUserId, "Usuário inexistente")

            const rowsDelete = await app.db(dbNames.userRoomRelation)
                .where({ usuarioId: userxroom.usuarioId })
                .andWhere({ salaId: userxroom.salaId })
                .del()

            existOrError(rowsDelete, "Usuário não se encontra na sala")

            res.status(204).send()
        } catch (msg) {
            return res.status(400).send(msg)
        }
    }

    const getRoomsXUsers = async (req, res) => {
        const page = req.query.page || 1
        app.db
            .raw(getRoomsUserRelation
                .replace('#offset', page * limit - limit)
                .replace('#limit', limit))
            .then(rooms => res.json({ rooms: rooms.rows, limit }))
            .catch(err => res.status(500).send(err))

    }

    const getRoomsXUsersByUserId = async (req, res) =>{
        const page = req.query.page || 1
        try {
            validId(req.params.id, "ID invalido")
            const existId = await app.db(dbNames.users)
                .where({ id: req.params.id })
                .first()

            existOrError(existId, "Usuário inexistente")
        } catch (msg) {
            return res.status(400).send(msg)
        }
        app.db
            .raw( getRoomsFromUser
                .replace('#userId', req.params.id)
                .replace('#offset', page * limit - limit)
                .replace('#limit', limit))
            
            .then(rooms => res.json({ rooms: rooms.rows, limit }))
            .catch(err => res.status(500).send(err))
    }

    const getUsersFromRoomId = async (req, res) =>{
        const page = req.query.page || 1
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
            .raw( getUsersFromRoom
                .replace('#roomId', req.params.id)
                .replace('#offset', page * limit - limit)
                .replace('#limit', limit))
            
            .then(rooms => res.json({ rooms: rooms.rows, limit }))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, joinRoom, disconnectFromRoom, getRoomsXUsers, getRoomsXUsersByUserId, getUsersFromRoomId }
}
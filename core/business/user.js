module.exports = app => {
    const { existOrError, notExistsOrError, equalsOrError, validEmail, validId, } = app.utils.validation
    const { encryptPassword } = app.utils.utility
    const { dbNames } = app.utils.consts



    const save = async (req, res) => {
        const user = { ...req.body }
        if (req.params.id) user.id = req.params.id

        try {
            existOrError(user.nome, "Nome não informado")

            if (!user.id) {
                existOrError(user.email, "E-mail não informado")
                validEmail(user.email, "E-mail invalido")
                existOrError(user.senha, "Senha não informada")
                existOrError(user.confirmsenha, "É necessário confirmar sua senha")
                equalsOrError(user.senha, user.confirmsenha, "Senhas não se coincidem")
            }

            const userFromDb = await app.db(dbNames.users)
                .where({ email: user.email }).first()
            if (!user.id) {
                notExistsOrError(userFromDb, "Usuário já cadastrado")
            }
        } catch (msg) {
            return res.status(400).send({ error: msg })
        }

        user.senha = encryptPassword(req.body.senha)

        delete user.confirmsenha

        if (user.id) {
            const userFromDb = await app.db(dbNames.users)
            .where({ email: user.email }).first()
            
            user.senha = userFromDb.senha
            user.data_de_alteracao = new Date()
            app.db(dbNames.users)
                .update(user)
                .where({ id: user.id })

                .then(_ => res.status(202).send())
                .catch(err => res.status(500).send({ error: err }))
        } else {
            app.db(dbNames.users)
                .insert(user)
                .then(_ => res.status(201).send())
                .catch(err => res.status(500).send({ error: err }))
        }
    }

    const limit = 10
    const get = async (req, res) => {
        const page = req.query.page || 1

        const result = await app.db(dbNames.users)

            .count('id')
            .first()

        const count = parseInt(result.count)


        app.db(dbNames.users)
            .select('id', 'nome', 'email')

            .limit(limit)
            .offset(page * limit - limit)
            .then(users => res.json({ users, count, limit }))
            .catch(err => res.status(500).send({ error: err }))
    }

    const getById = async (req, res) => {
        try {
            validId(req.params.id, "ID invalido")

            const existId = await app.db(dbNames.users)
                .where({ id: req.params.id })
                .first()

            existOrError(existId, "Usuário inexistente")
        } catch (msg) {
            return res.status(400).send({ error: msg })
        }
        app.db(dbNames.users)
            .select('id', 'nome', 'email')
            .where({ id: req.params.id })

            .then(user => res.json(user))
            .catch(err => res.status(500).send({ error: err }))
    }

    const remove = async (req, res) => {
        try {
            const rowsUpdated = await app.db(dbNames.users)
                .where({ id: req.params.id })
                .del()

            existOrError(rowsUpdated, "Usuário inexistente")

            return res.status(204).send()
        } catch (msg) {
            return res.status(400).send({ error: msg })
        }
    }

    return { save, get, getById, remove }
}
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const { existOrError, notExistsOrError, equalsOrError, validEmail, validId, } = app.utils.validation
    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
        const user = { ...req.body }
        if (req.params.id) user.id = req.params.id

        try {
            existOrError(user.nome, "Nome não informado")
            existOrError(user.email, "E-mail não informado")
            validEmail(user.email, "E-mail invalido")
            existOrError(user.senha, "Senha não informada")
            existOrError(user.confirmsenha, "É necessário confirmar sua senha")
            equalsOrError(user.senha, user.confirmsenha, "Senhas não se coincidem")

            const userFromDb = await app.db('usuarios')
                .where({ email: user.email }).first()
            if (!user.id) {
                notExistsOrError(userFromDb, "Usuário já cadastrado")
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }

        user.senha = encryptPassword(req.body.senha)

        delete user.confirmsenha

        if (user.id) {
            app.db('usuarios')
                .update(user)
                .where({ id: user.id })
                
                .then(_ => res.status(202).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('usuarios')
                .insert(user)
                .then(_ => res.status(201).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const limit = 3
    const get = async (req, res) => {
        const page = req.query.page || 1

        const result = await app.db('usuarios')
                                
                                .count('id')
                                .first()

        const count = parseInt(result.count)

        
        app.db('usuarios')
            .select('id', 'nome', 'email')
            
            .limit(limit)
            .offset(page*limit-limit)
            .then(users => res.json({data:users,count,limit}))
            .catch(err => res.status(500).send(err))
    }

    const getById = async (req, res) => {
        try {
            validId(req.params.id, "ID invalido")

            const existId = await app.db('usuarios')
                .where({ id: req.params.id })
                .first()

            existOrError(existId, "Usuário inexistente")
        } catch (msg) {
            return res.status(400).send(msg)
        }
        app.db('usuarios')
            .select('id', 'nome', 'email')
            .where({ id: req.params.id })
            
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            const rowsUpdated = await app.db('usuarios')
                .update({ deletedAt: new Date() })
                .where({ id: req.params.id })

            existOrError(rowsUpdated, "Usuário inexistente")

            return res.status(204).send()
        } catch (msg) {
            return res.status(400).send(msg)
        }
    }

    return { save, get, getById, remove }
}
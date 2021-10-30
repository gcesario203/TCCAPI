module.exports = app => {
    const { authenticate } = app.config.passport
    const { save, get, getById,remove} = app.core.business.user

    app.route('/users')
        // .all(authenticate())
        .post(save)
        .get(get)

    app.route('/users/:id')
        // .all(authenticate())
        .get(getById)
        .put(save)
        .delete(remove)
}
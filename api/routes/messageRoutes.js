module.exports = app => {
    const { authenticate } = app.config.passport
    const { syncMessages, callMessagesByRoom} = app.core.business.message

    app.route('/messages')
        .post(syncMessages)

    app.route('/messages/:id')
        .all(authenticate())
        .get(callMessagesByRoom)
}
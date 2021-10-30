module.exports = app => {
    const { authenticate } = app.config.passport
    const { save,
            get,
            getById,
            remove,
            joinRoom,
            disconnectFromRoom,
            getRoomsXUsers,
            getRoomsXUsersByUserId, 
            getUsersFromRoomId} = app.core.business.room

    app.route('/rooms')
        // .all()
        .post(authenticate(save))
        .get(get)

    app.route('/rooms/:id')
        // .all(authenticate())
        .get(getById)
        .put(authenticate(save))
        .delete(authenticate(remove))

    app.route('/rooms/join')
        .all(authenticate())
        .post(joinRoom)
        .delete(disconnectFromRoom)

    app.route('/rooms/all')
        .get(getRoomsXUsers)

    app.route('/rooms/user/:id')
        .all(authenticate())
        .get(getRoomsXUsersByUserId)

    app.route('/rooms/room/:id')
        // .all(authenticate())
        .get(authenticate(getUsersFromRoomId))
}
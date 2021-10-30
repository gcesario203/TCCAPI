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
        .all(authenticate())
        .post(save)
        .get(get)

    app.route('/rooms/:id')
        .all(authenticate())
        .get(getById)
        .put(save)
        .delete(remove)

    app.route('/rooms/join')
        .all(authenticate())
        .post(joinRoom)
        .delete(disconnectFromRoom)

    app.route('/roomsGeneral')
        .get(getRoomsXUsers)

    app.route('/rooms/user/:id')
        .all(authenticate())
        .get(getRoomsXUsersByUserId)

    app.route('/rooms/room/:id')
        .all(authenticate())
        .get(getUsersFromRoomId)
}
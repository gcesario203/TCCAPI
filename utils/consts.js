module.exports = app =>{
    const consts ={
        roomType:{
            public:0,
            private:1
        },
        dbNames: {
            rooms: 'salas',
            users: 'usuarios',
            messages: 'mensagens',
            coreRelation: 'corerelations',
            userRoomRelation: 'usersxrooms'
        },
    }

    return consts
}
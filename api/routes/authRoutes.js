module.exports = app =>{
    const {save} = app.api.business.user
    const {signIn,validateToken} = app.api.business.auth

    app.post('/signup', save)
    app.post('/signin', signIn)
    app.post('/validateToken', validateToken)
}
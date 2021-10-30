module.exports = app =>{
    const {save} = app.core.business.user
    const {signIn,validateToken} = app.core.business.auth

    app.post('/signup', save)
    app.post('/signin', signIn)
    app.post('/validateToken', validateToken)
}
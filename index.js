const app = require('express')()
const port = process.env.PORT || 3000
const consign = require('consign')
const db = require('./config/db')


app.db = db

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./utils/')
    .then('./core/queries')
    .then('./core/business')
    .then('./api/routes')
    .into(app)

app.listen(port,()=>{
    console.log('Backend iniciado com sucesso')
})
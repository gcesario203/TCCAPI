const app = require('express')()
const port = 3000
const consign = require('consign')
const db = require('./config/db')


app.db = db

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./utils/validation.js')
    .then('./api/business')
    .then('./api/routes')
    .into(app)

app.listen(port,()=>{
    console.log(app)
    console.log('Backend iniciado com sucesso')
})
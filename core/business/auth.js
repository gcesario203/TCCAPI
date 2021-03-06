const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const { dbNames} = app.utils.consts

    const signIn = async (req, res) => {
        if(!req.body.email || !req.body.senha){
            return res.status(400).send({error:"Informe usuário e senha"})
        }
        const user = await app.db(dbNames.users)
                        .where({email:req.body.email})
                        .first()

        if(!user) return res.status(400).send({error:"usuário não encontrado"})
        const isMatch = bcrypt.compareSync(req.body.senha,user.senha)

        if(!isMatch) return res.status(401).send({error:'Email/Senha inválidos'})

        const now = Math.floor(Date.now()/1000)

        const payload = {
            id: user.id,
            nome: user.nome,
            email:user.email,
            iat:now,
            exp:now+(60*60*24*3)
        }

        res.status(200).json({
            ...payload,
            token:jwt.encode(payload,"TCCAPP")
        })
    }

    const validateToken = async (req,res)=>{
        const userData = req.body || null

        try {
            if(userData){
                const token = jwt.decode(userData.token, "TCCAPP")
                if(new Date(token.exp*1000>new Date())){
                    return res.send(true)
                }
            }
        } catch (msg) {
            res.send(false)
        }
    }

    return {signIn, validateToken}
}
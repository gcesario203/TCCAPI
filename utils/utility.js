const bcrypt = require('bcrypt-nodejs')

module.exports = app =>{

    const utility = {
         encryptPassword(password){
            const salt = bcrypt.genSaltSync(10)
            return bcrypt.hashSync(password, salt)
        }
    }
    return utility
}
module.exports = app =>{
    function existOrError(value,msg){
        if(!value) throw msg
        if(Array.isArray(value) && value.length === 0) throw msg
        if(typeof value === 'string' && !value.trim()) throw msg
    }
    
    function notExistsOrError(value,msg){
        try{
            existOrError(value,msg)
        }catch(msg){
            return
        }
        throw msg
    }
    
    function equalsOrError(a,b,msg){
        if(a!==b) throw msg
    }
    
    function validEmail(value,msg){
        const defRegex = /^[a-z0-9\.\-\_]+\@[a-z]+(.com.br|.com)$/i
    
        let validValue = defRegex.exec(value)
        
        if(!validValue) throw msg
    }
    
    function validPassword(value,msg){
        const defRegex = /^[a-z0-9]{8,15}$/i
    
        let validPass = defRegex.exec(value)
    
        if(!validPass) throw msg
    }

    function validId(value,msg){
        const defRegex = /^[0-9]+$/

        let validId = defRegex.exec(value)

        if(!validId) throw msg
    }

    return {existOrError,notExistsOrError,equalsOrError,validEmail,validPassword, validId}
}
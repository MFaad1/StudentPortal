const jwt = require('jsonwebtoken');
const secretKey= 'rrrrrrrrrrrrrewr'

const isLogin=(req, res, next)=>{
if(req.headers && req.headers.token){
    const decode  =  jwt.verify(req.headers.token, secretKey)
    next()
}
else{
    return res.status(401).json({
        message: 'Token is missing'
    })
}

}


module.exports ={isLogin}
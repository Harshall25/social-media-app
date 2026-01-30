const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY || "Key";

function userAuth(req,res,next){
    const token = req.headers.token;
    if(!token){
        return res.status(401).json({
            error :  'token not provided'
        })
    }
    
    try {
        const decodedinformation = jwt.verify(token,JWT_KEY);
        //insert userId in req
        req.userId = decodedinformation.id;
        next();
    } catch (err) {
        return res.status(401).json({
            error: 'Invalid or expired token'
        });
    }
}

module.exports ={
    userAuth,
    JWT_KEY
}
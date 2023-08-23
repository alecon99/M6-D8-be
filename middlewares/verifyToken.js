const jwt = require('jsonwebtoken')

module.exports = function(req,res,next) {

    const token = req.header("Authorization")

    if(!token){
        return res.status(401).send({
            errorType: "Token not found",
            statusCode: 401,
            message: "Token non presente"
        })
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified;

        next()
    } catch (error) {
        res.status(403).send({
            errorType: "Token error",
            statusCode: 403,
            message: "Token non presente o non valido"
        })
    }
}
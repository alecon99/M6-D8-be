const express = require('express');
const bcrypt = require('bcrypt');
const AuthorModel = require('../models/authorModel')
const jwt = require('jsonwebtoken')

const router = express.Router();

router.post('/login', async(req,res)=>{
    const user = await AuthorModel.findOne({ email: req.body.email });

    if(!user){
        return res.status(404).send({
            statusCode: 404,
            message: "Email o password not valid",
        })
    }

    const validPassword = await bcrypt.compare( req.body.password, user.password)

    if(!validPassword){
        return res.status(404).send({
            statusCode: 404,
            message: "Email o password not valid",
        })
    }

    const token = jwt.sign({
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        avatar: user.avatar,
    }, 
    process.env.JWT_SECRET,
    { expiresIn: "24h"}
    )

    res.header("Authorization", token).status(200).send({
        statusCode: 200,
        token
    })
})

module.exports = router;
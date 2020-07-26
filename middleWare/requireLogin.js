
const jwt = require('jsonwebtoken')
//const {JWT_SECRET} = require('../key')
require("dotenv").config()
const mongoose = require('mongoose')
const User = mongoose.model("User")
module.exports = (req,res,next)=>{
    const {authorization} = req.headers
    //authorization = Bearer hdjhsabdjh(generated token from jsonwebtoken)
    if(!authorization){
        return res.status(401).json({error:"You must be logged in :) "})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,process.env.JWT_SECRET,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"You must be logged in :) "})
        }
        const {_id} = payload
        User.findById(_id)
        .select("-password -following -followers")
        .then(userdata=>{
            req.user = userdata
            next()
        })
    })
}
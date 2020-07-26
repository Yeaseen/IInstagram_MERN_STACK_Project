const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);
const requireLogin = require('../middleWare/requireLogin')
const User = mongoose.model("User")
const Chatroom = mongoose.model("Chatroom")
const Message = mongoose.model("Message")


router.get('/chatdashboard',requireLogin,(req,res)=>{
    Chatroom.find()
    .then(chatrooms=>{
        res.json({chatrooms})
    }).catch(err => {
        console.log(err)
    })
    

})


router.post('/chatdashboard',requireLogin,(req,res)=>{
    const {name} = req.body
    Chatroom.findOne({name})
    .then((savedChatroom)=>{
        if(savedChatroom){
            return res.json({message:"Chatroom with that name already exist :(" })
        }
        const chatroom = new Chatroom({
            name
        })

        chatroom.save().then(result=>{
            res.json({message:"Chatroom created !!!"})
        }).catch(err => {
            console.log(err)
        })

    }).catch(err => {
        console.log(err)
    })
})


module.exports = router
const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const messageSchema = new mongoose.Schema({
    chatroom:{
        type:ObjectId,
        required:"Chatroom is required!",
        ref:"Chatroom"
    },
    user:{
        type:ObjectId,
        required:"Chatroom is required!",
        ref:"User"
    },
    message:{
        type:String,
        required:"Message is required!"
    }
    
})

mongoose.model("Message",messageSchema)
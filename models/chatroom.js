const mongoose = require('mongoose')


const chatroomSchema = new mongoose.Schema({
    name:{
        type:String,
        required:"Name is required!"
    }
    
})

mongoose.model("Chatroom",chatroomSchema)
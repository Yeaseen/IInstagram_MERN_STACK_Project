const express = require('express')

const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000



const fileUpload = require('express-fileupload');

require("dotenv").config()



mongoose.connect(process.env.MONGOURI, {
	useNewUrlParser: true,
	
	useUnifiedTopology: true
})
mongoose.connection.on('connected', () => {
	console.log("Connected to mongodb !!")
})
mongoose.connection.on('error', (err) => {
	console.log("err connecting", err)
})



require('./models/user')
require('./models/post')
require('./models/chatroom')
require('./models/message')


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({
	useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))
app.use(require('./routes/chat'))


if(process.env.NODE_ENV === "production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}


const server = app.listen(PORT, () => {
	console.log("Server is running on", PORT)
})


const io = require('socket.io')(server)
const jwt = require('jsonwebtoken')


const Message = mongoose.model("Message")
const User = mongoose.model("User")

io.use(async (socket, next) => {

	const token = socket.handshake.query.token;

	jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
		if (err) {
			return new Error('authentication error');
		}
		const { _id } = payload
		socket.userId = _id;

	})
	next();

})


io.on('connection', (socket) => {
	console.log("Connected" + socket.userId)

	socket.on("disconnect", () => {
		console.log("Disconnected: " + socket.userId);
	})

	socket.on("joinRoom", ({ chatroomId }) => {
		socket.join(chatroomId)
		console.log("A user joined chatroom " + chatroomId)
	})

	socket.on("leaveRoom", ({ chatroomId }) => {
		socket.join(chatroomId)
		console.log("A user left chatroom " + chatroomId)
	})

	socket.on("chatroomMessage", async ({ chatroomId, message }) => {
		if (message.trim().length > 0) {

			const user = await User.findOne({ _id: socket.userId })

			const newMessage = new Message({
				chatroom: chatroomId,
				user: socket.userId,
				message
			})

			io.to(chatroomId).emit("newMessage", {
				message,
				name: user.name,
				userId: socket.userId
			})

			await newMessage.save()
		}


	})


})
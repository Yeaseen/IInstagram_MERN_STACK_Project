const express = require('express')

const app = express()
const mongoose = require('mongoose')
const PORT = 5000

//const {MONGOURI} = require('./key')
require("dotenv").config()

mongoose.connect(process.env.MONGOURI,{
	useNewUrlParser: true,
	useUnifiedTopology: true
})
mongoose.connection.on('connected', ()=>{
	console.log("Connected to mongodb !!")
})
mongoose.connection.on('error', (err)=>{
	console.log("err connecting", err)
})



require('./models/user')
require('./models/post')


app.use(express.json())
app.use(express.urlencoded({ extended:true}))
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))





app.listen(PORT,()=>{
	console.log("Server is running on",PORT)
})
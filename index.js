const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')
const messagesRoutes = require('./routes/messagesRoutes')

const app = express()
const socket = require('socket.io')

require('dotenv').config()

app.use(cors())
app.use(express.json())

app.use('/api/auth', userRoutes)
app.use('/api/messages', messagesRoutes)

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successfully')
  })
  .catch((err) => {
    console.log(err.message)
  })

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on Port ${process.env.PORT}`)
})

const io = socket(server, {
  allowRequest: (req, callback) => {
    const noOriginHeader = req.headers.origin === undefined
    callback(null, noOriginHeader)
  },
})

global.onlineUsers = new Map()

io.on('connection', (socket) => {
  global.chatSocket = socket

  socket.on('add-user', (userId) => {
    console.log('userLogged', userId)
    onlineUsers.set(userId, socket.id)
  })

  socket.on('send-msg', (data) => {
    const sendUserSocket = onlineUsers.get(data.to)

    // if the user is online
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-recieve', data.message)
    }
  })
})

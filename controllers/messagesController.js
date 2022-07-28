const User = require('../model/userModel')
const bcrypt = require('bcrypt')
const messageModel = require('../model/messageModel')

module.exports.addMessage = async (request, response, next) => {
  try {
    const { from, to, message } = request.body

    const data = await messageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    })

    if (data) return response.json({ message: 'Message added successfully.' })

    return response.json({ message: 'Failed to add message to the database' })
  } catch (exception) {
    next(exception)
  }
}

module.exports.getAllMessage = async (request, response, next) => {
  try {
    return response.json({ status: true, user })
  } catch (exception) {
    next(exception)
  }
}

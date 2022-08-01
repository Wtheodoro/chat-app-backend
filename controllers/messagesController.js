const Messages = require('../model/messageModel')

module.exports.addMessage = async (request, response, next) => {
  try {
    const { from, to, message } = request.body

    const data = await Messages.create({
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
    const { from, to } = request.body

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 })

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      }
    })

    response.json(projectedMessages)
  } catch (exception) {
    next(exception)
  }
}

const {
  addMessage,
  getAllMessage,
} = require('../controllers/messagesController')

const router = require('express').Router()

router.post('/getAllMessages', getAllMessage)
router.post('/addMessages', addMessage)

module.exports = router

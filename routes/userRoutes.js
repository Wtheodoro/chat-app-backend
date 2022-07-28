const {
  register,
  login,
  chooseAvatar,
  getAllUsers,
} = require('../controllers/userController')

const router = require('express').Router()

router.post('/register', register)
router.post('/login', login)
router.post('/chooseAvatar/:id', chooseAvatar)

router.get('/getAllUsers/:id', getAllUsers)

module.exports = router

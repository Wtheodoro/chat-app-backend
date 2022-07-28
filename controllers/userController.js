const User = require('../model/userModel')
const bcrypt = require('bcrypt')

// REGISTER
module.exports.register = async (request, response, next) => {
  try {
    const { username, email, password } = request.body

    const usernameCheck = await User.findOne({ username })
    if (usernameCheck)
      return response.json({ msg: 'Username already used', status: false })

    const usernamemailCheckeCheck = await User.findOne({ email })
    if (usernamemailCheckeCheck)
      return response.json({ msg: 'Email already used', status: false })

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    })

    delete user.password
    return response.json({ status: true, user })
  } catch (ex) {
    next(ex)
  }
}

// LOGIN
module.exports.login = async (request, response, next) => {
  try {
    const { username, password } = request.body

    const user = await User.findOne({ username })
    if (!user)
      return response.json({
        msg: 'Incorrect username or password',
        status: false,
      })

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid)
      return response.json({
        msg: 'Incorrect username or password',
        status: false,
      })

    delete user.password

    return response.json({ status: true, user })
  } catch (ex) {
    next(ex)
  }
}

// CHOOSE AVATAR
module.exports.chooseAvatar = async (request, response, next) => {
  try {
    const userId = request.params.id
    const avatarImage = request.body.image

    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    })

    return response.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    })
  } catch (ex) {
    next(ex)
  }
}

// GET ALL USERS
module.exports.getAllUsers = async (request, response, next) => {
  try {
    const users = await User.find({ _id: { $ne: request.params.id } }).select([
      'email',
      'username',
      'avatarImage',
      '_id',
    ])

    return response.json(users)
  } catch (ex) {
    next(ex)
  }
}

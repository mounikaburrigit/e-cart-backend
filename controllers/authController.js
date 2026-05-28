const bcrypt = require('bcryptjs')

const User = require('../models/User')

const generateToken = require(
  '../utils/generateToken'
)

const registerUser = async (req, res) => {
  const {name, email, password} = req.body

  const userExists = await User.findOne({
    email,
  })

  if (userExists) {
    return res.status(400).json({
      message: 'User Already Exists',
    })
  }

  const hashedPassword = await bcrypt.hash(
    password,
    10
  )

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  res.json({
    token: generateToken(user._id),
  })
}

const loginUser = async (req, res) => {
  const {name, email, password} = req.body

  const user = await User.findOne({email})

  if (!user) {
    return res.status(400).json({
      message: 'User Not Found',
    })
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  )

  if (!isMatch) {
    return res.status(400).json({
      message: 'Invalid Password',
    })
  }

  res.json({
    token: generateToken(user._id),
  })
}

module.exports = {
  registerUser,
  loginUser,
}
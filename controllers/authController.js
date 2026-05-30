const bcrypt = require('bcryptjs')

const User = require('../models/User')

const generateToken = require(
  '../utils/generateToken'
)
const sendEmail = require(
  '../utils/sendEmail'
)
/* REGISTER USER */

const registerUser = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body

    const userExists =
      await User.findOne({
        email,
      })

    if (userExists) {
      return res.status(400).json({
        message:
          'User Already Exists',
      })
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      )

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString()

    const user =
      await User.create({
        name,
        email,
        password:
          hashedPassword,
        otp,
        otpExpire:
          Date.now() +
          10 * 60 * 1000,
      })

    console.log(
      'Generated OTP:',
      otp
    )

    console.log(
      'Sending OTP to:',
      email
    )

    await sendEmail(
      email,
      otp
    )

    console.log(
      'Email sent successfully'
    )

    res.status(201).json({
      message:
        'OTP sent to your email',
    })
  } catch (error) {
    console.log(
      'EMAIL ERROR:',
      error
    )

    res.status(500).json({
      message:
        'Server Error',
    })
  }
}

/* LOGIN USER */

const loginUser = async (
  req,
  res
) => {
  const {email, password} =
    req.body

  const user = await User.findOne({
    email,
  })

  if (!user) {
    return res.status(400).json({
      message: 'User Not Found',
    })
  }

  const isMatch =
    await bcrypt.compare(
      password,
      user.password
    )

  if (!isMatch) {
    return res.status(400).json({
      message:
        'Invalid Password',
    })
  }

  res.json({
    token: generateToken(
      user._id
    ),

    user: {
      name: user.name,
      email: user.email,
    },
  })
}

/* VERIFY OTP */

const verifyOtp = async (
  req,
  res
) => {
  try {
    const {email, otp} =
      req.body

    const user =
      await User.findOne({
        email,
      })

    if (!user) {
      return res.status(400).json({
        message:
          'User Not Found',
      })
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message:
          'Invalid OTP',
      })
    }

    if (
      user.otpExpire <
      Date.now()
    ) {
      return res.status(400).json({
        message:
          'OTP Expired',
      })
    }

    user.isVerified = true

    user.otp = null

    user.otpExpire = null

    await user.save()

    res.json({
      message:
        'Email Verified Successfully',
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message:
        'Server Error',
    })
  }
}



const forgotPassword = async (
  req,
  res
) => {
  try {
    const {email} = req.body

    const user =
      await User.findOne({
        email,
      })

    if (!user) {
      return res.status(400).json({
        message:
          'User Not Found',
      })
    }

    const otp = Math.floor(
      100000 +
        Math.random() * 900000
    ).toString()

    user.otp = otp

    user.otpExpire =
      Date.now() +
      10 * 60 * 1000

    await user.save()

    await sendEmail(
      email,
      otp
    )

    res.json({
      message:
        'OTP Sent Successfully',
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message:
        'Server Error',
    })
  }
}

const resetPassword = async (
  req,
  res
) => {
  try {
    const {
      email,
      otp,
      password,
    } = req.body

    const user =
      await User.findOne({
        email,
      })

    if (!user) {
      return res.status(400).json({
        message:
          'User Not Found',
      })
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message:
          'Invalid OTP',
      })
    }

    if (
      user.otpExpire <
      Date.now()
    ) {
      return res.status(400).json({
        message:
          'OTP Expired',
      })
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      )

    user.password =
      hashedPassword

    user.otp = null

    user.otpExpire = null

    await user.save()

    res.json({
      message:
        'Password Reset Successfully',
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message:
        'Server Error',
    })
  }
}

module.exports = {
  registerUser,
  loginUser,
  verifyOtp,
  forgotPassword,
  resetPassword,
}
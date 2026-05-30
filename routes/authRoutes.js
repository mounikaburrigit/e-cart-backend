const express = require('express')

const {
  registerUser,
  loginUser,
  verifyOtp,
  forgotPassword,
  resetPassword,
} = require(
  '../controllers/authController'
)

const router = express.Router()

router.post(
  '/register',
  registerUser
)

router.post(
  '/login',
  loginUser
)

router.post(
  '/verify-otp',
  verifyOtp
)

router.post(
  '/forgot-password',
  forgotPassword
)

router.post(
  '/reset-password',
  resetPassword
)

module.exports = router
const express = require('express')

const {
  registerUser,
  loginUser,
  verifyOtp,
  forgotPassword,
  resetPassword,
  googleLogin,
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
router.post(
  '/google-login',
  googleLogin
)

module.exports = router
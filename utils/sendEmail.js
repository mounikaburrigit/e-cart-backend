const nodemailer = require(
  'nodemailer'
)

const sendEmail = async (
  email,
  otp
) => {
  const transporter =
    nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user:
          process.env.EMAIL_USER,
        pass:
          process.env.EMAIL_PASS,
      },
    })

  await transporter.sendMail({
    from:
      process.env.EMAIL_USER,

    to: email,

    subject:
      'Verify Your Email',

    html: `
      <div>
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>
          This OTP will expire
          in 10 minutes.
        </p>
      </div>
    `,
  })
}

module.exports = sendEmail

import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export async function sendResetCodeEmail(toEmail, code) {
  await transporter.sendMail({
    from:"Redline",
    to: toEmail,
    subject: 'Password Reset Code',
    text: `Your reset code is: ${code}`,
    html: `
      <h2>Password Reset</h2>
      <p>Your code:</p>
      <h1>${code}</h1>
      <p>This code expires in 5 minutes</p>
    `
  })
}
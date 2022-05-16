const nodemailer = require("nodemailer")

module.exports = async (destinationEmail, subject, body) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_APP_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })

  const info = await transporter.sendMail({
    from: "'LFI Dental Clinic' <noreply@lfidentalclinic.web.app>",
    to: destinationEmail,
    subject,
    text: body,
  })
  console.log("Message sent: %s", info.messageId)
}

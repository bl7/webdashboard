import nodemailer from "nodemailer"

export async function sendMail({
  to,
  subject,
  body,
}: {
  to: string
  subject: string
  body: string
}) {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env

  const transport = nodemailer.createTransport({
    host: "smtp.zoho.com", // Zoho SMTP server
    port: 465, // SSL (Use 587 for TLS)
    secure: true, // true for 465 (SSL), false for 587 (TLS)
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  })
  try {
    const testResult = await transport.verify()
  } catch (error) {
    console.error({ error })
    return
  }
  try {
    console.log('[MAIL] Sending email:', { to, subject });
    await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html: body,
    })
    console.log('[MAIL] Email sent:', { to, subject });
  } catch (error) {
    console.log(error)
  }
}

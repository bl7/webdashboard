import nodemailer from "nodemailer"

export async function sendMail({
  to,
  subject,
  body,
  useBulk = false,
  cc,
  bcc,
}: {
  to: string | string[]
  subject: string
  body: string
  useBulk?: boolean
  cc?: string | string[]
  bcc?: string | string[]
}) {
  const { SMTP_EMAIL, SMTP_PASSWORD, SMTP_BULK_EMAIL, SMTP_BULK_PASSWORD } = process.env

  const user = useBulk && SMTP_BULK_EMAIL ? SMTP_BULK_EMAIL : SMTP_EMAIL
  const pass = useBulk && SMTP_BULK_PASSWORD ? SMTP_BULK_PASSWORD : SMTP_PASSWORD

  const transport = nodemailer.createTransport({
    host: "smtp.zoho.com", // Zoho SMTP server
    port: 465, // SSL (Use 587 for TLS)
    secure: true, // true for 465 (SSL), false for 587 (TLS)
    auth: {
      user,
      pass,
    },
  })
  try {
    const testResult = await transport.verify()
  } catch (error) {
    console.error({ error })
    throw error
  }
  try {
    console.log("[MAIL] Sending email:", { to, cc, subject, bcc })
    await transport.sendMail({
      from: user,
      to,
      subject,
      html: body,
      ...(cc && { cc }),
      ...(bcc && { bcc }),
    })
    console.log("[MAIL] Email sent:", { to, cc, subject, bcc })
  } catch (error) {
    console.error("[MAIL] Send failed:", error)
    throw error
  }
}

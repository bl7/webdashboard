import { NextRequest, NextResponse } from "next/server"
import { sendMail } from "@/lib/mail"

export async function POST(req: NextRequest) {
  try {
    const { to, name, company, reschedule, time } = await req.json()

    if (!to || !name) {
      return NextResponse.json({ error: "Missing recipient or name" }, { status: 400 })
    }

    let subject = ""
    let mainContent = ""
    if (reschedule && time) {
      subject = "Your InstaLabel Demo Has Been Rescheduled! 📅"
      mainContent = `
        <div style="background: linear-gradient(135deg, #f59e42 0%, #fbbf24 100%); padding: 24px; border-radius: 12px; margin: 24px 0;">
          <h2 style="color: white; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">
            🔄 Demo Rescheduled!
          </h2>
          <div style="background: rgba(255,255,255,0.1); padding: 16px; border-radius: 8px; border-left: 4px solid #ffffff;">
            <p style="color: white; margin: 0; font-size: 16px; font-weight: 500;">
              📅 ${new Date(time).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p style="color: white; margin: 8px 0 0 0; font-size: 16px; font-weight: 500;">
              ⏰ ${new Date(time).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                timeZoneName: "short",
              })}
            </p>
          </div>
        </div>
        <p style="color: #374151; line-height: 1.6; margin: 16px 0;">
          Your demo with InstaLabel has been <b>rescheduled</b> to the above date and time. We look forward to meeting you and showing you how InstaLabel can help your business!
        </p>
      `
    } else if (time) {
      subject = "Your InstaLabel Demo is Scheduled! 📅"
      mainContent = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 24px; border-radius: 12px; margin: 24px 0;">
          <h2 style="color: white; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">
            🎉 Demo Scheduled Successfully!
          </h2>
          <div style="background: rgba(255,255,255,0.1); padding: 16px; border-radius: 8px; border-left: 4px solid #ffffff;">
            <p style="color: white; margin: 0; font-size: 16px; font-weight: 500;">
              📅 ${new Date(time).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p style="color: white; margin: 8px 0 0 0; font-size: 16px; font-weight: 500;">
              ⏰ ${new Date(time).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                timeZoneName: "short",
              })}
            </p>
          </div>
        </div>
        <p style="color: #374151; line-height: 1.6; margin: 16px 0;">
          We're excited to show you how InstaLabel can transform your labeling process and boost your productivity. Our team will walk you through key features and answer all your questions.
        </p>
      `
    } else {
      subject = "Thank you for your interest in InstaLabel! 🚀"
      mainContent = `
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 24px; border-radius: 12px; margin: 24px 0;">
          <h2 style="color: white; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">
            🙏 Thank You for Your Interest!
          </h2>
          <p style="color: white; margin: 0; font-size: 16px; line-height: 1.6;">
            We appreciate you taking the time to learn about InstaLabel${company ? ` and how it can benefit ${company}` : ""}.
          </p>
        </div>
        <p style="color: #374151; line-height: 1.6; margin: 16px 0;">
          Based on our discussion, we believe InstaLabel can significantly streamline your labeling processes and save you valuable time. Here's what makes us different:
        </p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <ul style="color: #374151; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li><strong>Intuitive Interface:</strong> Easy to use, no technical expertise required</li>
            <li><strong>Powerful Automation:</strong> Reduce manual work by up to 80%</li>
            <li><strong>Seamless Integration:</strong> Works with your existing tools</li>
            <li><strong>Dedicated Support:</strong> Our team is here to help you succeed</li>
          </ul>
        </div>
      `
    }

    const body = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          
          <!-- Header with Logo -->
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 32px 24px; text-align: center;">
            <img src="long_logo.png" alt="InstaLabel Logo" style="max-height: 60px; width: auto; margin-bottom: 16px;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
              ${subject.includes("Rescheduled") ? "Demo Rescheduled" : "Welcome to InstaLabel"}
            </h1>
          </div>

          <!-- Main Content -->
          <div style="padding: 32px 24px;">
            <p style="color: #374151; font-size: 18px; line-height: 1.6; margin: 0 0 24px 0;">
              Hi <strong>${name}</strong>,
            </p>

            ${mainContent}

            <!-- Call to Action -->
            <div style="text-align: center; margin: 32px 0;">
              ${
                subject.includes("Rescheduled")
                  ? `
                <a href="mailto:support@instalabel.co" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); transition: transform 0.2s;">
                  📧 Contact Us for Questions
                </a>
              `
                  : `
                <a href="https://www.instalabel.co/demo" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); transition: transform 0.2s;">
                  🚀 Schedule Your Demo
                </a>
              `
              }
            </div>

            <!-- Support Section -->
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 24px 0; border: 1px solid #e5e7eb;">
              <h3 style="color: #1f2937; margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">
                🤝 We're Here to Help
              </h3>
              <p style="color: #6b7280; margin: 0; line-height: 1.6;">
                Have questions? Need assistance? Our support team is ready to help you make the most of InstaLabel. Simply reply to this email or reach out to us directly.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #1f2937; padding: 24px; text-align: center;">
            <p style="color: #9ca3af; margin: 0 0 16px 0; font-size: 14px; line-height: 1.6;">
              Best regards,<br/>
              <strong style="color: #f9fafb;">The InstaLabel Team</strong>
            </p>
            
            <div style="border-top: 1px solid #374151; padding-top: 16px; margin-top: 16px;">
              <p style="color: #6b7280; margin: 0; font-size: 12px; line-height: 1.5;">
                © 2025 InstaLabel. All rights reserved.<br/>
                You received this email because you expressed interest in our services.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    await sendMail({ to, subject, body })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Demo request email error:", err)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}

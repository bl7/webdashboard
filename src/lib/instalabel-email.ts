const LOGO_URL = "https://www.instalabel.co/email-asset/logo_long.png"
const BANNER_URL = "https://www.instalabel.co/email-asset/banner.png"

export function formatEmailBody(text: string): string {
  return text
    .split(/\r?\n\r?\n+/)
    .map((paragraph) => {
      const trimmed = paragraph.trim()
      if (!trimmed) return ""
      return `<p style="margin:0 0 12px 0; font-size:16px; line-height:24px; color:#374151;">${trimmed
        .split(/\r?\n/)
        .map((line) => escapeHtml(line))
        .join("<br/>")}</p>`
    })
    .filter(Boolean)
    .join("")
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export function renderInstaLabelEmail({
  subject,
  recipientName,
  bodyHtml,
}: {
  subject: string
  recipientName: string
  bodyHtml: string
}) {
  const greeting = recipientName
    ? `<p style="margin:0 0 16px 0; color:#111827; font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial; font-size:16px;">Hi <strong>${escapeHtml(recipientName)}</strong>,</p>`
    : ""

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0; padding:0; background:#f9fafb; color:#111827;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f9fafb;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%; max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding:8px 20px; text-align:center;">
              <a href="https://www.instalabel.co" target="_blank" rel="noopener noreferrer" style="display:inline-block;">
                <img src="${LOGO_URL}" alt="InstaLabel" style="height:120px; display:block; margin:0 auto; border:0;" />
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 24px 24px; font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;">
              ${greeting}
              <div style="color:#374151;">${bodyHtml}</div>
              <div style="background:#f8fafc; padding:16px; border-radius:8px; margin:24px 0 0 0; border:1px solid #e5e7eb;">
                <p style="margin:0; font-size:14px; line-height:22px; color:#6b7280;">
                  Have questions? Reply to this email or contact us at
                  <a href="mailto:contact@instalabel.co" style="color:#7c3aed; text-decoration:none;">contact@instalabel.co</a>.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 20px 20px 20px;">
              <img src="${BANNER_URL}" alt="Label Smarter. Waste Less. Stay Compliant." style="width:100%; height:auto; display:block; border-radius:12px;" />
            </td>
          </tr>
          <tr>
            <td style="background:#7c3aed; color:#ffffff; padding:18px 20px; text-align:center; font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial; font-size:14px; line-height:22px;">
              Join kitchens across the UK labeling smarter with InstaLabel
            </td>
          </tr>
          <tr>
            <td style="background:#1f2937; padding:20px; text-align:center; font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;">
              <p style="margin:0 0 8px 0; font-size:14px; line-height:22px; color:#f9fafb;">
                Best regards,<br/><strong>The InstaLabel Team</strong>
              </p>
              <p style="margin:12px 0 0 0; font-size:12px; line-height:18px; color:#9ca3af;">
                © ${new Date().getFullYear()} InstaLabel. All rights reserved.<br/>
                <a href="https://www.instalabel.co" style="color:#c4b5fd; text-decoration:none;">www.instalabel.co</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

import { NextResponse } from "next/server"
import { sendMail } from "@/lib/mail"

type Recipient = { email: string; name?: string }

type TemplateFields = {
  subject: string
  subheading: string
  bullets: string[]
  testimonialQuote: string
  testimonialAuthor: string
  ctaText: string
  ctaUrl: string
  heroImageUrl?: string
  phoneMockUrl?: string
  discountPercent?: string
  discountCode?: string
  offerHeadline?: string
  offerSubtext?: string
}

function resolveAbsolute(url: string) {
  if (!url) return url
  try {
    if (url.startsWith("/")) return `https://www.instalabel.co${url}`
    return url
  } catch {
    return url
  }
}

function renderEmailHTML(
  fields: TemplateFields,
  previewName?: string,
  templateId: string = "default"
) {
  const greeting = previewName
    ? `<p style="margin:0 0 12px 0; color:#111827; font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial; font-size:16px;">Hi ${previewName},</p>`
    : ""

  const logoUrl = "https://www.instalabel.co/email-asset/logo_long.png"
  const heroUrl = fields.heroImageUrl ? resolveAbsolute(fields.heroImageUrl) : ""
  const subheadingHtml = (fields.subheading || "")
    .split(/\r?\n\r?\n+/)
    .map(
      (paragraph) =>
        `<p style="margin:0 0 10px 0; font-size:16px; line-height:22px; font-weight:normal;">${paragraph
          .split(/\r?\n/)
          .map((line) => line)
          .join("<br/>")}</p>`
    )
    .join("")

  if (templateId === "offer") {
    const logoUrl = "https://www.instalabel.co/email-asset/logo_long.png"
    const headline = fields.offerHeadline || "Limited-time offer"
    const discount = fields.discountPercent || "20%"
    const code = fields.discountCode || "SAVE20"
    const sub = fields.offerSubtext || "Offer ends soon. Terms apply."
    return `<!DOCTYPE html><html><head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head><body style="margin:0; padding:0; background:#ffffff; color:#111827;"><table role="presentation" width="100%"><tr><td align="center"><table role="presentation" width="600" style="width:100%; max-width:600px;"><tr><td style="padding:2px 20px; text-align:center;"><a href="https://www.instalabel.co" target="_blank" rel="noopener noreferrer" style="display:inline-block;"><img src="${logoUrl}" alt="InstaLabel" style="height:250px; display:block; margin:0 auto; border:0;" /></a></td></tr><tr><td style="padding:8px 20px; font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial;">${greeting}<p style="margin:0 0 8px 0; font-size:18px; line-height:26px;">${headline}</p><div style="margin:0 0 10px 0; padding:14px; background:#f5f3ff; border:1px dashed #c4b5fd; border-radius:10px; text-align:center;"><div style="font-size:28px; font-weight:800; color:#7c3aed;">${discount} OFF</div><div style="margin-top:6px; font-size:14px; color:#4b5563;">Use code <span style=\"font-weight:700; color:#111827;\">${code}</span> at checkout</div></div><div style=\"margin-top:12px; text-align:center;\"><a href="${fields.ctaUrl}" style="display:inline-block; background:#7c3aed; color:#ffffff; text-decoration:none; padding:12px 18px; border-radius:8px; font-weight:700;">${fields.ctaText || "Claim Offer"}</a></div><div style="margin-top:10px; font-size:12px; color:#6b7280;">${sub}</div></td></tr><tr><td style="padding:0 20px 24px 20px;"><img src="https://www.instalabel.co/email-asset/banner.png" alt="Label Smarter. Waste Less. Stay Compliant." style="width:100%; height:auto; display:block; border-radius:12px;" /></td></tr><tr><td style="background:#7c3aed; color:#ffffff; padding:18px 20px; text-align:center; font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial; border-radius:12px; margin:0 20px 24px 20px;">Join kitchens across the UK labeling smarter with InstaLabel</td></tr></table></td></tr></table></body></html>`
  }

  if (templateId === "coupon") {
    const logoUrl = "https://www.instalabel.co/email-asset/logo_long.png"
    const code = fields.discountCode || "WELCOME10"
    const sub = fields.offerSubtext || "Valid for new signups only."
    const subheadingHtml = (fields.subheading || "")
      .split(/\r?\n\r?\n+/)
      .map(
        (paragraph) =>
          `<p style="margin:0 0 10px 0; font-size:16px; line-height:22px; font-weight:normal;">${paragraph
            .split(/\r?\n/)
            .map((line) => line)
            .join("<br/>")}</p>`
      )
      .join("")
    return `<!DOCTYPE html><html><head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head><body style="margin:0; padding:0; background:#ffffff; color:#111827;"><table role="presentation" width="100%"><tr><td align="center"><table role="presentation" width="600" style="width:100%; max-width:600px;"><tr><td style="padding:2px 20px; text-align:center;"><a href="https://www.instalabel.co" target="_blank" rel="noopener noreferrer" style="display:inline-block;"><img src="${logoUrl}" alt="InstaLabel" style="height:250px; display:block; margin:0 auto; border:0;" /></a></td></tr><tr><td style="padding:8px 20px; font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial;">${greeting}<div style="padding:14px; border:1px solid #e5e7eb; border-radius:10px;">${subheadingHtml}<div style="margin-top:10px; padding:10px; background:#111827; color:#ffffff; border-radius:8px; text-align:center; font-weight:700; letter-spacing:1px;">CODE: ${code}</div><div style=\"margin-top:10px; text-align:center;\"><a href="${fields.ctaUrl}" style="display:inline-block; background:#7c3aed; color:#ffffff; text-decoration:none; padding:12px 18px; border-radius:8px; font-weight:700;">${fields.ctaText || "Start Free Trial"}</a></div><div style="margin-top:10px; font-size:12px; color:#6b7280;">${sub}</div></div></td></tr><tr><td style="padding:0 20px 24px 20px;"><img src="https://www.instalabel.co/email-asset/banner.png" alt="Label Smarter. Waste Less. Stay Compliant." style="width:100%; height:auto; display:block; border-radius:12px;" /></td></tr><tr><td style="background:#7c3aed; color:#ffffff; padding:18px 20px; text-align:center; font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial; border-radius:12px; margin:0 20px 24px 20px;">Join kitchens across the UK labeling smarter with InstaLabel</td></tr></table></td></tr></table></body></html>`
  }

  return `
	<!DOCTYPE html>
	<html>
	<head>
	<meta charSet="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>${fields.subject}</title>
  <style>
    @media (max-width:600px){
      .stack { display:block !important; width:100% !important; }
      .mobile-padding { padding: 16px !important; }
      .mobile-logo { height: 250px !important; }
      .mobile-banner { width: 100% !important; }
      .mobile-content { padding: 16px !important; }
      .mobile-phone { width: 150px !important; margin: 16px auto !important; }
      .mobile-cta { padding: 10px 16px !important; font-size: 14px !important; }
      .mobile-testimonial { padding: 12px !important; font-size: 13px !important; }
      .mobile-footer { padding: 12px 16px !important; font-size: 13px !important; }
    }
  </style>
	</head>
	<body style="margin:0; padding:0; background:#ffffff; color:#111827;">
		<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;">
			<tr>
				<td align="center">
					<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%; max-width:600px;">
						<tr>
							<td style="padding:2px 20px; text-align:center;">
								<a href="https://www.instalabel.co" target="_blank" rel="noopener noreferrer" style="display:inline-block;">
									<img src="${logoUrl}" alt="InstaLabel" class="mobile-logo" style="height:250px; display:block; margin:0 auto; border:0;" />
								</a>
							</td>
						</tr>
						<tr>
							<td style="padding:4px 20px 24px 20px; font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial;">
								${greeting}
								${subheadingHtml}
								<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
									<tr>
										<td style="width:50%; vertical-align:top; padding-right:20px;">
											<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
												${fields.bullets
                          .filter(Boolean)
                          .map(
                            (b) => `
													<tr><td style="padding:6px 0; font-size:15px; line-height:22px; color:#111827"><span style="color:#7c3aed; font-weight:700;">✓</span> ${b}</td></tr>
												`
                          )
                          .join("")}
											</table>
											<div style="margin-top:12px; text-align:left;">
												<a href="${fields.ctaUrl}" class="mobile-cta" style="display:inline-block; background:#7c3aed; color:#ffffff; text-decoration:none; padding:12px 18px; border-radius:8px; font-weight:700;">${fields.ctaText}</a>
											</div>
										</td>
										<td style="width:50%; vertical-align:top; text-align:center;" class="stack">
											${fields.phoneMockUrl ? `<img src="${resolveAbsolute(fields.phoneMockUrl)}" alt="Phone App" class="mobile-phone" style="width:200px; height:auto; display:block; margin:0 auto; border-radius:8px;" />` : ""}
										</td>
									</tr>
								</table>
							</td>
						</tr>
						<tr>
							<td class="mobile-padding" style="padding:0 20px 24px 20px;">
								<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6; border:1px solid #e5e7eb; border-radius:12px;">
									<tr>
										<td class="mobile-testimonial" style="padding:18px 16px; font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial; font-size:14px; line-height:22px; color:#111827;">
											<strong style="display:block; margin-bottom:6px;">Testimonial</strong>
											<em>"${fields.testimonialQuote}"</em>
											<div style="margin-top:8px; color:#374151;">${fields.testimonialAuthor}</div>
										</td>
									</tr>
								</table>
							</td>
						</tr>
						<tr>
							<td class="mobile-padding" style="padding:0 20px 24px 20px;">
								<img src="https://www.instalabel.co/email-asset/banner.png" alt="Label Smarter. Waste Less. Stay Compliant." class="mobile-banner" style="width:100%; height:auto; display:block; border-radius:12px;" />
							</td>
						</tr>
						<tr>
							<td class="mobile-footer" style="background:#7c3aed; color:#ffffff; padding:18px 20px; text-align:center; font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial; border-radius:12px; margin:0 20px 24px 20px;">
								Join kitchens across the UK labeling smarter with InstaLabel
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</body>
	</html>`
}

export async function POST(req: Request) {
  try {
    const { subject, html, fields, recipients, templateId } = (await req.json()) as {
      subject: string
      html?: string
      fields?: TemplateFields
      recipients: Recipient[]
      templateId?: string
    }

    if (!subject || !Array.isArray(recipients)) {
      return NextResponse.json({ status: "error", message: "Invalid payload" }, { status: 400 })
    }

    const unique = new Map<string, Recipient>()
    for (const r of recipients) {
      if (!r?.email) continue
      const key = r.email.toLowerCase()
      if (!/.+@.+\..+/.test(key)) continue
      if (!unique.has(key)) unique.set(key, r)
    }

    const list = Array.from(unique.values())
    let sent = 0
    let failed = 0

    // basic throttling: 25/second
    const batchSize = 25
    for (let i = 0; i < list.length; i += batchSize) {
      const slice = list.slice(i, i + batchSize)
      await Promise.all(
        slice.map(async (r) => {
          try {
            // Use pre-rendered HTML if available, otherwise render with personalization
            const emailHtml = html || (fields ? renderEmailHTML(fields, r.name, templateId) : "")
            await sendMail({ to: r.email, subject, body: emailHtml })
            sent++
          } catch (e) {
            failed++
          }
        })
      )
      // small delay between batches
      await new Promise((res) => setTimeout(res, 1000))
    }

    return NextResponse.json({ status: "ok", sent, failed })
  } catch (e) {
    return NextResponse.json({ status: "error" }, { status: 500 })
  }
}

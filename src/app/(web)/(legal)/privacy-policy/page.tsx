import { Metadata } from "next"

const title = "Privacy policy | InstaLabel"
const description =
  "Learn how InstaLabel describes the personal information used for accounts, support, printing activity and website services."

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: {
    title,
    description,
    url: "https://www.instalabel.co/privacy-policy",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "InstaLabel privacy policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/privacy-policy",
  },
}

const contents = [
  { href: "#who-we-are", label: "Who we are and how to contact us" },
  { href: "#information", label: "Information we collect" },
  { href: "#use", label: "Why we use information" },
  { href: "#permissions", label: "Device permissions" },
  { href: "#sharing", label: "Service providers and sharing" },
  { href: "#retention", label: "Retention" },
  { href: "#security", label: "Protecting information" },
  { href: "#rights", label: "Your rights and complaints" },
  { href: "#cookies", label: "Cookies and similar technologies" },
  { href: "#children", label: "Children" },
  { href: "#changes", label: "Policy changes" },
]

const Page = () => {
  return (
    <article className="max-w-3xl text-mkt-ink">
      <h1 className="mb-4 text-4xl font-black tracking-tight sm:text-5xl">Privacy policy</h1>
      <p className="text-base leading-relaxed text-mkt-ink8">
        This policy explains how INSTALABEL LIMITED uses personal information in connection with
        InstaLabel, including account information, support enquiries and service activity.
      </p>
      <p className="mt-3 text-base leading-relaxed text-mkt-ink8">
        For privacy questions or requests, email{" "}
        <a href="mailto:support@instalabel.co" className="text-mkt-teal hover:underline">
          support@instalabel.co
        </a>
        .
      </p>
      <p className="mt-3 text-sm text-mkt-steel">Effective date: 15 September 2025</p>

      <nav aria-label="On this page" className="mt-10 rounded-xl border border-mkt-steel1 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold">On this page</h2>
        <ol className="space-y-2 text-sm">
          {contents.map((item, index) => (
            <li key={item.href}>
              <a href={item.href} className="text-mkt-teal hover:underline">
                {index + 1}. {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-12 space-y-10 text-base leading-relaxed text-mkt-ink8">
        <section id="who-we-are" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">
            1. Who we are and how to contact us
          </h2>
          <p>
            INSTALABEL LIMITED (&quot;InstaLabel&quot;, &quot;we&quot;, &quot;us&quot;, or
            &quot;our&quot;) provides the InstaLabel website, software and related services.
          </p>
          <p className="mt-3">
            For privacy questions or requests, email{" "}
            <a href="mailto:support@instalabel.co" className="text-mkt-teal hover:underline">
              support@instalabel.co
            </a>
            .
          </p>
        </section>

        <section id="information" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">
            2. Information we collect
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Account and contact information:</strong> name, email address, business name
              and contact details you provide when registering or contacting us.
            </li>
            <li>
              <strong>Usage and device information:</strong> how you use InstaLabel, including
              device or browser type and IP address.
            </li>
            <li>
              <strong>Print records:</strong> label content, print time and printer used. Label
              content may include staff identifiers recorded in the labelling workflow.
            </li>
            <li>
              <strong>Cookies and similar technologies:</strong> as described in our Cookie Policy.
            </li>
          </ul>
        </section>

        <section id="use" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">
            3. Why we use information
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>To provide and maintain the InstaLabel service</li>
            <li>To keep print records available in the service</li>
            <li>To communicate with you about your account, updates or support requests</li>
            <li>To improve our product and user experience</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section id="permissions" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">
            4. Device permissions
          </h2>
          <p>
            The InstaLabel Android app uses Bluetooth permissions to communicate with compatible
            label printers. On some older Android versions, the operating system may prompt for
            Location permission to enable Bluetooth scanning. InstaLabel does not use that
            permission to track or collect your location. If you decline or disable these
            permissions, some printing features may not work.
          </p>
        </section>

        <section id="sharing" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">
            5. Service providers and sharing
          </h2>
          <p>We may share information:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>With service providers who help us operate InstaLabel</li>
            <li>With authorities if required by law</li>
            <li>
              With your consent, or as part of a business transfer such as a merger or acquisition
            </li>
          </ul>
        </section>

        <section id="retention" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">6. Retention</h2>
          <p>
            We retain your account data and print logs for as long as your account is active or as
            needed to comply with legal and regulatory requirements. You may request deletion of
            your data by contacting us, but some records may be retained where we are required to
            keep them.
          </p>
        </section>

        <section id="security" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">
            7. Protecting information
          </h2>
          <p>
            We use industry-standard security measures to protect your data. No method of
            transmission or storage is completely secure. Use a strong password and keep your login
            credentials confidential.
          </p>
        </section>

        <section id="rights" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">
            8. Your rights and complaints
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>You can access, update or delete your account information in the service.</li>
            <li>
              You can request a copy of your data or ask us to delete your account by emailing{" "}
              <a href="mailto:support@instalabel.co" className="text-mkt-teal hover:underline">
                support@instalabel.co
              </a>
              . Some records may be retained where we are required to keep them.
            </li>
            <li>
              You can complain to the Information Commissioner&apos;s Office if you are unhappy with
              how we handle your personal information.
            </li>
          </ul>
        </section>

        <section id="cookies" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">
            9. Cookies and similar technologies
          </h2>
          <p>
            For information about cookies and your choices, read our{" "}
            <a href="/cookie-policy" className="text-mkt-teal hover:underline">
              Cookie Policy
            </a>
            .
          </p>
        </section>

        <section id="children" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">10. Children</h2>
          <p>
            InstaLabel is not intended for use by children under 16. We do not knowingly collect
            personal information from children.
          </p>
        </section>

        <section id="changes" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">
            11. Policy changes
          </h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant
            changes by posting the new policy on our website and updating the date above.
          </p>
        </section>
      </div>
    </article>
  )
}

export default Page

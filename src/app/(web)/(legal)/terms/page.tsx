import { Metadata } from "next"
import { ANDROID_PRINTERS, TRIAL_PERIOD_DAYS } from "@/lib/marketing/site"

const title = "Terms of service | InstaLabel"
const description =
  "Read the terms governing the InstaLabel website, software, account use and subscriptions."

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: {
    title,
    description,
    url: "https://www.instalabel.co/terms",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "InstaLabel terms of service",
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
    canonical: "https://www.instalabel.co/terms",
  },
}

const contents = [
  { href: "#about", label: "About these terms" },
  { href: "#account", label: "Your account" },
  { href: "#service", label: "The service" },
  { href: "#printing", label: "Printing and hardware" },
  { href: "#payment", label: "Trials, subscriptions and payment" },
  { href: "#cancellation", label: "Cancellation and refunds" },
  { href: "#content", label: "Your content and print records" },
  { href: "#permissions", label: "Device permissions" },
  { href: "#acceptable-use", label: "Acceptable use" },
  { href: "#liability", label: "Responsibilities and liability" },
  { href: "#termination", label: "Suspension and termination" },
  { href: "#changes", label: "Changes to these terms" },
  { href: "#governing-law", label: "Governing law and disputes" },
  { href: "#contact", label: "Contact" },
]

const Page = () => {
  return (
    <article className="max-w-3xl text-mkt-ink">
      <h1 className="mb-4 text-4xl font-black tracking-tight sm:text-5xl">Terms of service</h1>
      <p className="text-base leading-relaxed text-mkt-ink8">
        These terms govern access to and use of the InstaLabel website, software and related
        services provided by INSTALABEL LIMITED.
      </p>
      <p className="mt-3 text-sm text-mkt-steel">Effective date: 15 September 2025</p>

      <nav aria-label="On this page" className="mt-10 rounded-xl border border-mkt-steel1 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold">On this page</h2>
        <ol className="space-y-2 text-sm">
          {contents.map((item, index) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-mkt-teal hover:underline"
                style={{ scrollMarginTop: "7rem" }}
              >
                {index + 1}. {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-12 space-y-10 text-base leading-relaxed text-mkt-ink8">
        <section id="about" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">1. About these terms</h2>
          <p>
            These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of the
            InstaLabel website (
            <a href="https://www.instalabel.co" className="text-mkt-teal hover:underline">
              https://www.instalabel.co
            </a>
            ), software and all associated services provided by INSTALABEL LIMITED
            (&quot;InstaLabel&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
          </p>
          <p className="mt-3">
            By using InstaLabel, you agree to these Terms. If you do not agree, do not use the
            service.
          </p>
        </section>

        <section id="account" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">2. Your account</h2>
          <p>
            You must provide accurate information when creating an account. You are responsible for
            maintaining the confidentiality of your login credentials and for all activity under
            your account. Notify us immediately of any unauthorized use.
          </p>
        </section>

        <section id="service" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">3. The service</h2>
          <p>
            InstaLabel provides software for creating and printing kitchen labels, including prep,
            cooked, ingredient, defrost and PPDS layouts, for professional kitchens. The service may
            include web and Android applications and print history. InstaLabel does not certify a
            kitchen or manage a complete food-safety system. You remain responsible for checking
            recipes, supplier information and finished labels.
          </p>
        </section>

        <section id="printing" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">
            4. Printing and hardware
          </h2>
          <p>
            You are responsible for ensuring your printer and devices work with InstaLabel. Desktop
            printing uses PrintBridge with a label printer installed on Windows or macOS. Android
            printing uses supported Bluetooth models ({ANDROID_PRINTERS.join(" and ")}). We cannot
            guarantee compatibility with every printer or device. Check the printer compatibility
            page and test your setup before relying on it in service.
          </p>
        </section>

        <section id="payment" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">
            5. Trials, subscriptions and payment
          </h2>
          <p>
            Some features require a paid subscription. You will be informed of pricing before
            purchase. Where a trial is offered, it runs for the period shown at checkout, currently{" "}
            {TRIAL_PERIOD_DAYS} days. A paid subscription is required for continued use after any
            trial ends.
          </p>
        </section>

        <section id="cancellation" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">
            6. Cancellation and refunds
          </h2>
          <p>
            Refunds are available within 14 days of purchase unless otherwise stated. You may cancel
            your subscription at any time.
          </p>
        </section>

        <section id="content" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">
            7. Your content and print records
          </h2>
          <p>
            You retain ownership of your data and print logs. By using InstaLabel, you grant us a
            license to use your data as needed to provide the service, support compliance, and
            improve our product. You are responsible for ensuring your data does not violate any
            laws or third-party rights.
          </p>
        </section>

        <section id="permissions" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">
            8. Device permissions
          </h2>
          <p>
            Certain features of the InstaLabel mobile application require Bluetooth permissions to
            enable communication with compatible label printers or other devices. On some older
            Android versions, the operating system may prompt for Location permission to enable
            Bluetooth scanning, but InstaLabel does not use this permission to track or collect your
            location data. By allowing the app to access Bluetooth (and Location if prompted by your
            device), you enable these functionality features. If you decline or disable these
            permissions, some features may not work.
          </p>
        </section>

        <section id="acceptable-use" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">9. Acceptable use</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Do not use InstaLabel for unlawful purposes or to violate food safety regulations.</li>
            <li>Do not attempt to reverse engineer, copy, or resell the service.</li>
            <li>Do not upload malicious code or interfere with the operation of the service.</li>
            <li>Do not use the service to harass, abuse, or harm others.</li>
          </ul>
        </section>

        <section id="liability" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">
            10. Responsibilities and liability
          </h2>
          <p>
            InstaLabel is provided &quot;as is&quot; without warranties of any kind. We are not
            liable for any damages arising from your use of the service, including lost profits,
            data loss, or compliance fines. You are responsible for verifying label accuracy and
            compliance with local regulations.
          </p>
        </section>

        <section id="termination" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">
            11. Suspension and termination
          </h2>
          <p>
            We may suspend or terminate your account at any time for violation of these Terms or
            misuse of the service. You may cancel your subscription at any time.
          </p>
        </section>

        <section id="changes" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">
            12. Changes to these terms
          </h2>
          <p>
            We may update these Terms from time to time. Continued use of InstaLabel after changes
            means you accept the new Terms.
          </p>
        </section>

        <section id="governing-law" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">
            13. Governing law and disputes
          </h2>
          <p>
            These Terms are governed by the laws of United Kingdom. Disputes will be resolved in
            Bournemouth, England.
          </p>
        </section>

        <section id="contact" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">14. Contact</h2>
          <p>
            Questions about these terms? Email{" "}
            <a href="mailto:support@instalabel.co" className="text-mkt-teal hover:underline">
              support@instalabel.co
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  )
}

export default Page

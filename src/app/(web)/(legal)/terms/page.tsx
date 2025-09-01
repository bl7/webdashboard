import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms and Conditions | InstaLabel",
  description:
    "Read InstaLabel's terms and conditions for our kitchen labeling software. Learn about user accounts, subscription terms, acceptable use, and service limitations.",
  keywords: [
    "InstaLabel terms",
    "kitchen labeling terms",
    "software terms and conditions",
    "restaurant software terms",
    "food safety software terms",
    "kitchen management terms",
    "subscription terms",
    "software license agreement",
    "restaurant technology terms",
    "kitchen automation terms",
  ],
  openGraph: {
    title: "Terms and Conditions | InstaLabel",
    description:
      "Read InstaLabel's terms and conditions for our kitchen labeling software. Learn about user accounts, subscription terms, and service limitations.",
    url: "https://www.instalabel.co/terms",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "InstaLabel Terms and Conditions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms and Conditions | InstaLabel",
    description: "Read InstaLabel's terms and conditions for our kitchen labeling software.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/terms",
  },
}

const Page = () => {
  return (
    <section className="bg-white">
      <div className="prose max-w-none break-words text-base prose-h2:my-6 prose-p:my-2 prose-a:text-purple-700 prose-a:no-underline hover:prose-a:text-purple-500">
        <div className="flex w-full">
          <div className="w-full">
            <h1 className="mb-3 text-5xl font-bold">Terms and Conditions</h1>
          </div>
        </div>
        <article>
          <p>
            These Terms and Conditions ("Terms") govern your access to and use of the InstaLabel
            kitchen labeling software, website (
            <a href="https://www.instalabel.co">https://www.instalabel.co</a>), and all associated
            services provided by InstaLabel Pvt. Ltd. ("InstaLabel", "we", "us", or "our").
          </p>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By using InstaLabel, you agree to these Terms. If you do not agree, do not use the
            service.
          </p>
          <h3>2. User Accounts</h3>
          <p>
            You must provide accurate information when creating an account. You are responsible for
            maintaining the confidentiality of your login credentials and for all activity under
            your account. Notify us immediately of any unauthorized use.
          </p>
          <h3>3. Service Description</h3>
          <p>
            InstaLabel provides software for generating and printing food safety labels (prep, cook,
            use-first, PPDS) for professional kitchens. The service may include web and mobile
            applications, print log retention, and compliance features.
          </p>
          <h3>4. Hardware Compatibility</h3>
          <p>
            You are responsible for ensuring your printer and devices are compatible with
            InstaLabel. We support most USB thermal label printers and mobile devices, but cannot
            guarantee compatibility with all hardware.
          </p>
          <h3>5. Subscription, Fees, and Payment</h3>
          <p>
            Some features require a paid subscription. You will be informed of pricing before
            purchase. Payment is due immediately upon subscription. Refunds are available within 14
            days of purchase unless otherwise stated.
          </p>
          <h3>6. User Content and Print Logs</h3>
          <p>
            You retain ownership of your data and print logs. By using InstaLabel, you grant us a
            license to use your data as needed to provide the service, support compliance, and
            improve our product. You are responsible for ensuring your data does not violate any
            laws or third-party rights.
          </p>
          <h3>7. Acceptable Use</h3>
          <ul>
            <li>
              Do not use InstaLabel for unlawful purposes or to violate food safety regulations.
            </li>
            <li>Do not attempt to reverse engineer, copy, or resell the service.</li>
            <li>Do not upload malicious code or interfere with the operation of the service.</li>
            <li>Do not use the service to harass, abuse, or harm others.</li>
          </ul>
          <h3>8. Limitation of Liability</h3>
          <p>
            InstaLabel is provided "as is" without warranties of any kind. We are not liable for any
            damages arising from your use of the service, including lost profits, data loss, or
            compliance fines. You are responsible for verifying label accuracy and compliance with
            local regulations.
          </p>
          <h3>9. Termination</h3>
          <p>
            We may suspend or terminate your account at any time for violation of these Terms or
            misuse of the service. You may cancel your subscription at any time.
          </p>
          <h3>10. Changes to Terms</h3>
          <p>
            We may update these Terms from time to time. Continued use of InstaLabel after changes
            means you accept the new Terms.
          </p>
          <h3>11. Governing Law</h3>
          <p>
            These Terms are governed by the laws of United Kingdom. Disputes will be resolved in
            Bournemouth, England.
          </p>
          <h3>12. Contact Us</h3>
          <p>
            If you have questions about these Terms, contact us at{" "}
            <a href="mailto:support@instalabel.co">support@instalabel.co</a>.
          </p>
        </article>
        <div className="py-8 text-sm text-muted-foreground"> As of March 2nd, 2025</div>
      </div>
    </section>
  )
}

export default Page

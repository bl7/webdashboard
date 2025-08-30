import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy | InstaLabel Kitchen Labeling",
  description:
    "Learn about how InstaLabel uses cookies and similar technologies to provide, improve, and secure our kitchen labeling software and website.",
  keywords: [
    "InstaLabel cookie policy",
    "kitchen labeling cookies",
    "website cookies",
    "restaurant software cookies",
    "food safety software cookies",
    "kitchen management cookies",
    "cookie consent",
    "website analytics cookies",
    "restaurant technology cookies",
    "kitchen automation cookies",
  ],
  openGraph: {
    title: "Cookie Policy | InstaLabel Kitchen Labeling",
    description:
      "Learn about how InstaLabel uses cookies and similar technologies to provide, improve, and secure our kitchen labeling software and website.",
    url: "https://www.instalabel.co/cookie-policy",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "InstaLabel Cookie Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy | InstaLabel Kitchen Labeling",
    description: "Learn about how InstaLabel uses cookies and similar technologies.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/cookie-policy",
  },
}

const Page = () => {
  return (
    <section className="bg-white">
      <div className="prose max-w-none break-words text-base prose-h2:my-6 prose-p:my-2 prose-a:text-purple-700 prose-a:no-underline hover:prose-a:text-purple-500">
        <div className="flex w-full">
          <div className="w-full">
            <h1 className="mb-3 text-5xl font-bold">Cookie Policy</h1>
          </div>
        </div>
        <article>
          <p>
            InstaLabel Pvt. Ltd. ("InstaLabel", "we", "us", or "our") uses cookies and similar
            technologies to provide, improve, and secure our kitchen labeling software and website (
            <a href="https://www.instalabel.co">https://www.instalabel.co</a>).
          </p>
          <h3>1. What are Cookies?</h3>
          <p>
            Cookies are small data files stored on your device when you visit a website. They help
            us remember your preferences, keep you logged in, and analyze how you use our service.
          </p>
          <h3>2. What Cookies Do We Use?</h3>
          <ul>
            <li>
              <strong>Essential Cookies:</strong> Required for core site functionality, such as
              authentication and security.
            </li>
            <li>
              <strong>Analytics Cookies:</strong> We use Google Analytics to understand how users
              interact with our site and improve our product. Google Analytics may set its own
              cookies.{" "}
              <a
                href="https://policies.google.com/technologies/cookies"
                target="_blank"
                rel="noopener"
              >
                Learn more
              </a>
              .
            </li>
            <li>
              <strong>Preference Cookies:</strong> Remember your settings and preferences (e.g.,
              language, login state).
            </li>
          </ul>
          <h3>3. Third-Party Cookies</h3>
          <p>
            Some third-party services (such as embedded videos or analytics) may set their own
            cookies. We do not control these cookies. Please refer to the privacy policies of those
            providers for more information.
          </p>
          <h3>4. Cookie Consent and Management</h3>
          <p>
            By using our website, you consent to our use of cookies as described in this policy. You
            can manage or delete cookies in your browser settings. Most browsers allow you to block
            cookies, delete existing cookies, or be notified before a cookie is set. Blocking some
            cookies may affect your experience.
          </p>
          <h3>5. Changes to This Policy</h3>
          <p>
            We may update this Cookie Policy from time to time. We will post any changes on this
            page and update the date below.
          </p>
          <h3>6. Contact Us</h3>
          <p>
            If you have questions about our Cookie Policy, contact us at{" "}
            <a href="mailto:support@instalabel.co">support@instalabel.co</a>.
          </p>
        </article>
        <div className="py-8 text-sm text-muted-foreground"> As of March 25th, 2024</div>
      </div>
    </section>
  )
}

export default Page

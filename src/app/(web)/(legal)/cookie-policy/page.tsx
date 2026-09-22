import { Metadata } from "next"

const title = "Cookie policy | InstaLabel"
const description =
  "Read about cookies and similar technologies used by InstaLabel and how to manage the available choices."

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: {
    title,
    description,
    url: "https://www.instalabel.co/cookie-policy",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "InstaLabel cookie policy",
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
    canonical: "https://www.instalabel.co/cookie-policy",
  },
}

const cookies = [
  {
    name: "token",
    provider: "InstaLabel",
    purpose: "Keeps a signed-in session so the service can recognise your account",
    category: "Essential",
    duration: "7 days",
    when: "When you sign in",
    control: "Sign out, or delete the cookie in your browser",
  },
]

const Page = () => {
  return (
    <article className="max-w-3xl text-mkt-ink">
      <h1 className="mb-4 text-4xl font-black tracking-tight sm:text-5xl">Cookie policy</h1>
      <p className="text-base leading-relaxed text-mkt-ink8">
        This page explains the cookies and similar technologies used by InstaLabel, what they do and
        the choices available to you.
      </p>
      <p className="mt-3 text-sm text-mkt-steel">Effective date: 15 September 2025</p>

      <div className="mt-12 space-y-10 text-base leading-relaxed text-mkt-ink8">
        <section id="technologies" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">
            Cookies and similar technologies
          </h2>
          <p>
            Cookies and related technologies can store or access information on your device.
            Different technologies support different purposes, such as keeping an account session
            working or measuring website use.
          </p>
        </section>

        <section id="inventory" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">What we use</h2>
          <p className="mb-6">
            Public pages do not require cookies. After you sign in, InstaLabel sets the essential
            cookie below so the application can keep your session.
          </p>
          <div className="overflow-x-auto rounded-xl border border-mkt-steel1 bg-white">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <caption className="sr-only">Cookies used by InstaLabel</caption>
              <thead className="bg-mkt-canvas">
                <tr>
                  <th className="px-4 py-3 font-semibold text-mkt-ink">Name</th>
                  <th className="px-4 py-3 font-semibold text-mkt-ink">Provider</th>
                  <th className="px-4 py-3 font-semibold text-mkt-ink">Purpose</th>
                  <th className="px-4 py-3 font-semibold text-mkt-ink">Category</th>
                  <th className="px-4 py-3 font-semibold text-mkt-ink">Duration</th>
                  <th className="px-4 py-3 font-semibold text-mkt-ink">When it runs</th>
                  <th className="px-4 py-3 font-semibold text-mkt-ink">Your control</th>
                </tr>
              </thead>
              <tbody>
                {cookies.map((row) => (
                  <tr key={row.name} className="border-t border-mkt-steel1 align-top">
                    <th className="px-4 py-3 font-medium text-mkt-ink">{row.name}</th>
                    <td className="px-4 py-3">{row.provider}</td>
                    <td className="px-4 py-3">{row.purpose}</td>
                    <td className="px-4 py-3">{row.category}</td>
                    <td className="px-4 py-3">{row.duration}</td>
                    <td className="px-4 py-3">{row.when}</td>
                    <td className="px-4 py-3">{row.control}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            After you sign in, the browser may also store account details such as your name and
            email in local storage so the signed-in application can load. The signed-in application
            may also keep a browser identifier in local storage so this device can be recognised
            while you are signed in. That storage is not a cookie. Account details are removed when
            you sign out. The browser identifier can remain until you clear site data in your
            browser.
          </p>
        </section>

        <section id="choices" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">
            Manage your choices
          </h2>
          <p>
            We use essential technologies to operate the signed-in service. This page does not list
            optional analytics or marketing cookies because none are currently active on the public
            site.
          </p>
          <p className="mt-3">
            You can delete or block cookies in your browser settings. Blocking the <code>token</code>{" "}
            cookie will sign you out of the application. It will not stop you reading public pages.
          </p>
        </section>

        <section id="changes" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">
            Changes to this policy
          </h2>
          <p>
            We update this page when the technologies we use or the choices available to you change.
          </p>
        </section>

        <section id="contact" style={{ scrollMarginTop: "7rem" }}>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-mkt-ink">Contact us</h2>
          <p>
            Questions about cookies on InstaLabel? Email{" "}
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

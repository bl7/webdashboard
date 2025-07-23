import React from "react"

const Page = () => {
  return (
    <section className="bg-white">
      <div className="prose prose-p:my-2 prose-h2:my-6 prose-a:text-purple-700 prose-a:no-underline hover:prose-a:text-purple-500 max-w-none break-words text-base">
        <div className="flex w-full">
          <div className="w-full">
            <h1 className="mb-3 text-5xl font-bold">Privacy Policy</h1>
            <h3 className="text-lg leading-relaxed">
              Your privacy is important to us. This Privacy Policy explains how InstaLabel Pvt. Ltd. ("InstaLabel", "we", "us", or "our") collects, uses, and protects your information when you use our kitchen labeling software and related services. If you have any questions, <a href="mailto:support@InstaLabel.com">please get in touch.</a>
            </h3>
          </div>
        </div>
        <article>
          <h2>Information We Collect</h2>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, business name, and contact details you provide when registering.</li>
            <li><strong>Usage Data:</strong> Information about how you use InstaLabel, including label print history, device/browser type, and IP address.</li>
            <li><strong>Print Logs:</strong> We retain print logs (label content, print time, printer used) for compliance and audit purposes. These are kept for as long as your account is active or as required by law.</li>
            <li><strong>Cookies & Analytics:</strong> We use cookies and analytics tools (such as Google Analytics) to understand usage and improve our service. See our Cookie Policy for details.</li>
          </ul>
          <h2>How We Use Your Information</h2>
          <ul>
            <li>To provide and maintain the InstaLabel service</li>
            <li>To support food safety compliance and generate audit-ready print logs</li>
            <li>To communicate with you about your account, updates, or support requests</li>
            <li>To improve our product and user experience</li>
            <li>To comply with legal obligations</li>
          </ul>
          <h2>How We Share Your Information</h2>
          <ul>
            <li>With service providers who help us operate InstaLabel (e.g., cloud hosting, analytics)</li>
            <li>With authorities if required by law or for compliance investigations</li>
            <li>With your consent, or as part of a business transfer (e.g., merger or acquisition)</li>
          </ul>
          <h2>Data Retention</h2>
          <p>We retain your account data and print logs for as long as your account is active or as needed to comply with legal and regulatory requirements. You may request deletion of your data by contacting us, but some records may be retained for compliance purposes.</p>
          <h2>Security</h2>
          <p>We use industry-standard security measures to protect your data. However, no method of transmission or storage is 100% secure. We encourage you to use strong passwords and keep your login credentials confidential.</p>
          <h2>Your Rights</h2>
          <ul>
            <li>You can access, update, or delete your account information at any time.</li>
            <li>You can request a copy of your data or ask us to delete your account by contacting support.</li>
            <li>You can manage cookie preferences in your browser settings.</li>
          </ul>
          <h2>Children's Privacy</h2>
          <p>InstaLabel is not intended for use by children under 16. We do not knowingly collect personal information from children.</p>
          <h2>Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on our website and updating the date below.</p>
          <h2>Contact Us</h2>
          <ul>
            <li>Email: <a href="mailto:support@InstaLabel.com">support@InstaLabel.com</a></li>
            <li>Website: <a href="https://InstaLabel.com/support" target="_blank" rel="noopener">https://InstaLabel.com/support</a></li>
          </ul>
        </article>
        <div className="py-8 text-sm text-muted-foreground">As of March 25th, 2024</div>
      </div>
    </section>
  )
}

export default Page

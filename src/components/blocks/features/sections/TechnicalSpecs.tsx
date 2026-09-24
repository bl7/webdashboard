import React from "react"

export const TechnicalSpecs = () => (
  <section className="bg-white py-16">
    <div className="container mx-auto px-4">
      <h3 className="mb-4 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Software & Printing Specifications
      </h3>
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">Software Specs</h3>
          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            <li>Products are stored in your InstaLabel account</li>
            <li>Print again from the dashboard or Android app</li>
            <li>PPDS layouts use the ingredient and allergen information you save</li>
            <li>Label stock can be ordered from the dashboard. Check the price at checkout</li>
            <li>Account login is required. Ask us for security documentation</li>
            <li>Built for a kitchen shift, with a short setup</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">Printing & Labels</h3>
          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            <li>Direct thermal printing (no ink or toner required)</li>
            <li>203 DPI resolution for crisp, clear text and graphics</li>
            <li>Print speed up to 152mm per second</li>
            <li>Label width support: 60mm x 40mm (standard) and 56mm x 80mm (PPDS labels)</li>
            <li>Computer: a label printer installed on Windows or macOS, through PrintBridge. Android: MUNBYN RW411B or Born4Ship DB403</li>
            <li>
              PrintBridge technology for USB printing on Mac and Windows, Bluetooth for Android
              devices
            </li>
            <li>Label temperature range: -40°C to +80°C</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
)

export default TechnicalSpecs

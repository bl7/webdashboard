import React from "react"

export const TechnicalSpecs = () => (
  <section className="bg-white py-16">
    <div className="container mx-auto px-4">
      <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Device & Software Specifications
      </h2>
      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">Device Specs</h3>
          <ul className="list-disc pl-5 text-gray-700">
            <li>2-day battery life, can be used while charging</li>
            <li>5.99" HD+ touchscreen, wipeclean and hygienic</li>
            <li>Integrated 2D barcode scanner</li>
            <li>WiFi and 4G SIM connectivity</li>
            <li>Protective rubber surround, drop-tested to 1m</li>
            <li>In-built flashlight for low-light use</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">Software Specs</h3>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Cloud-based storage, unlimited products</li>
            <li>Instant reprints from any device/location</li>
            <li>Built-in compliance for Natasha’s Law & EHO</li>
            <li>Easy label re-ordering in-app</li>
            <li>Secure AWS cloud backup</li>
            <li>Simple, intuitive interface—no training needed</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
)

export default TechnicalSpecs

import React from "react"

export const TechnicalSpecs = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4 text-center">
        Technical Specifications
      </h2>
      <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Device Specs</h3>
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Software Specs</h3>
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

export default TechnicalSpecs; 
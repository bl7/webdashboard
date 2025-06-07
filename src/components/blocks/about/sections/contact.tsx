import React from "react"
import { ContactForm } from "./form"
import { MapPin, Phone, Mail } from "lucide-react"

export const Contact = () => {
  return (
    <section id="contact" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl lg:flex lg:gap-24">
        {/* Left Side: Info */}
        <div className="lg:w-1/2">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Let’s Talk About Your Project
          </h2>
          <p className="mt-6 max-w-xl text-lg text-gray-600">
            InstaLabel is more than just a labeling solution; it’s a movement towards smarter, safer
            kitchens and better food safety practices for all.
          </p>

          <dl className="mt-10 space-y-8 text-base text-gray-600">
            <div className="flex items-start gap-x-4">
              <MapPin size={24} className="flex-shrink-0 text-primary" />
              <div>
                <dt className="font-semibold text-gray-900">Address</dt>
                <dd>123 Food St., Flavor Town, FT 45678</dd>
              </div>
            </div>

            <div className="flex items-start gap-x-4">
              <Phone size={24} className="flex-shrink-0 text-primary" />
              <div>
                <dt className="font-semibold text-gray-900">Phone</dt>
                <dd>+1 (555) 123-4567</dd>
              </div>
            </div>

            <div className="flex items-start gap-x-4">
              <Mail size={24} className="flex-shrink-0 text-primary" />
              <div>
                <dt className="font-semibold text-gray-900">Email</dt>
                <dd>contact@instalabel.com</dd>
              </div>
            </div>
          </dl>
        </div>

        {/* Right Side: Form */}
        <div className="mt-16 lg:mt-0 lg:w-1/2">
          <h3 className="text-2xl font-semibold text-gray-900">Send Us a Message</h3>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}

import React from "react"
import { ContactForm } from "./form"
import { MapPin, Phone, Mail } from "lucide-react"

export const Contact = () => {
  return (
    <section id="contact" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl lg:flex lg:gap-24">
        {/* Left Side: Info */}
        <div className="lg:w-1/2">
          <h2 className="text-5xl font-bold leading-tight text-foreground">Contact Us</h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Tell us a little bit about who you are, and we'll tell you a whole lot more about who we
            are.
          </p>

          <div className="mt-10">
            <h3 className="mb-6 text-2xl font-semibold text-foreground">Talk to our team today</h3>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <span className="text-lg font-medium text-foreground">1.</span>
                <p>Understanding how our product may fulfill your need</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg font-medium text-foreground">2.</span>
                <p>Discover the capabilities and get answer to your questions</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg font-medium text-foreground">3.</span>
                <p>Get a customized quote</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="mb-6 text-2xl font-semibold text-foreground">You can fins us here</h3>
            <dl className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent">
                  <MapPin className="h-4 w-4 text-accent-foreground" />
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Address</dt>
                  <dd className="text-muted-foreground">Bournemouth, UK</dd>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent">
                  <Phone className="h-4 w-4 text-accent-foreground" />
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Phone</dt>
                  <dd className="text-muted-foreground">(0740)567890 </dd>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent">
                  <Mail className="h-4 w-4 text-accent-foreground" />
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Email</dt>
                  <dd className="text-muted-foreground">contact@instalabel.co</dd>
                </div>
              </div>
            </dl>
          </div>
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

import React from "react"
import { ContactForm } from "./form"
import { MapPin, Phone, Mail, Clock, Users, CheckCircle } from "lucide-react"

export const Contact = () => {
  return (
    <section id="contact" className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50/30 py-12 sm:py-16">
      {/* Enhanced background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-purple-200/20 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-pink-200/20 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute left-3/4 top-1/2 h-64 w-64 rounded-full bg-blue-200/20 blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute left-1/2 top-10 h-32 w-32 rounded-full bg-green-200/30 blur-2xl" />
        <div className="absolute right-10 top-3/4 h-48 w-48 rounded-full bg-yellow-200/20 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
         
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-6 animate-fade-in">
            Get in Touch
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Tell us a little bit about who you are, and we'll tell you a whole lot more about who
            we are.
          </p>
        </div>

        <div className="flex flex-col gap-16 lg:flex-row lg:gap-20">
          {/* Left Side: Info - Floating elements */}
          <div className="lg:w-1/2 space-y-12">
            <div className="relative">    
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ml-4">
                <div className="group flex items-start gap-4 p-6 rounded-2xl transition-all duration-300 hover:bg-white/60 hover:backdrop-blur-sm hover:shadow-xl transform hover:-translate-y-1">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white transition-all duration-300 group-hover:scale-110 shadow-lg">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <dt className="font-bold text-gray-900 mb-1 text-lg">Address</dt>
                    <dd className="text-gray-600">Bournemouth, UK</dd>
                  </div>
                </div>

                <div className="group flex items-start gap-4 p-6 rounded-2xl transition-all duration-300 hover:bg-white/60 hover:backdrop-blur-sm hover:shadow-xl transform hover:-translate-y-1">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white transition-all duration-300 group-hover:scale-110 shadow-lg">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <dt className="font-bold text-gray-900 mb-1 text-lg">Phone</dt>
                    <dd className="text-gray-600">(0740)567890</dd>
                  </div>
                </div>

                <div className="group flex items-start gap-4 p-6 rounded-2xl transition-all duration-300 hover:bg-white/60 hover:backdrop-blur-sm hover:shadow-xl transform hover:-translate-y-1">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white transition-all duration-300 group-hover:scale-110 shadow-lg">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <dt className="font-bold text-gray-900 mb-1 text-lg">Email</dt>
                    <dd className="text-gray-600">contact@instalabel.co</dd>
                  </div>
                </div>

                <div className="group flex items-start gap-4 p-6 rounded-2xl transition-all duration-300 hover:bg-white/60 hover:backdrop-blur-sm hover:shadow-xl transform hover:-translate-y-1">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white transition-all duration-300 group-hover:scale-110 shadow-lg">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <dt className="font-bold text-gray-900 mb-1 text-lg">Response Time</dt>
                    <dd className="text-gray-600">Within 24 hours</dd>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators - Floating badges */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              <div className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-green-50 to-green-100 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group">
                <CheckCircle className="h-8 w-8 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <div className="text-lg font-bold text-gray-900">500+ Kitchens</div>
                  <div className="text-sm text-gray-600">Trust InstaLabel</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-purple-100 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group">
                <CheckCircle className="h-8 w-8 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <div className="text-lg font-bold text-gray-900">EHO Compliant</div>
                  <div className="text-sm text-gray-600">Certified Solution</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form - Floating design */}
          <div className="lg:w-1/2">
            <div className="relative">
              {/* Floating form header */}
              <div className="flex items-center mb-8 group">
              
             
              </div>
              
              {/* Form with minimal styling */}
              <div className="pl-4 transform hover:scale-[1.02] transition-all duration-500">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>
  )
}
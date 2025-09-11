"use client"

import React from "react"
import { CheckCircle, Clock, Shield, Users, Zap } from "lucide-react"

export const DefrostLabelsBenefits = () => {
  const benefits = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "HACCP Compliance",
      description:
        "Meet all HACCP requirements with automated defrost tracking and proper documentation for food safety audits.",
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: "Time Tracking",
      description:
        "Automatically track defrost start times, duration, and responsible staff to ensure proper food handling procedures.",
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Staff Accountability",
      description:
        "Clear staff identification on every label ensures proper responsibility tracking and training opportunities.",
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-600" />,
      title: "Reduced Waste",
      description:
        "Prevent over-defrosting and food waste with clear expiry tracking and automated alerts for optimal usage.",
    },
  ]

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Why Defrost Labels Matter
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
            Proper defrost tracking is essential for food safety, HACCP compliance, and reducing
            waste in your kitchen.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100">
                {benefit.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-lg bg-blue-50 p-8">
          <div className="text-center">
            <h3 className="mb-4 text-2xl font-bold text-gray-900">
              Ready to Improve Your Defrost Process?
            </h3>
            <p className="mb-6 text-lg text-gray-600">
              Start creating compliant defrost labels in minutes with InstaLabel's automated system.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700">
                Start Free Trial
              </button>
              <button className="rounded-lg border border-blue-600 px-8 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50">
                Book Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import React, { useState } from "react"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  "Device Provided",
  "Unlimited Label Printing",
  "Access to Web Dashboard",
  "Sunmi Printer Support",
  "Weekly Free Prints",
]

const plans = [
  {
    name: "Free Plan",
    monthly: "Free",
    yearly: "Free",
    features: {
      "Device Provided": false,
      "Unlimited Label Printing": false,
      "Access to Web Dashboard": true,
      "Sunmi Printer Support": false,
      "Weekly Free Prints": true,
    },
    description:
      "Ideal for testing or low-volume use. Bring your own Epson TM-M30 and get 20 free prints every week.",
    highlight: false,
    cta: "Get Started Free",
  },
  {
    name: "Basic Plan",
    monthly: "£20/mo",
    yearly: "£216/yr (10% off)",
    features: {
      "Device Provided": "Epson TM-M30 Included",
      "Unlimited Label Printing": true,
      "Access to Web Dashboard": false,
      "Sunmi Printer Support": false,
      "Weekly Free Prints": false,
    },
    description:
      "For growing kitchens. Get an Epson device included and enjoy unlimited print volume.",
    highlight: true,
    cta: "Start Basic Plan",
  },
  {
    name: "Premium Plan",
    monthly: "£25/mo",
    yearly: "£270/yr",
    features: {
      "Device Provided": "Sunmi or Epson Included",
      "Unlimited Label Printing": true,
      "Access to Web Dashboard": true,
      "Sunmi Printer Support": true,
      "Weekly Free Prints": false,
    },
    description:
      "Everything in Basic plus Web Dashboard access and support for Sunmi touchscreen printers.",
    highlight: false,
    cta: "Go Premium",
  },
]

const ProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState<"account" | "billing">("account")
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  return (
    <div className="container py-8">
      {/* Tabs */}
      <div className="mb-6 flex space-x-4 border-b">
        {["account", "billing"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "account" | "billing")}
            className={cn(
              "border-b-2 px-4 py-2 text-sm font-medium transition",
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-primary"
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      {/* Content */}

      {activeTab === "account" && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Profile Card */}
          <div className="flex flex-col items-center rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-4 h-32 w-32 overflow-hidden rounded-full">
              <img
                src="/images/user-placeholder.jpg" // Replace with your actual user image or dynamic image
                alt="User Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <h2 className="text-lg font-semibold">Esther Howard</h2>
            <p className="text-center text-sm text-muted-foreground">
              Hubertusstraße 149, 41239 Mönchengladbach
            </p>
            <div className="mt-2 flex items-center">
              <span className="text-yellow-500">★ 5.0</span>
              <span className="ml-1 text-xs text-muted-foreground">(1)</span>
              <span className="ml-2 rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                Sponsored
              </span>
            </div>
            <button className="mt-4 text-sm text-destructive hover:underline">Close Account</button>
          </div>

          {/* Profile Form */}
          <div className="md:col-span-2">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Profile</h2>
              {/* User Information */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    placeholder="Esther Howard"
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    placeholder="s.sophia@swiss-marketing-systems.com"
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Phone</label>
                  <input
                    type="tel"
                    placeholder="01746565684"
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <button className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                Save Now
              </button>

              {/* Password Change */}
              <div className="mt-6 border-t pt-4">
                <h3 className="text-md mb-4 font-semibold">Password</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Current Password</label>
                    <input
                      type="password"
                      placeholder="********"
                      className="w-full rounded-md border px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">New Password</label>
                    <input
                      type="password"
                      placeholder="New Password"
                      className="w-full rounded-md border px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      className="w-full rounded-md border px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <button className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === "billing" && (
        <div>
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold">Start Free, Scale as You Grow</h2>
              <p className="text-muted-foreground">
                Begin with 20 free weekly prints — upgrade anytime when you're ready to go all-in.
              </p>
            </div>
            {/* Billing Toggle */}
            <div className="mt-4 inline-flex rounded-full bg-muted p-1 md:mt-0">
              {["monthly", "yearly"].map((type) => (
                <button
                  key={type}
                  onClick={() => setBillingCycle(type as "monthly" | "yearly")}
                  className={cn(
                    "rounded-full px-5 py-1.5 text-sm font-medium transition",
                    billingCycle === type
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-muted/60"
                  )}
                >
                  {type === "monthly" ? "Monthly Billing" : "Yearly Billing"}
                </button>
              ))}
            </div>
          </div>

          {/* Plan Cards */}
          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={cn(
                  "flex flex-col rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md",
                  plan.highlight
                    ? "border-primary bg-primary/5 ring-2 ring-primary"
                    : "border-border"
                )}
              >
                {plan.highlight && (
                  <span className="mb-2 inline-block rounded-full bg-primary px-3 py-1 text-xs text-white shadow">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-bold text-primary">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <p className="mt-2 font-semibold text-foreground">{plan[billingCycle]}</p>
                <ul className="mt-4 space-y-2">
                  {features.map((feature) => {
                    const value = plan.features[feature as keyof typeof plan.features]
                    return (
                      <li key={feature} className="flex items-center text-sm text-muted-foreground">
                        {value === true ? (
                          <Check className="mr-2 h-4 w-4 text-green-600" />
                        ) : value === false ? (
                          <X className="mr-2 h-4 w-4 text-red-400" />
                        ) : (
                          <span className="mr-2 h-4 w-4 text-muted-foreground">•</span>
                        )}
                        <span>
                          {value === true || value === false ? feature : `${feature}: ${value}`}
                        </span>
                      </li>
                    )
                  })}
                </ul>
                <button
                  className={cn(
                    "mt-auto rounded-md px-3 py-1.5 text-sm font-medium transition",
                    plan.highlight
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-muted text-primary hover:bg-primary/10"
                  )}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileDashboard

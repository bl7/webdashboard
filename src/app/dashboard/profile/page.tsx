"use client"

import React, { useEffect, useState, useRef } from "react"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import Billing from "./Billing"

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

const avatarOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const ProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState<"account" | "billing">("account")
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [address, setAddress] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [avatar, setAvatar] = useState<number>(1)
  const [showModal, setShowModal] = useState(false)

  // Change PIN states
  const [currentPinDigits, setCurrentPinDigits] = useState<string[]>(["", "", "", ""])
  const [newPinDigits, setNewPinDigits] = useState<string[]>(["", "", "", ""])
  const [pinError, setPinError] = useState<string | null>(null)
  const [pinSuccess, setPinSuccess] = useState<string | null>(null)
  const currentPinRefs = useRef<(HTMLInputElement | null)[]>([])
  const newPinRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const storedName = localStorage.getItem("name") || ""
    const storedEmail = localStorage.getItem("email") || ""
    setName(storedName)
    setEmail(storedEmail)

    const storedId = localStorage.getItem("userid")
    if (!storedId) return
    setUserId(storedId)

    const storedAvatar = localStorage.getItem("avatar")
    if (storedAvatar) {
      const avatarNum = parseInt(storedAvatar, 10)
      if (!isNaN(avatarNum) && avatarNum >= 1 && avatarNum <= 8) {
        setAvatar(avatarNum)
      }
    }

    fetch(`/api/profile?user_id=${storedId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.profile) {
          setAddress(data.profile.address || "")
          setCompanyName(data.profile.company_name || "")

          const pic = data.profile.profile_picture
          if (pic && pic.startsWith("/avatar")) {
            const match = pic.match(/\/avatar(\d+)\.png/)
            if (match) {
              const avatarNum = parseInt(match[1], 10)
              if (!isNaN(avatarNum) && avatarNum >= 1 && avatarNum <= 8) {
                setAvatar(avatarNum)
                localStorage.setItem("avatar", avatarNum.toString())
              }
            }
          }
        }
      })
      .catch(() => toast.error("Failed to load profile"))
  }, [])

  const handleSave = async () => {
    const userId = localStorage.getItem("userid")
    const avatarIndex = localStorage.getItem("avatar") || "1"

    if (!userId) return toast.error("Missing user ID")

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        address,
        company_name: companyName,
        profile_picture: `/avatar${avatarIndex}.png`,
      }),
    })

    if (res.ok) {
      toast.success("Profile updated")
    } else {
      toast.error("Failed to update profile")
    }
  }

  const handleAvatarSelect = (index: number) => {
    setAvatar(index)
    localStorage.setItem("avatar", index.toString())
    setShowModal(false)
  }

  // Generic PIN input handler with auto-focus
  const handlePinChange = (
    index: number,
    value: string,
    pinDigits: string[],
    setPinDigits: React.Dispatch<React.SetStateAction<string[]>>,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    if (/^\d$/.test(value)) {
      const newPin = [...pinDigits]
      newPin[index] = value
      setPinDigits(newPin)
      setPinError(null)
      setPinSuccess(null)
      if (index < 3) refs.current[index + 1]?.focus()
    } else if (value === "") {
      const newPin = [...pinDigits]
      newPin[index] = ""
      setPinDigits(newPin)
      if (index > 0) refs.current[index - 1]?.focus()
    }
  }

  // Handle Change PIN button click
  const handleChangePin = async () => {
    const currentPin = currentPinDigits.join("")
    const newPin = newPinDigits.join("")

    if (currentPin.length !== 4) {
      setPinError("Please enter your current 4-digit PIN.")
      currentPinRefs.current[0]?.focus()
      return
    }

    if (newPin.length !== 4) {
      setPinError("Please enter a new 4-digit PIN.")
      newPinRefs.current[0]?.focus()
      return
    }

    if (!userId) {
      setPinError("User ID missing. Please reload the page.")
      return
    }

    try {
      // Verify current PIN
      const verifyRes = await fetch("/api/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, pin: currentPin }),
      })

      const verifyData = await verifyRes.json()

      if (!verifyRes.ok || !verifyData.valid) {
        setPinError("Current PIN is incorrect.")
        setPinSuccess(null)
        currentPinRefs.current[0]?.focus()
        return
      }

      // Set new PIN
      const setRes = await fetch("/api/set-admin-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, pin: newPin }),
      })

      if (setRes.ok) {
        setPinSuccess("PIN changed successfully!")
        setPinError(null)
        setCurrentPinDigits(["", "", "", ""])
        setNewPinDigits(["", "", "", ""])
        currentPinRefs.current[0]?.focus()
      } else {
        const setData = await setRes.json()
        setPinError(setData.message || "Failed to change PIN.")
        setPinSuccess(null)
      }
    } catch {
      setPinError("Network error. Please try again.")
      setPinSuccess(null)
    }
  }

  return (
    <div className="">
      <div className="mb-6 flex border-b">
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

      {activeTab === "account" && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Profile Card */}
          <div className="flex flex-col items-center rounded-xl border bg-white p-6 shadow-sm">
            <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full">
              <img
                src={`/avatar${avatar}.png`}
                alt="User Avatar"
                className="h-32 w-32 rounded-full object-cover"
              />
              <button
                onClick={() => setShowModal(true)}
                className="absolute bottom-0 left-0 right-0 bg-black/60 py-1 text-xs text-white"
              >
                Change Avatar
              </button>
            </div>
            <h2 className="text-lg font-semibold">{name}</h2>
            <p className="text-center text-sm text-muted-foreground">
              {address || "No address set"}
            </p>
            <div className="mt-2 flex items-center">
              <span className="text-yellow-500">★ 5.0</span>
              <span className="ml-1 text-xs text-muted-foreground">(1)</span>
              <span className="ml-2 rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                Sponsored
              </span>
            </div>
          </div>

          {/* Profile Form */}
          <div className="md:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-semibold text-gray-900">Profile</h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Company Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    placeholder="Enter company name"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    placeholder="Enter address"
                  />
                </div>

                {/* Name (disabled) */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-500">Name</label>
                  <input
                    type="text"
                    value={name}
                    disabled
                    className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500"
                  />
                </div>

                {/* Email (disabled) */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-500">Email</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500"
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                className="mt-6 inline-flex justify-center rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              >
                Save Now
              </button>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-md mb-4 font-semibold text-gray-900">Change Admin PIN</h3>
                <p className="mb-4 text-sm text-gray-600">
                  Enter your current PIN and a new 4-digit PIN to change your admin access PIN.
                </p>

                <div className="flex flex-wrap gap-8">
                  {/* Current PIN */}
                  <div className="flex min-w-[200px] flex-1 flex-col">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Current PIN
                    </label>
                    <div className="flex gap-3">
                      {[0, 1, 2, 3].map((idx) => (
                        <input
                          key={`current-${idx}`}
                          type="password"
                          maxLength={1}
                          value={currentPinDigits[idx]}
                          onChange={(e) =>
                            handlePinChange(
                              idx,
                              e.target.value,
                              currentPinDigits,
                              setCurrentPinDigits,
                              currentPinRefs
                            )
                          }
                          ref={(el) => {
                            currentPinRefs.current[idx] = el
                          }}
                          className="h-12 w-12 rounded-md border border-gray-300 bg-white text-center text-2xl text-gray-900 shadow-sm transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          autoComplete="one-time-code"
                          aria-label={`Current PIN digit ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* New PIN */}
                  <div className="flex min-w-[200px] flex-1 flex-col">
                    <label className="mb-2 block text-sm font-medium text-gray-700">New PIN</label>
                    <div className="flex gap-3">
                      {[0, 1, 2, 3].map((idx) => (
                        <input
                          key={`new-${idx}`}
                          type="password"
                          maxLength={1}
                          value={newPinDigits[idx]}
                          onChange={(e) =>
                            handlePinChange(
                              idx,
                              e.target.value,
                              newPinDigits,
                              setNewPinDigits,
                              newPinRefs
                            )
                          }
                          ref={(el) => {
                            newPinRefs.current[idx] = el
                          }}
                          className="h-12 w-12 rounded-md border border-gray-300 bg-white text-center text-2xl text-gray-900 shadow-sm transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          autoComplete="one-time-code"
                          aria-label={`New PIN digit ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  {pinError && <p className="mb-4 text-sm text-red-600">{pinError}</p>}
                  {pinSuccess && <p className="mb-4 text-sm text-green-600">{pinSuccess}</p>}

                  <button
                    onClick={handleChangePin}
                    className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  >
                    Change PIN
                  </button>
                </div>
              </div>

              {/* Password Section */}
              <div className="mt-10 border-t border-gray-200 pt-6">
                <h3 className="text-md mb-5 font-semibold text-gray-900">Password</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="********"
                      className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="New Password"
                      className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500"
                      disabled
                    />
                  </div>
                </div>
                <button
                  disabled
                  className="mt-6 cursor-not-allowed rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-400"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Billing Tab stays unchanged */}
      {activeTab === "billing" && userId && <Billing />}

      {/* Avatar Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-lg bg-white p-6">
            <h2 className="mb-4 text-center text-lg font-semibold">Choose your avatar</h2>
            <div className="flex space-x-4">
              {avatarOptions.map((num) => (
                <img
                  key={num}
                  src={`/avatar${num}.png`}
                  onClick={() => handleAvatarSelect(num)}
                  alt={`Avatar ${num}`}
                  className={cn(
                    "h-16 w-16 cursor-pointer rounded-full border-2 transition hover:scale-105",
                    avatar === num ? "border-primary" : "border-muted"
                  )}
                />
              ))}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full rounded-md bg-muted px-4 py-2 text-sm text-muted-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileDashboard

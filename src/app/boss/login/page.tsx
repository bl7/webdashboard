"use client"
import React, { useState } from "react"
import { Eye, EyeOff, Shield, Zap, Lock, User, AlertCircle, CheckCircle } from "lucide-react"
import FloatingParticles from "./FloatingParticles"
import { useRouter } from "next/navigation"

export default function BossLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError("")
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/bosses/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Store token in localStorage
      localStorage.setItem("bossToken", data.token)
      
      setSuccess("Login successful! Redirecting...")
      
      setTimeout(() => {
        router.push("/bossdashboard")
      }, 1500)
    } catch (err: any) {
      setError(err?.message || err?.toString() || "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 animate-pulse rounded-full bg-blue-500/20 blur-3xl delay-1000"></div>
        <div className="delay-2000 absolute left-1/2 top-3/4 h-64 w-64 animate-pulse rounded-full bg-pink-500/20 blur-3xl"></div>
      </div>

      {/* Floating particles */}
      <FloatingParticles />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mb-6 inline-flex h-20 w-20 transform items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-2xl transition-transform duration-300 hover:scale-110">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-4xl font-bold text-transparent text-white">
              SuperAdmin
            </h1>
            <p className="text-lg text-slate-400">Secure Administrative Access</p>
          </div>

          <div className="transform rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105">
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-10 pr-3 text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="admin@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-10 pr-10 text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-red-400">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-green-400">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex w-full transform items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Access Dashboard
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 text-center">
              <a
                href="#"
                className="text-sm text-slate-400 transition-colors duration-200 hover:text-purple-400"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              🔒 This is a secure administrative portal. All access attempts are logged.
            </p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
  )
}

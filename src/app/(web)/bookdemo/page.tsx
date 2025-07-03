'use client'
import React, { useState } from 'react'
import { CheckCircle, Users, Shield, BarChart3, Zap, ArrowRight, Sparkles } from 'lucide-react'

const initialState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  role: '',
  message: '',
  source: '',
}

export default function BookDemoPage() {
  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/bookdemo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to submit')
      setSuccess(true)
      setForm(initialState)
    }  catch (err) {
      setError((err as any).message || 'Failed to submit')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 py-8 sm:py-12">
        <div className="grid gap-10 sm:gap-16 items-start lg:grid-cols-2">
          {/* Left Column - Hero Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent leading-tight">
                Experience the
                <span className="block ">
                  Future of Kitchen
                </span>
                Labeling
              </h1>
              <p className="text-base sm:text-xl text-slate-600 leading-relaxed max-w-xl">
                Transform your kitchen operations with our intelligent labeling platform. 
                Book a personalized demo and see how InstaLabel can revolutionize your workflow.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Zap, title: "Instant Setup", desc: "Get started in minutes" },
                { icon: Shield, title: "100% Compliant", desc: "Always regulation-ready" },
                { icon: BarChart3, title: "Real-time Analytics", desc: "Track everything live" },
                { icon: Users, title: "Team Collaboration", desc: "Built for modern teams" }
              ].map((benefit, i) => (
                <div key={i} className="group p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <benefit.icon className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-semibold text-slate-800 mb-1">{benefit.title}</h3>
                  <p className="text-sm text-slate-600">{benefit.desc}</p>
                </div>
              ))}
            </div>

            {/* Social Proof */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border border-emerald-200/50 shadow-lg">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{animationDelay: `${i * 0.2}s`}}></div>
                ))}
                <span className="text-emerald-700 font-semibold text-xs sm:text-base">Trusted by 500+ kitchens worldwide</span>
              </div>
              <p className="text-slate-700 italic text-sm sm:text-base">"InstaLabel transformed our kitchen operations. We're now 100% compliant and save 3 hours daily on labeling tasks."</p>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 sm:mt-2">
                — Sarah Chen, Head Chef at Riverside Bistro</p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:sticky lg:top-8">
            {success ? (
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white p-6 sm:p-8 rounded-3xl shadow-2xl text-center transform ">
                <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4" />
                <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Demo Booked Successfully!</h2>
                <p className="text-emerald-100 text-sm sm:text-base">Thank you! Our team will reach out within 24 hours to schedule your personalized demo.</p>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 text-white">
                  <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Book Your Free Demo</h2>
                  <p className="text-blue-100 text-xs sm:text-base">Join hundreds of kitchens already using InstaLabel</p>
                </div>
                <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Full Name *</label>
                      <input
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField('')}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                          focusedField === 'name' 
                            ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Email *</label>
                      <input
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField('')}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                          focusedField === 'email' 
                            ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Phone</label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField('')}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                          focusedField === 'phone' 
                            ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Company</label>
                      <input
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('company')}
                        onBlur={() => setFocusedField('')}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                          focusedField === 'company' 
                            ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        placeholder="Your restaurant"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Role</label>
                      <input
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('role')}
                        onBlur={() => setFocusedField('')}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                          focusedField === 'role' 
                            ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        placeholder="Head Chef, Manager..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">How did you hear about us?</label>
                      <select
                        name="source"
                        value={form.source}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('source')}
                        onBlur={() => setFocusedField('')}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                          focusedField === 'source' 
                            ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <option value="">Select source...</option>
                        <option value="google">Google Search</option>
                        <option value="referral">Referral</option>
                        <option value="social">Social Media</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Tell us about your needs</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField('')}
                      rows={4}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none resize-none ${
                        focusedField === 'message' 
                          ? 'border-blue-500 bg-blue-50 shadow-lg' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      placeholder="What specific challenges are you facing with kitchen labeling? How many covers do you serve daily?"
                    />
                  </div>

                  {error && <div className="text-red-500 text-xs sm:text-sm">{error}</div>}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-base sm:text-lg shadow-lg hover:bg-blue-700 transition disabled:opacity-60"
                    disabled={loading}
                  >
                    {loading ? 'Booking...' : 'Book Demo'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
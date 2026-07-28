"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"

interface AdminPinModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  /** When true, immediately send OTP and open the verify step */
  startOnForgot?: boolean
}

type Step = "enter" | "otp" | "new-pin"

export default function AdminPinModal({
  isOpen,
  onClose,
  onSuccess,
  startOnForgot = false,
}: AdminPinModalProps) {
  const [step, setStep] = useState<Step>("enter")
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", ""])
  const [newPinDigits, setNewPinDigits] = useState<string[]>(["", "", "", ""])
  const [confirmPinDigits, setConfirmPinDigits] = useState<string[]>(["", "", "", ""])
  const [otp, setOtp] = useState("")
  const [maskedEmail, setMaskedEmail] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(0)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const newPinRefs = useRef<(HTMLInputElement | null)[]>([])
  const confirmPinRefs = useRef<(HTMLInputElement | null)[]>([])
  const autoForgotRef = useRef(false)

  useEffect(() => {
    if (timer <= 0) return
    const id = setTimeout(() => setTimer((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timer])

  useEffect(() => {
    if (!isOpen) {
      autoForgotRef.current = false
      return
    }
    clearAll()
    setStep("enter")
    if (startOnForgot && !autoForgotRef.current) {
      autoForgotRef.current = true
      void requestOtp()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, startOnForgot])

  const clearAll = () => {
    setPinDigits(["", "", "", ""])
    setNewPinDigits(["", "", "", ""])
    setConfirmPinDigits(["", "", "", ""])
    setOtp("")
    setResetToken("")
    setMaskedEmail("")
    setError(null)
    setInfo(null)
    setLoading(false)
    setTimer(0)
  }

  const handleDigitChange = (
    index: number,
    val: string,
    digits: string[],
    setDigits: React.Dispatch<React.SetStateAction<string[]>>,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>,
    onComplete?: (pin: string) => void
  ) => {
    if (!/^\d?$/.test(val)) return
    const updated = [...digits]
    updated[index] = val
    setDigits(updated)

    if (val && index < 3) refs.current[index + 1]?.focus()
    if (val === "" && index > 0) refs.current[index - 1]?.focus()
    if (updated.every((d) => d) && onComplete) onComplete(updated.join(""))
  }

  const verifyPin = async (pin: string) => {
    const userId = localStorage.getItem("userid")
    if (!userId) return

    try {
      const res = await fetch("/api/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, pin }),
      })

      const { valid } = await res.json()
      if (valid) {
        onSuccess()
        clearAll()
      } else {
        setError("Incorrect PIN")
        setPinDigits(["", "", "", ""])
        inputRefs.current[0]?.focus()
      }
    } catch {
      setError("Verification error")
      setPinDigits(["", "", "", ""])
    }
  }

  const requestOtp = async () => {
    const userId = localStorage.getItem("userid")
    if (!userId) {
      setError("User ID missing. Please reload the page.")
      return
    }

    setLoading(true)
    setError(null)
    setInfo(null)
    try {
      const res = await fetch("/api/admin-pin/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.message || "Failed to send reset code.")
        return
      }
      setMaskedEmail(data.maskedEmail || "")
      setInfo(`Code sent to ${data.maskedEmail}`)
      setStep("otp")
      setTimer(60)
      setOtp("")
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    const userId = localStorage.getItem("userid")
    if (!userId) return
    if (otp.length !== 6) {
      setError("Enter the 6-digit code.")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin-pin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.message || "Invalid code.")
        return
      }
      setResetToken(data.resetToken)
      setStep("new-pin")
      setInfo("Enter a new 4-digit PIN.")
      setNewPinDigits(["", "", "", ""])
      setConfirmPinDigits(["", "", "", ""])
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const submitNewPin = async () => {
    const userId = localStorage.getItem("userid")
    if (!userId || !resetToken) return

    const pin = newPinDigits.join("")
    const confirm = confirmPinDigits.join("")
    if (pin.length !== 4 || confirm.length !== 4) {
      setError("Enter and confirm a 4-digit PIN.")
      return
    }
    if (pin !== confirm) {
      setError("PINs do not match.")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin-pin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, resetToken, pin }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.message || "Failed to reset PIN.")
        return
      }
      localStorage.removeItem("adminAccess")
      if (startOnForgot) {
        onSuccess()
        clearAll()
        return
      }
      setInfo("PIN reset successfully. Enter your new PIN.")
      setStep("enter")
      setResetToken("")
      setPinDigits(["", "", "", ""])
      setTimeout(() => inputRefs.current[0]?.focus(), 50)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    clearAll()
    setStep("enter")
    onClose()
  }

  const title =
    step === "enter" ? "Enter Admin PIN" : step === "otp" ? "Verify Reset Code" : "Set New Admin PIN"

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {step === "otp" && (
            <DialogDescription>
              Enter the 6-digit code sent to {maskedEmail || "your email"}.
            </DialogDescription>
          )}
          {step === "new-pin" && (
            <DialogDescription>Choose a new 4-digit PIN for admin access.</DialogDescription>
          )}
        </DialogHeader>

        {step === "enter" && (
          <>
            <div className="mb-2 flex justify-center gap-3">
              {pinDigits.map((digit, i) => (
                <input
                  key={i}
                  type="password"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleDigitChange(
                      i,
                      e.target.value,
                      pinDigits,
                      setPinDigits,
                      inputRefs,
                      verifyPin
                    )
                  }
                  ref={(el) => {
                    inputRefs.current[i] = el
                  }}
                  className="h-12 w-12 rounded border text-center text-2xl"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              ))}
            </div>
            <div className="mb-2 text-center">
              <button
                type="button"
                onClick={requestOtp}
                disabled={loading}
                className="text-sm font-medium text-primary hover:underline"
              >
                {loading ? "Sending code..." : "Forgot PIN?"}
              </button>
            </div>
          </>
        )}

        {step === "otp" && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot className="size-10 rounded-md border shadow-none" index={0} />
                  <InputOTPSeparator />
                  <InputOTPSlot className="size-10 rounded-md border shadow-none" index={1} />
                  <InputOTPSeparator />
                  <InputOTPSlot className="size-10 rounded-md border shadow-none" index={2} />
                  <InputOTPSeparator />
                  <InputOTPSlot className="size-10 rounded-md border shadow-none" index={3} />
                  <InputOTPSeparator />
                  <InputOTPSlot className="size-10 rounded-md border shadow-none" index={4} />
                  <InputOTPSeparator />
                  <InputOTPSlot className="size-10 rounded-md border shadow-none" index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button className="w-full" onClick={verifyOtp} disabled={loading || otp.length !== 6}>
              {loading ? "Verifying..." : "Verify Code"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              {timer > 0 ? (
                <span>Resend code in {timer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={requestOtp}
                  disabled={loading}
                  className="font-medium text-primary hover:underline"
                >
                  Resend code
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setStep("enter")
                setError(null)
                setInfo(null)
              }}
              className="w-full text-sm text-muted-foreground hover:underline"
            >
              Back to PIN entry
            </button>
          </div>
        )}

        {step === "new-pin" && (
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">New PIN</p>
              <div className="flex justify-center gap-3">
                {newPinDigits.map((digit, i) => (
                  <input
                    key={`new-${i}`}
                    type="password"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleDigitChange(i, e.target.value, newPinDigits, setNewPinDigits, newPinRefs)
                    }
                    ref={(el) => {
                      newPinRefs.current[i] = el
                    }}
                    className="h-12 w-12 rounded border text-center text-2xl"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Confirm PIN</p>
              <div className="flex justify-center gap-3">
                {confirmPinDigits.map((digit, i) => (
                  <input
                    key={`confirm-${i}`}
                    type="password"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleDigitChange(
                        i,
                        e.target.value,
                        confirmPinDigits,
                        setConfirmPinDigits,
                        confirmPinRefs
                      )
                    }
                    ref={(el) => {
                      confirmPinRefs.current[i] = el
                    }}
                    className="h-12 w-12 rounded border text-center text-2xl"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                ))}
              </div>
            </div>
            <Button className="w-full" onClick={submitNewPin} disabled={loading}>
              {loading ? "Saving..." : "Save New PIN"}
            </Button>
          </div>
        )}

        {error && <p className="text-center text-sm text-red-600">{error}</p>}
        {info && !error && <p className="text-center text-sm text-green-600">{info}</p>}

        <DialogFooter>
          <button
            onClick={handleClose}
            className="rounded bg-gray-200 px-4 py-2 font-semibold hover:bg-gray-300"
          >
            Cancel
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

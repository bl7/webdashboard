"use client"

import React, { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface AdminPinModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AdminPinModal({ isOpen, onClose, onSuccess }: AdminPinModalProps) {
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handlePinChange = (index: number, val: string) => {
    if (!/^\d?$/.test(val)) return

    const updated = [...pinDigits]
    updated[index] = val
    setPinDigits(updated)

    if (val && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
    if (val === "" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    if (updated.every((d) => d)) {
      verifyPin(updated.join(""))
    }
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
        resetPin()
      } else {
        alert("Incorrect PIN")
        resetPin()
      }
    } catch {
      alert("Verification error")
      resetPin()
    }
  }

  const resetPin = () => {
    setPinDigits(["", "", "", ""])
    inputRefs.current[0]?.focus()
  }

  const handleClose = () => {
    resetPin()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Admin PIN</DialogTitle>
        </DialogHeader>
        <div className="mb-4 flex justify-center gap-3">
          {pinDigits.map((digit, i) => (
            <input
              key={i}
              type="password"
              maxLength={1}
              value={digit}
              onChange={(e) => handlePinChange(i, e.target.value)}
              ref={(el) => {
                inputRefs.current[i] = el
              }}
              className="h-12 w-12 rounded border text-center text-2xl"
              inputMode="numeric"
              pattern="[0-9]*"
            />
          ))}
        </div>
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

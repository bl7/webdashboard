"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { sendForgotPasswordEmail, verifyOtpPin } from "@/lib/api"

const otpFormSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits"),
})

export function VerifyOtpForm() {
  const form = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: { otp: "" },
  })

  const router = useRouter()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(60)
  const [resending, setResending] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Get email from localStorage on mount
  useEffect(() => {
    setEmail(localStorage.getItem("resetEmail") || "")
  }, [])

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setTimeout(() => setTimer((t) => t - 1), 1000)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [timer])

  async function onSubmit(values: z.infer<typeof otpFormSchema>) {
    setError(null)
    setLoading(true)
    try {
      await verifyOtpPin(email, values.otp)
      router.push("/reset-password")
    } catch (err: any) {
      setError(err.message || "OTP verification failed")
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setError(null)
    setResending(true)
    try {
      await sendForgotPasswordEmail(email)
      setTimer(60)
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP")
    } finally {
      setResending(false)
    }
  }

  return (
    <Form {...form}>
      <form className="w-full max-w-lg" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
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
              </FormControl>
              <FormDescription>Enter the 6 digit code sent to your email</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
        <Button className="mt-4 w-full" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
        <div className="mt-4 flex flex-col items-center gap-2">
          {timer > 0 ? (
            <span className="text-sm text-gray-500">
              Resend OTP in <span className="font-semibold">{timer}s</span>
            </span>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={resending}
              onClick={handleResend}
            >
              {resending ? "Resending..." : "Resend OTP"}
            </Button>
          )}
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <p className="text-sm text-muted-foreground">Don&apos;t have an account?</p>
          <Link
            className="text-sm font-medium text-primary hover:underline hover:underline-offset-2"
            href="/register"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </Form>
  )
}

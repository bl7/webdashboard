"use client"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { loginUser, resendVerification } from "@/lib/api"

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, "Password is required"),
})

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)

  const handleResendVerification = useCallback(async () => {
    if (!unverifiedEmail) return
    try {
      setIsResending(true)
      const res = await resendVerification(unverifiedEmail)
      toast.success(res?.message || "Verification email sent")
    } catch (error: any) {
      toast.error(error?.message || "Failed to resend verification email")
    } finally {
      setIsResending(false)
    }
  }, [unverifiedEmail])

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = useCallback(
    async (values: z.infer<typeof loginSchema>) => {
      try {
        setIsLoading(true)
        setUnverifiedEmail(null)
        const response = await loginUser(values)

        if (response?.token || response?.success) {
          const token = response.token
          
          // Store in localStorage
          localStorage.setItem("token", token)
          localStorage.setItem("userid", response.uuid)
          localStorage.setItem("email", response.email)
          localStorage.setItem("full_name", response.name)
          localStorage.setItem("name", response.name)
          
          // Also set cookie so middleware can see it
          // Set cookie with 7 days expiry, secure on HTTPS
          const maxAge = 7 * 24 * 60 * 60 // 7 days in seconds
          const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:'
          document.cookie = `token=${token}; path=/; max-age=${maxAge}; SameSite=Lax${isSecure ? '; Secure' : ''}`
          
          console.log("Login successful, token stored")
          toast.success("Login successful")

          // Check user status and redirect appropriately
          try {
            const [profileRes, subRes] = await Promise.all([
              fetch(`/api/profile?user_id=${response.uuid}`),
              fetch(`/api/subscription_better/status`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }),
            ])

            if (profileRes.ok && subRes.ok) {
              const { profile } = await profileRes.json()
              const { subscription } = await subRes.json()

              // If user has completed setup, go to dashboard (ignore subscription status)
              if (profile?.setup_completed) {
                router.push("/dashboard")
              } else {
                // Otherwise, go to setup to complete profile/subscription
                router.push("/setup")
              }
            } else {
              // If we can't check status, go to setup
              router.push("/setup")
            }
          } catch (error) {
            console.error("Error checking user status:", error)
            // If there's an error, go to setup
            router.push("/setup")
          }
        } else {
          toast.error("Invalid login response")
        }
      } catch (error: any) {
        console.error("Login error:", error)
        const msg = error?.response?.data?.message || error.message || "Failed to login"
        const isUnverified =
          error?.status === 403 || /not\s*verified/i.test(msg)
        if (isUnverified) {
          setUnverifiedEmail(values.email)
        }
        toast.error(msg)
      } finally {
        setIsLoading(false)
      }
    },
    [router]
  )

  return (
    <Form {...form}>
      <form className="w-full max-w-lg space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-6 text-center text-xl font-semibold">Sign in to your account</div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@company.com"
                  className="w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  id="password"
                  placeholder="Enter your password"
                  className="w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <Link
            className="text-sm font-medium text-primary hover:underline hover:underline-offset-2"
            href="/forgot-password"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>

        {unverifiedEmail && (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <p className="mb-2">Your email isn&apos;t verified yet.</p>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleResendVerification}
              disabled={isResending}
            >
              {isResending ? "Sending..." : "Resend verification email"}
            </Button>
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-2">
          <p className="text-sm text-muted-foreground">Don't have an account?</p>
          <Link
            className="text-sm font-medium text-primary hover:underline hover:underline-offset-2"
            href="/register"
          >
            Register
          </Link>
        </div>
      </form>
    </Form>
  )
}

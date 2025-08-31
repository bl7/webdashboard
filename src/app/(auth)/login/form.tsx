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
import { loginUser } from "@/lib/api"

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, "Password is required"),
})

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

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
        const response = await loginUser(values)

        if (response?.token || response?.success) {
          localStorage.setItem("token", response.token)
          localStorage.setItem("userid", response.uuid)
          localStorage.setItem("email", response.email)
          localStorage.setItem("full_name", response.name)
          console.log("full_name", localStorage.getItem("full_name"))
          console.log("userid", localStorage.getItem("userid"))
          toast.success("Login successful")
          localStorage.setItem("name", response.name)
          console.log("receicved data", response)

          // Check user status and redirect appropriately
          try {
            const [profileRes, subRes] = await Promise.all([
              fetch(`/api/profile?user_id=${response.uuid}`),
              fetch(`/api/subscription_better/status`, {
                headers: {
                  Authorization: `Bearer ${response.token}`,
                  "Content-Type": "application/json",
                },
              }),
            ])

            if (profileRes.ok && subRes.ok) {
              const { profile } = await profileRes.json()
              const { subscription } = await subRes.json()

              // If user has both profile and active subscription, go to dashboard
              if (profile?.company_name && profile?.email && subscription?.status === "active") {
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

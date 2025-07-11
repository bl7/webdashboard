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
import { PasswordInput } from "@/components/ui/password-input"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { resetPassword } from "@/lib/api"

const forgotPassFormSchema = z
  .object({
    password: z
      .string()
      .refine((val) => val.length >= 8, "Input must be at least 8 characters long"),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  })

export function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof forgotPassFormSchema>>({
    resolver: zodResolver(forgotPassFormSchema),
    defaultValues: {
      password: "",
      confirm: "",
    },
  })

  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")

  useEffect(() => {
    setEmail(localStorage.getItem("resetEmail") || "")
  }, [])

  async function onSubmit(values: z.infer<typeof forgotPassFormSchema>) {
    setError(null)
    setLoading(true)
    try {
      await resetPassword(email, values.password, values.confirm)
      localStorage.removeItem("resetEmail")
      router.push("/login")
    } catch (err: any) {
      setError(err.message || "Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form className="w-full max-w-lg space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput id="password" placeholder="Password" className="w-full" {...field} />
              </FormControl>
              <FormDescription className={cn(form.formState.errors.password && "hidden")}>
                Password must be at least 8 characters long, contain one uppercase and one special
                character.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput
                  id="confirm"
                  placeholder="Confirm Password"
                  className="w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <Button className="mt-4 w-full" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
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

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
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { registerUser } from "@/lib/api"

const registerFormSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(50, "Full name must be less than 50 characters")
      .regex(
        /^[a-zA-Z\s-']+$/,
        "Full name can only contain letters, spaces, hyphens, and apostrophes"
      ),
    email: z.string().email({ message: "Please enter a valid email address" }).toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    try {
      setIsLoading(true)

      const signupData = {
        name: values.fullName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        c_password: values.confirmPassword,
      }

      console.log("Sending signupData:", signupData)

      const response = await registerUser(signupData)
      console.log("data sent", signupData)
      console.log("API response:", response)
      toast.success(response.message)
      router.push("/login")
    } catch (error) {
      console.error("Registration error:", error)
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        toast.error("Unable to connect to the server. Please check if the server is running.")
      } else {
        toast.error(error instanceof Error ? error.message : "Failed to register")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form className="w-full max-w-lg space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input id="fullName" placeholder="John Doe" className="w-full" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input id="email" placeholder="email@example.com" className="w-full" {...field} />
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
                <PasswordInput id="password" placeholder="Password" className="w-full" {...field} />
              </FormControl>
              <FormDescription className={cn(form.formState.errors.password && "hidden")}>
                Must be at least 8 characters, include uppercase, lowercase, number, and special
                character.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="Confirm password"
                  className="w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <p className="text-sm text-muted-foreground">
          By creating an account, you agree to our{" "}
          <Link className="text-primary hover:underline" href="/terms">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link className="text-primary hover:underline" href="/privacy">
            Privacy Policy
          </Link>
          .
        </p>

        <Button className="mt-4 w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>

        <div className="mt-6 flex items-center justify-end gap-2">
          <p className="text-sm text-muted-foreground">Already have an account?</p>
          <Link className="text-sm font-medium text-primary hover:underline" href="/login">
            Sign In
          </Link>
        </div>
      </form>
    </Form>
  )
}

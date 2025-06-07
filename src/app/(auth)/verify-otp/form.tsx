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
import { InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { zodResolver } from "@hookform/resolvers/zod"
import { OTPInput, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"

const otpFormSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})
export function VerifyOtpForm() {
  const form = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  })

  const router = useRouter()
  function onSubmit(values: z.infer<typeof otpFormSchema>) {
    console.log(values)
    router.push("/reset-password")
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
                <OTPInput maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} {...field}>
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
                </OTPInput>
              </FormControl>
              <FormDescription>Enter the 6 digit code sent to your email</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-4 w-full">Verify OTP</Button>
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

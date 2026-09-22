"use client"

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Textarea,
} from "@/components/ui"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { template } from "@/components/templates/template"
import { FaSpinner } from "react-icons/fa6"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CONTACT } from "@/lib/marketing/site"

const formSchema = z.object({
  name: z.string().min(1, { message: "Enter your name." }),
  email: z.string().email({ message: "Enter a valid email address." }),
  business: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().min(1, { message: "Tell us how we can help." }),
})
type FormValues = z.infer<typeof formSchema>

const fieldClass =
  "h-12 rounded-lg border border-mkt-steel1 bg-white text-base shadow-none focus-visible:ring-2 focus-visible:ring-[#142124]/50"

export const ContactForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      business: "",
      phone: "",
      message: "",
    },
    mode: "onChange",
  })

  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  async function onSubmit(data: FormValues) {
    setLoading(true)
    setStatus("idle")
    const message = data.business?.trim()
      ? `Business: ${data.business.trim()}\n\n${data.message}`
      : data.message

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: data.email,
          subject: `Enquiry from ${data.name}`,
          body: template({
            name: data.name,
            email: data.email,
            phone: data.phone,
            category: "Website enquiry",
            message,
          }),
          bcc: "instalabel.co@gmail.com",
        }),
      })

      if (response.ok) {
        setStatus("success")
        form.reset()
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-mkt-steel1 bg-white p-6 sm:p-8">
      {status === "success" ? (
        <p className="text-sm leading-relaxed text-mkt-ink8" role="status">
          Thanks. Your enquiry has been sent to the InstaLabel team.
        </p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <label className="mb-2 block text-sm font-medium text-mkt-ink" htmlFor="name">
                    Your name
                  </label>
                  <FormControl>
                    <Input id="name" className={fieldClass} autoComplete="name" {...field} />
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
                  <label className="mb-2 block text-sm font-medium text-mkt-ink" htmlFor="email">
                    Email address
                  </label>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      className={fieldClass}
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="business"
              render={({ field }) => (
                <FormItem>
                  <label className="mb-2 block text-sm font-medium text-mkt-ink" htmlFor="business">
                    Business name (optional)
                  </label>
                  <FormControl>
                    <Input
                      id="business"
                      className={fieldClass}
                      autoComplete="organization"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <label className="mb-2 block text-sm font-medium text-mkt-ink" htmlFor="phone">
                    Phone number (optional)
                  </label>
                  <FormControl>
                    <Input id="phone" type="tel" className={fieldClass} autoComplete="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <label className="mb-2 block text-sm font-medium text-mkt-ink" htmlFor="message">
                    How can we help?
                  </label>
                  <FormControl>
                    <Textarea
                      id="message"
                      className="min-h-36 resize-none rounded-lg border border-mkt-steel1 bg-white text-base shadow-none focus-visible:ring-2 focus-visible:ring-[#142124]/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {status === "error" && (
              <p className="text-sm text-red-700" role="alert">
                We couldn&apos;t send your enquiry. Please try again or email {CONTACT.email}.
              </p>
            )}
            <Button
              disabled={loading}
              type="submit"
              className="h-12 gap-3 rounded-lg font-medium text-white"
              style={{ backgroundColor: "#142124", backgroundImage: "none" }}
            >
              {loading && <FaSpinner className="animate-spin" />}
              Send enquiry
            </Button>
            <p className="text-xs text-mkt-steel">
              We&apos;ll use these details to respond to your enquiry. Read our{" "}
              <Link href="/privacy-policy" className="text-mkt-teal hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        </Form>
      )}
      <p className="mt-6 text-sm text-mkt-ink8">
        Prefer a walkthrough?{" "}
        <Link href="/bookdemo" className="inline-flex items-center font-semibold text-mkt-teal hover:underline">
          Book a demo
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </p>
    </div>
  )
}

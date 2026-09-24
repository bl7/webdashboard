"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { FaSpinner } from "react-icons/fa6"
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
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { CONTACT } from "@/lib/marketing/site"

const formSchema = z.object({
  name: z.string().min(1, { message: "Enter your name." }),
  email: z.string().email({ message: "Enter a valid work email address." }),
  business: z.string().min(1, { message: "Enter your business name." }),
  phone: z.string().optional(),
  printer: z.string().optional(),
  message: z.string().optional(),
})
type FormValues = z.infer<typeof formSchema>

const fieldClass =
  "h-12 rounded-lg border border-mkt-steel1 bg-white text-base shadow-none focus-visible:ring-2 focus-visible:ring-[#142124]/50"

export const BookDemoHero = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      business: "",
      phone: "",
      printer: "",
      message: "",
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  async function onSubmit(data: FormValues) {
    setLoading(true)
    setStatus("idle")
    try {
      const response = await fetch("/api/bookdemo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          company: data.business,
          role: data.printer || "",
          message: data.message || "",
          source: "web",
        }),
      })
      if (!response.ok) throw new Error("Failed")
      setStatus("success")
      form.reset()
    } catch {
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="demo-form"
      className="relative flex min-h-screen items-center overflow-hidden bg-mkt-canvas px-4 pb-16 pt-32 sm:px-6 md:px-12 lg:px-16"
      style={{ scrollMarginTop: "7rem" }}
    >
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-mkt-steel1 opacity-60 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-mkt-ink opacity-10 blur-3xl" />

      <div className="container relative z-10 mx-auto flex flex-col items-center justify-between gap-12 md:flex-row md:items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-xl space-y-6 text-center md:text-left"
        >
          <div className="inline-flex items-center rounded-full bg-mkt-canvas px-4 py-2 text-sm font-medium text-mkt-ink ring-1 ring-mkt-steel1">
            Book a demo
          </div>
          <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-mkt-ink sm:text-5xl lg:text-6xl">
            See InstaLabel with your kitchen in mind.
          </h1>
          <p className="max-w-xl text-base text-mkt-ink8 sm:text-lg">
            A short walkthrough of item setup, a label preview and the printer you already use.
            Have a menu or a CSV ready if you want to talk through your own items.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="w-full max-w-lg"
        >
          <div className="rounded-2xl border border-mkt-steel1 bg-white p-6 sm:p-8">
            <h2 className="mb-6 text-xl font-black tracking-tight text-mkt-ink">
              Request your demo.
            </h2>
            {status === "success" ? (
              <p className="text-sm leading-relaxed text-mkt-ink8" role="status">
                Your demo request has been sent. We&apos;ll contact you using the details you
                provided to arrange a time.
              </p>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
                          Work email
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
                        <label
                          className="mb-2 block text-sm font-medium text-mkt-ink"
                          htmlFor="business"
                        >
                          Business name
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
                          <Input
                            id="phone"
                            type="tel"
                            className={fieldClass}
                            autoComplete="tel"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="printer"
                    render={({ field }) => (
                      <FormItem>
                        <label
                          className="mb-2 block text-sm font-medium text-mkt-ink"
                          htmlFor="printer"
                        >
                          Printer model and device (optional)
                        </label>
                        <FormControl>
                          <Input id="printer" className={fieldClass} {...field} />
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
                        <label
                          className="mb-2 block text-sm font-medium text-mkt-ink"
                          htmlFor="message"
                        >
                          What would you like to see? (optional)
                        </label>
                        <FormControl>
                          <Textarea
                            id="message"
                            placeholder="For example: prep labels, PPDS labels, the allergen matrix, importing our items or using our existing printer."
                            className="min-h-28 resize-none rounded-lg border border-mkt-steel1 bg-white text-base shadow-none focus-visible:ring-2 focus-visible:ring-[#142124]/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {status === "error" ? (
                    <p className="text-sm text-red-700" role="alert">
                      We couldn&apos;t send your request. Please try again or email{" "}
                      {CONTACT.email}.
                    </p>
                  ) : null}
                  <Button
                    disabled={loading}
                    type="submit"
                    className="h-12 gap-3 rounded-lg font-medium text-white"
                    style={{ backgroundColor: "#142124", backgroundImage: "none" }}
                  >
                    {loading ? <FaSpinner className="animate-spin" /> : null}
                    Request a demo
                  </Button>
                  <p className="text-xs text-mkt-steel">
                    We&apos;ll use these details to arrange and discuss your demo. Read our{" "}
                    <Link href="/privacy-policy" className="text-mkt-teal hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </form>
              </Form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

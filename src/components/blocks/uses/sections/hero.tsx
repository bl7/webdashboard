"use client"

import React from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui"
import Link from "next/link"
import { motion } from "framer-motion"
import LabelRender from "@/app/dashboard/print/LabelRender"

export const UsesHero = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-mkt-canvas px-4 pb-16 pt-32 sm:px-6 md:px-12 lg:px-16">
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-mkt-steel1 opacity-60 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-mkt-ink opacity-10 blur-3xl" />
      <div className="absolute left-[40%] top-[30%] isolate -z-10 h-96 w-96 scale-150 rounded-full bg-mkt-canvas opacity-80 blur-3xl" />

      <div className="container relative z-10 mx-auto flex flex-col-reverse items-center justify-between gap-16 md:flex-row">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl space-y-6 text-center md:text-left"
        >
          <div className="inline-flex items-center rounded-full bg-mkt-canvas px-4 py-2 text-sm font-medium text-mkt-ink ring-1 ring-mkt-steel1">
            Kitchen workflows
          </div>

          <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-mkt-ink sm:text-5xl lg:text-6xl">
            A clear label for each stage of kitchen work.
          </h1>

          <p className="max-w-xl text-base text-mkt-ink8 sm:text-lg md:text-xl">
            From storing ingredients to packing food for sale, use InstaLabel to keep the right
            information with the right item. Choose the workflow that matches the task your team is
            doing.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
            <Button size="lg" className="bg-mkt-ink px-8 py-3 text-white hover:bg-mkt-ink" asChild>
              <a href="#workflows">
                Explore the workflows
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/bookdemo">Book a demo</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex w-full max-w-[500px] flex-col items-center md:items-end"
        >
          <div>
            <LabelRender
              item={{
                uid: "uses-hero-prep",
                id: "uses-hero-prep",
                type: "menu",
                name: "Mixed Vegetables",
                quantity: 1,
                ingredients: ["Carrots", "Broccoli", "Celery", "Peppers"],
                allergens: [
                  {
                    uuid: 3,
                    allergenName: "Celery",
                    category: "Vegetable",
                    status: "Active",
                    addedAt: "",
                    isCustom: false,
                  },
                ],
                printedOn: "2024-07-01T09:00:00Z",
                expiryDate: "2024-07-01T18:00:00Z",
                labelType: "prep",
              }}
              expiry="2024-07-01T18:00:00Z"
              useInitials={true}
              selectedInitial="BL"
              allergens={["Celery"]}
              labelHeight="40mm"
              allIngredients={[
                { uuid: "6", ingredientName: "Carrots", allergens: [] },
                { uuid: "7", ingredientName: "Broccoli", allergens: [] },
                { uuid: "8", ingredientName: "Celery", allergens: [{ allergenName: "Celery" }] },
                { uuid: "9", ingredientName: "Peppers", allergens: [] },
              ]}
            />
          </div>
          <p className="mt-3 text-center text-xs text-mkt-steel md:text-right">
            Example prep label from the InstaLabel renderer.
          </p>
        </motion.div>
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-24 w-full"
        style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 100%)",
        }}
      />
    </section>
  )
}

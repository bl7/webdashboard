"use client"

import React from "react"
import { Button } from "@/components/ui"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export const FinalCTA = () => (
  <section className="relative bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
    <div className="container mx-auto max-w-3xl text-center">
      <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
        See your next kitchen label in InstaLabel.
      </h2>
      <p className="mb-8 text-base leading-relaxed text-mkt-ink8">
        Try the workflow with your own items, or ask us to walk through your setup.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/register">
          <Button
            size="lg"
            className="border-0 font-semibold text-white"
            style={{ backgroundColor: "#142124", backgroundImage: "none" }}
          >
            Start free trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        <Link href="/bookdemo">
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-mkt-steel1 font-semibold text-mkt-ink hover:border-mkt-ink hover:bg-mkt-ink hover:text-white"
          >
            Book a demo
          </Button>
        </Link>
      </div>
    </div>
  </section>
)

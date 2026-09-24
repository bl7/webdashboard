"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import labelPrinterInKitchen from "@/assets/images/labelPrunterInKitchen.png"
import { ANDROID_PRINTERS } from "@/lib/marketing/site"
import { emitHomeEvent } from "../home-labels"

export const PrintingSetupSelector = () => {
  const [setup, setSetup] = useState<"desktop" | "android">("desktop")

  return (
    <section className="home-sage home-section">
      <div className="home-wrap grid items-start gap-10 lg:grid-cols-2">
        <div>
          <div className="home-eyebrow">Printing</div>
          <h2 className="home-h2 mt-4">Print from the setup you already use.</h2>
          <p className="home-lead mt-4">
            Use a computer with PrintBridge, or the Android app with a supported Bluetooth printer.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              className="home-chip"
              aria-pressed={setup === "desktop"}
              onClick={() => {
                setSetup("desktop")
                emitHomeEvent("printing_setup_select", { type: "desktop" })
              }}
            >
              From a computer
            </button>
            <button
              type="button"
              className="home-chip"
              aria-pressed={setup === "android"}
              onClick={() => {
                setSetup("android")
                emitHomeEvent("printing_setup_select", { type: "android" })
              }}
            >
              From Android
            </button>
          </div>
          <p className="sr-only" aria-live="polite">
            Showing {setup === "desktop" ? "computer" : "Android"} printing setup.
          </p>

          {setup === "desktop" ? (
            <div className="mt-8">
              <h3 className="text-2xl font-extrabold">A familiar place to print.</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--home-muted)]">
                Use InstaLabel in your browser. PrintBridge connects it to a label printer installed
                on your Windows or macOS computer.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>Windows or macOS.</li>
                <li>Your installed label printer, with the right driver and stock.</li>
                <li>PrintBridge to connect the printing workflow.</li>
              </ul>
              <Link href="/printbridge" className="home-link mt-4 inline-flex items-center gap-2">
                Explore desktop printing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="mt-8">
              <h3 className="text-2xl font-extrabold">Put printing in your hand.</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--home-muted)]">
                Choose your item in the InstaLabel Android app, check the preview and print with a
                supported Bluetooth label printer.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>InstaLabel Android app.</li>
                <li>{ANDROID_PRINTERS.join(" or ")}.</li>
                <li>Suitable label stock and a checked first print.</li>
              </ul>
              <Link href="/mobile-app" className="home-link mt-4 inline-flex items-center gap-2">
                Explore the Android app
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          <p className="mt-6">
            <Link href="/kitchen-label-printer" className="home-link inline-flex items-center gap-2">
              Check printer compatibility
              <ArrowRight className="h-4 w-4" />
            </Link>
          </p>
        </div>

        <figure>
          <Image
            src={labelPrinterInKitchen}
            alt="Promotional artwork of kitchen labelling equipment"
            className="h-auto w-full rounded-2xl"
          />
          <figcaption className="mt-3 text-xs text-[var(--home-muted)]">
            Illustrative promotional artwork. It does not confirm that every depicted device is a
            supported printer.
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

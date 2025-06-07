import React from "react"

import Link from "next/link"
import Image from "next/image"
import { RegisterForm } from "./form"

export default function RegisterPage() {
  function getTimeOfDayGreeting() {
    const currentHour = new Date().getHours()

    if (currentHour >= 5 && currentHour < 12) {
      return "Good morning"
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Good afternoon"
    } else if (currentHour >= 18 && currentHour < 22) {
      return "Good evening"
    } else {
      return "Good night"
    }
  }

  return (
    <section className="flex h-full w-full flex-col justify-between py-12">
      <div className="flex items-center justify-between">
        <div className="flex flex-shrink-0 items-center justify-center">
          <Image src="/logo_sm.png" width={64} height={64} alt="logo" className="object-contain" />
        </div>
        <div>
          <h2 className="text-3xl font-semibold text-primary">instalabel</h2>
        </div>
      </div>
      <div>
        <div className="mt-6">
          <p className="text-3xl font-medium text-muted-foreground">
            {getTimeOfDayGreeting()}, Welcome
          </p>
          <p className="text-lg text-muted-foreground">Please create your account to continue</p>
        </div>
        <div className="mt-6 w-full">
          <RegisterForm />
        </div>
      </div>
      <div className="mt-6 text-sm text-muted-foreground">
        Copyright © 2023 - current. <Link href="/">Vitacre Pvt. Ltd.</Link> All rights reserved.
      </div>
    </section>
  )
}

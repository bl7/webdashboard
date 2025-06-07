import React from "react"
import { LoginForm } from "./form"
import Link from "next/link"
import Image from "next/image"

function getTimeOfDayGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export default function LoginPage() {
  return (
    <section className="flex h-full min-h-fit w-full flex-col justify-between py-12">
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
            {getTimeOfDayGreeting()}, Welcome Back
          </p>
          <p className="text-lg text-muted-foreground">Please login to your account to continue</p>
        </div>
        <div className="mt-6 w-full">
          <LoginForm />
        </div>
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        Copyright © 2023 - current. <Link href="/">InstaLabel Pvt. Ltd.</Link> All rights reserved.
      </div>
    </section>
  )
}

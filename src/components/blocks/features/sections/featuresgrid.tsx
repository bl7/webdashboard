import { CheckCircle } from "lucide-react"
import Image from "next/image"

export const FeaturesGrid = () => {
  const features = [
    "Plug & play label printing",
    "No app installs required",
    "Supports Epson & Sunmi devices",
    "Web dashboard for control & analytics",
    "20 free prints per week on Free Plan",
  ]

  return (
    <section className="bg-white py-24">
      <div className="container grid items-center gap-12 md:grid-cols-2">
        {/* Text Content */}
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-primary">
            Everything you need, nothing you don’t
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            InstaLabel is built for speed and simplicity. Print directly from the web, monitor
            usage, and choose the right hardware for your business.
          </p>

          <ul className="mt-8 space-y-4 text-muted-foreground">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 text-green-600" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Image / Illustration */}
        <div className="relative aspect-video w-full rounded-xl bg-muted shadow-sm">
          <Image
            src="/dashboard.png"
            alt="Feature overview"
            fill
            className="rounded-xl object-cover"
          />
        </div>
      </div>
    </section>
  )
}

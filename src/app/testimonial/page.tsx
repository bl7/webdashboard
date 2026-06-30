import { Metadata } from "next"
import Image from "next/image"
import { TestimonialForm } from "./testimonial-form"

export const metadata: Metadata = {
  title: "Share Your Experience | InstaLabel",
  description: "Tell us about your experience with InstaLabel.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
}

const Page = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-12">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-xl sm:p-10">
        <div className="mb-8 text-center">
          <Image
            src="/logo_long.png"
            alt="InstaLabel"
            width={160}
            height={40}
            className="mx-auto mb-6 h-auto w-40"
            priority
          />
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Share your experience
          </h1>
          <p className="mt-2 text-gray-600">
            We&apos;d love to hear how InstaLabel is working for you. Your feedback helps other
            kitchens discover us.
          </p>
        </div>
        <TestimonialForm />
      </div>
    </main>
  )
}

export default Page

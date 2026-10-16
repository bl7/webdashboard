import React from "react"
import { Contact } from "."

export const About = () => {
  return (
    <>
      <section className="bg-white px-6 pb-20 pt-32 sm:px-8">
        <div className="mx-auto max-w-[920px]">
          <p className="text-sm text-neutral-500">About InstaLabel</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
            Built to make everyday kitchen labelling simpler.
          </h1>
          <div className="mt-16 grid items-center gap-10 md:mt-24 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-16">
            <img
              src="/marketing/about-founders.png?v=3"
              alt="Three friends working at a laptop"
              width={1024}
              height={512}
              className="h-auto w-full"
            />
            <div className="max-w-sm space-y-4 text-[15px] leading-relaxed text-neutral-900">
              <p>
                In a busy kitchen, there&apos;s always something to prepare, something to store, and
                something to label.
              </p>
              <p>
                Food labels might seem like a small part of the job, but they&apos;re part of the
                routine every day.
              </p>
              <p>
                We know that routine firsthand. Before InstaLabel existed, we were three friends
                studying IT in the UK and working part-time in kitchens.
              </p>
            </div>
          </div>
          <div className="mt-20 grid items-center gap-10 md:mt-28 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-16">
            <img
              src="/marketing/about-kitchen.png"
              alt="Labelled kitchen containers, a marker and a roll of labels"
              width={1024}
              height={512}
              className="h-auto w-full"
            />
            <div className="max-w-sm space-y-4 text-[15px] leading-relaxed text-neutral-900">
              <p>We saw how much attention went into getting labels right.</p>
              <p>
                Names had to be handwritten, dates needed to be tracked, and allergen information
                had to be clear and consistent. Each label was a small task, but it was one more
                thing to manage alongside everything else happening in the kitchen.
              </p>
              <p>We began to wonder whether there was a better way to handle it.</p>
            </div>
          </div>
          <div className="mt-20 grid items-center gap-10 md:mt-28 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-16">
            <img
              src="/marketing/about-making.png?v=2"
              alt="A person at a laptop surrounded by sketches, screens and a light bulb"
              width={1024}
              height={512}
              className="h-auto w-full"
            />
            <div className="max-w-sm space-y-4 text-[15px] leading-relaxed text-neutral-900">
              <p>
                We&apos;ve always enjoyed figuring things out and exploring what technology could do.
              </p>
              <p>
                One after-work gaming session, the conversation turned to the labelling problems
                we&apos;d seen in kitchens. We started wondering whether we could build something to
                help.
              </p>
              <p>
                It wasn&apos;t a formal business plan. It was an idea between friends, and we decided
                to see where it could go.
              </p>
            </div>
          </div>
          <div className="mt-20 grid items-center gap-10 md:mt-28 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-16">
            <img
              src="/marketing/about-idea.png"
              alt="From a notebook idea through screen layouts to a printed label"
              width={1024}
              height={512}
              className="h-auto w-full"
            />
            <div className="max-w-sm space-y-4 text-[15px] leading-relaxed text-neutral-900">
              <p>
                When we finally got our first label to print, it was blurry, magnified, and
                completely misaligned.
              </p>
              <p>
                It looked nothing like what we had in mind. But something had printed, and we were
                happy.
              </p>
              <p>
                That first attempt was only the beginning. It took several versions, plenty of
                tweaking, and a lot of learning to get from that wonky print to the InstaLabel we
                have today.
              </p>
            </div>
          </div>
          <div className="mt-20 grid items-center gap-10 md:mt-28 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-16">
            <img
              src="/marketing/about-built.png"
              alt="A chef applying a printed chicken curry label to a kitchen container"
              width={1024}
              height={512}
              className="h-auto w-full"
            />
            <div className="max-w-sm space-y-4 text-[15px] leading-relaxed text-neutral-900">
              <p>InstaLabel turns kitchen labelling into a digital workflow.</p>
              <p>
                Kitchen teams can create and print labels with the information they need, including
                dates and allergen details, without having to handwrite each one.
              </p>
              <p>It&apos;s the solution we set out to build for a task we knew from experience.</p>
            </div>
          </div>
          <div className="mt-20 grid items-center gap-10 md:mt-28 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-16">
            <img
              src="/marketing/about-labels.png"
              alt="A roll of printed kitchen labels beside loose printed labels"
              width={1024}
              height={512}
              className="h-auto w-full"
            />
            <div className="max-w-sm space-y-4 text-[15px] leading-relaxed text-neutral-900">
              <p>
                Today, InstaLabel is something we&apos;re continuing to build, improve, and share
                with kitchens.
              </p>
              <p>
                What began as a conversation between friends has grown into a product that people
                can use in their day-to-day work.
              </p>
              <p>If you work in a kitchen, we&apos;d love for you to see InstaLabel in action.</p>
            </div>
          </div>
        </div>
      </section>
      <Contact />
    </>
  )
}

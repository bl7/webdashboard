import React from "react"
import { Contact } from "."

export const About = () => {
  return (
    <>
      <section className="bg-white px-6 pb-20 pt-32 sm:px-8">
        <div className="mx-auto max-w-[920px]">
          <p className="text-sm text-neutral-500">About InstaLabel</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
            It started with a problem we knew firsthand.
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
                We were three friends who came to the UK to study IT. Alongside our studies, we
                worked part-time in kitchens, where we began noticing everyday tasks that could be
                simpler.
              </p>
              <p>
                We&apos;d always enjoyed building things and finding practical uses for technology.
                Eventually, one of those everyday problems became an idea we wanted to bring to life.
              </p>
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
              <p>We&apos;ve always been curious about how things work and how they could work better.</p>
              <p>
                We enjoyed experimenting with technology, exploring ideas, and figuring things out
                for ourselves. We weren&apos;t starting with a business plan. We simply liked the
                process of making something and seeing where an idea could lead.
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
              <p>Working in kitchens gave us a different perspective on everyday problems.</p>
              <p>
                Food labels were one of those things that seemed simple, but still took time and
                attention. Labels had to be handwritten, dates needed to be kept track of, and
                allergen information had to be clear and consistent.
              </p>
              <p>
                Having an interest in technology, we started to see an opportunity to make this part
                of kitchen life a little simpler. Not by changing how kitchens work, but by making
                one of their everyday tasks easier.
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
                The idea for InstaLabel came up during an after-work gaming session. We started
                talking about the labelling problems we&apos;d seen in kitchens and wondering whether
                we could build something to help.
              </p>
              <p>
                When we finally got our first label to print, it was blurry, magnified, and
                completely misaligned. It looked nothing like what we had in mind. But something had
                printed. And at that point, that was enough to make us happy.
              </p>
              <p>
                Of course, getting a label to print was only the beginning. It took several versions,
                plenty of tweaking, and a lot of learning to get from that first attempt to the
                product we have today.
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
              <p>
                InstaLabel helps kitchen teams create and print food labels with the information they
                need, from expiry dates to allergen details.
              </p>
              <p>
                Instead of handwriting every label, teams can prepare consistent labels through a
                simple digital workflow and print them when they&apos;re needed.
              </p>
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
                What began as a conversation between friends has become a product we can share with
                kitchens.
              </p>
              <p>
                We&apos;re proud to have taken an idea from that first conversation through all its
                different versions to something real. And we&apos;re looking forward to seeing where
                we take it next.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Contact />
    </>
  )
}

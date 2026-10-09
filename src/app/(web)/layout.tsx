import { ChristmasOfferNotice } from "@/components/marketing/ChristmasOfferNotice"
import { PageRelated } from "@/components/marketing/PageRelated"
import { Footer, Header } from "@/components/navigation"
import "./marketing.css"
import "./marketing-dark.css"

export default function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="marketing min-h-screen overflow-x-clip scroll-smooth">
      <Header />
      <ChristmasOfferNotice />
      {children}
      <PageRelated />
      <Footer />
    </main>
  )
}

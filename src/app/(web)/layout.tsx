import { Footer, Header } from "@/components/navigation"
import "./marketing.css"
import "./marketing-dark.css"

export default function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="marketing min-h-screen overflow-x-hidden scroll-smooth">
      <Header />
      {children}
      <Footer />
    </main>
  )
}

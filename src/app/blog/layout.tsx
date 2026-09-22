import { Footer, Header } from "@/components/navigation"
import "../(web)/marketing.css"
import "../(web)/marketing-dark.css"

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="marketing min-h-screen overflow-x-hidden scroll-smooth">
      <Header />
      {children}
      <Footer />
    </main>
  )
}

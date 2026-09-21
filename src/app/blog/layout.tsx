import { Footer, Header } from "@/components/navigation"
import "../(web)/marketing.css"

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="marketing min-h-screen overflow-x-hidden scroll-smooth">
      <Header />
      <div className="pt-8 md:pt-12 lg:pt-16">
        {children}
      </div>
      <Footer />
    </main>
  )
} 
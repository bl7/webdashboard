import { Footer, Header } from "@/components/navigation"
import { Chatbot } from "@/components/Chatbot"

export default function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="min-h-screen overflow-x-hidden scroll-smooth">
      <Header />
      {children}
      <Footer />
      <Chatbot />
    </main>
  )
}

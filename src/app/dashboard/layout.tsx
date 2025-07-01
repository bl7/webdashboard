import Sidebar from "@/components/dashboard/sidebar"
import { PrinterProvider } from "@/context/PrinterContext"
import PrinterStatusBar from "@/components/PrinterStatusBar"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata = {
  title: "Instalabel ",
  description: "Instalabel Dashboard",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex bg-gradient-to-br from-slate-50 to-blue-50">
      <PrinterProvider>
        <Sidebar />
        <PrinterStatusBar />
        <div className="container flex-1 pt-12">
          <div className="space-y-6 p-6">{children}</div>
        </div>
      </PrinterProvider>
      <SpeedInsights />
    </main>
  )
}

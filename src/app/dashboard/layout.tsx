import Sidebar from "@/components/dashboard/sidebar"
import { PrinterProvider } from "@/context/PrinterContext"
import { PrintBridgeProvider } from "@/context/PrintBridgeContext"
import PrinterStatusBar from "@/components/PrinterStatusBar"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata = {
  title: "Instalabel ",
  description: "Instalabel Dashboard",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen min-w-0 overflow-x-hidden bg-gradient-to-br from-slate-50 to-blue-50">
      <PrintBridgeProvider>
        <PrinterProvider>
          <Sidebar />
          <PrinterStatusBar />
          <div className="container min-w-0 flex-1 overflow-x-hidden pt-12">
            <div className="space-y-6 p-4 sm:p-6">{children}</div>
          </div>
        </PrinterProvider>
      </PrintBridgeProvider>
      <SpeedInsights />
    </main>
  )
}

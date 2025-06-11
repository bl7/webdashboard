import React from "react"
import { Invoice } from "../hooks/useBillingData"
import { DownloadIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

interface Props {
  invoices: Invoice[]
}

export default function PaymentHistory({ invoices }: Props) {

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Billing history</h2>
        <button className="text-sm text-primary hover:underline">Download</button>
      </div>

      {/* Table Head */}
      <div className="hidden md:grid grid-cols-12 px-4 py-2 text-sm text-muted-foreground font-medium">
        <div className="col-span-1">
          <Checkbox disabled />
        </div>
        <div className="col-span-3">Plan</div>
        <div className="col-span-2">Amount</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-3">Users on plan</div>
        <div className="col-span-1 text-right"></div>
      </div>
{invoices.length === 0 ? (
  <div className="text-sm text-muted-foreground">No invoices found.</div>
) : (
      <div className="space-y-2">
        {invoices.map((entry) => (
          <div
            key={entry.id}
            className="grid grid-cols-12 items-center bg-white rounded-xl px-4 py-3 shadow-sm hover:shadow transition"
          >
            {/* Checkbox */}
            <div className="col-span-1">
              <Checkbox />
            </div>

            {/* Plan */}
            <div className="col-span-3 text-sm font-medium">
              {entry.metadata?.plan || "Basic Plan"}
            </div>

            {/* Amount */}
            <div className="col-span-2 text-sm">${entry.amount.toFixed(2)}</div>

            {/* Date */}
            <div className="col-span-2 text-sm">
              {new Date(entry.invoice_date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>

            {/* Avatars */}
            <div className="col-span-3 flex -space-x-2">
              {(entry.metadata?.avatars || []).map((url: string, i: number) => (
                <Avatar key={i} className="w-7 h-7 border-2 border-white">
                  <AvatarImage src={url} />
                </Avatar>
              ))}
            </div>

            {/* Download Icon */}
            <div className="col-span-1 text-right">
              <button className="text-muted-foreground hover:text-primary">
                <DownloadIcon size={16} />
              </button>
            </div>
          </div>
          
        ))}
      </div>

)}
    </div>
    
  )
}

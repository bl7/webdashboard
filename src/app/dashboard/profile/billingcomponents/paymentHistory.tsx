import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Invoice } from "../hooks/useBillingData"

interface Props {
  invoices: Invoice[]
}

export default function PaymentHistory({ invoices }: Props) {
  if (invoices.length === 0) {
    return <div>No invoices found.</div>
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Payment history</h2>
      <div className="space-y-4">
        {invoices.map((entry) => (
          <Card key={entry.id}>
            <CardContent className="space-y-2 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">${entry.amount.toFixed(2)}</div>
                <Badge variant={entry.status === "Completed" ? "default" : "secondary"}>
                  {entry.status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {entry.recipient_name} · {new Date(entry.invoice_date).toLocaleDateString()} · Card
                ending {entry.payment_method_last4}
              </div>
              {entry.metadata && entry.metadata.plan && (
                <div className="mt-2 rounded border p-2 text-sm">
                  <div className="mb-1 font-medium">{entry.metadata.plan}</div>
                  {entry.metadata.items && (
                    <ul className="list-inside list-disc">
                      {entry.metadata.items.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-2 text-xs text-muted-foreground">
                    Invoice #{entry.id} · {new Date(entry.invoice_date).toLocaleDateString()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

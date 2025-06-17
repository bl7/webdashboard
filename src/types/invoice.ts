export interface InvoiceLine {
  id: string
  amount: number
  description?: string
}

export interface Invoice {
  id: string
  total: number
  status: string
  created: number
  invoice_pdf?: string
  description?: string
  lines?: {
    data: InvoiceLine[]
  }
  metadata?: Record<string, any>
}

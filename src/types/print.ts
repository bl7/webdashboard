// types/print.ts
export type PrintQueueItem = {
  uid: string
  id: string | number
  type: "ingredients" | "menu"
  name: string
  quantity: number
  allergens?: string[]
  ingredients?: string[]
  printedOn?: string
  expiryDate?: string
  labelType?: "cook" | "prep" | "ppds"
}

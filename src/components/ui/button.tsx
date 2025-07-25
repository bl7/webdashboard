import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Accent orange color
const accent = "#FF7A00"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:from-purple-700 hover:to-pink-700",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-2 border-purple-600 text-purple-600 bg-white hover:bg-purple-600 hover:text-white dark:bg-gray-900 dark:text-purple-300 dark:border-purple-400 dark:hover:bg-purple-600 dark:hover:text-white",
        ghost:
          "text-purple-600 bg-transparent hover:bg-purple-50 hover:text-purple-700 dark:text-purple-200 dark:hover:bg-purple-800 dark:hover:text-white",
        accent: "bg-orange-500 text-white hover:bg-orange-600",
        accentGhost: "text-orange-500 bg-transparent hover:bg-orange-500 hover:text-white",
        link: "text-primary underline-offset-4 hover:underline",
        purple: "bg-purple-600 text-white hover:bg-purple-700 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

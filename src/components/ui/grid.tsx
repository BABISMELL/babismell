import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface GridProps {
  children: ReactNode
  className?: string
  cols?: number
}

export function Grid({ children, className, cols = 4 }: GridProps) {
  return (
    <div
      className={cn(
        "grid gap-6",
        {
          "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4": cols === 4,
          "sm:grid-cols-2 lg:grid-cols-3": cols === 3,
          "sm:grid-cols-2": cols === 2,
        },
        className
      )}
    >
      {children}
    </div>
  )
}
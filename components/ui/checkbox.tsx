import * as React from "react"
import { cn } from "@/utils/cn"

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (props.onChange) {
        props.onChange(e)
      }
      if (onCheckedChange) {
        onCheckedChange(e.target.checked)
      }
    }

    return (
      <input
        type="checkbox"
        className={cn(
          "h-4 w-4 rounded border border-input bg-background text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
        onChange={handleChange}
      />
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
'use client'

import { useState, useEffect } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const toastVariants = cva(
  'fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg transition-all duration-300 ease-in-out',
  {
    variants: {
      variant: {
        default: 'bg-background border',
        destructive: 'bg-destructive text-destructive-foreground',
        success: 'bg-green-500 text-white',
        info: 'bg-blue-500 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface ToastProps extends VariantProps<typeof toastVariants> {
  title?: string
  description?: string
  duration?: number
  onOpenChange?: (open: boolean) => void
}

export function Toast({
  title,
  description,
  variant,
  duration = 3000,
  onOpenChange,
}: ToastProps) {
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false)
      onOpenChange?.(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onOpenChange])

  if (!isOpen) return null

  return (
    <div className={cn(toastVariants({ variant }))}>
      <div className="flex flex-col gap-1">
        {title && <h4 className="font-semibold">{title}</h4>}
        {description && <p className="text-sm opacity-90">{description}</p>}
      </div>
    </div>
  )
}
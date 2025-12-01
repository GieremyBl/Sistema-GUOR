"use client"

import { useToast } from "@/app/hooks/use-toast"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onDismiss={() => dismiss(toast.id)}
        />
      ))}
    </div>
  )
}

interface ToastComponentProps {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
  onDismiss: () => void
}

function Toast({ title, description, variant = "default", onDismiss }: ToastComponentProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all mb-4",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
        variant === "destructive"
          ? "border-red-500 bg-red-500 text-white"
          : "border-gray-200 bg-white text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
      )}
      data-state="open"
    >
      <div className="grid gap-1 flex-1">
        {title && (
          <div className="text-sm font-semibold">{title}</div>
        )}
        {description && (
          <div className="text-sm opacity-90">{description}</div>
        )}
      </div>
      <button
        onClick={onDismiss}
        className={cn(
          "absolute right-2 top-2 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2",
          variant === "destructive"
            ? "text-red-50 hover:text-white focus:ring-red-400"
            : "text-gray-500 hover:text-gray-900 focus:ring-gray-400"
        )}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Cerrar</span>
      </button>
    </div>
  )
}
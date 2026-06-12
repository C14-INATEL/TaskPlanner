"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { CheckCircle, AlertCircle, Info, X } from "lucide-react"

type ToastType = "success" | "error" | "info"

type ToastItem = {
  id: number
  type: ToastType
  message: string
}

type ToastContextValue = {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error("useToast deve ser usado dentro de <ToastProvider>")
  }
  return ctx
}

const toastConfig: Record<
  ToastType,
  { icon: typeof CheckCircle; accent: string; iconColor: string }
> = {
  success: { icon: CheckCircle, accent: "border-l-emerald-500", iconColor: "text-emerald-400" },
  error:   { icon: AlertCircle, accent: "border-l-rose-500",    iconColor: "text-rose-400" },
  info:    { icon: Info,        accent: "border-l-indigo-500",  iconColor: "text-indigo-400" },
}

let toastId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const push = useCallback(
    (type: ToastType, message: string) => {
      const id = ++toastId
      setToasts(prev => [...prev, { id, type, message }])
      setTimeout(() => remove(id), 4000)
    },
    [remove]
  )

  const value = useMemo<ToastContextValue>(
    () => ({
      success: (message: string) => push("success", message),
      error: (message: string) => push("error", message),
      info: (message: string) => push("info", message),
    }),
    [push]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)] pointer-events-none">
        {toasts.map(toast => {
          const cfg = toastConfig[toast.type]
          const Icon = cfg.icon
          return (
            <div
              key={toast.id}
              role="alert"
              className={`animate-toastIn pointer-events-auto flex items-start gap-3 bg-gray-900/95 backdrop-blur border border-white/10 border-l-4 ${cfg.accent} rounded-xl px-4 py-3 shadow-2xl`}
            >
              <Icon size={18} className={`${cfg.iconColor} shrink-0 mt-0.5`} />
              <p className="flex-1 text-sm text-gray-200 leading-snug">{toast.message}</p>
              <button
                aria-label="Fechar notificação"
                onClick={() => remove(toast.id)}
                className="shrink-0 text-gray-600 hover:text-gray-300 transition"
              >
                <X size={15} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
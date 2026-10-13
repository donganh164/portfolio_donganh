import { useState, useCallback, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ToastContext } from './toast-context'
import { ToastItem } from './Toast'

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const showToast = useCallback(
    ({ type = 'info', title, message, duration = 3500 }) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      const newToast = { id, type, title, message }

      setToasts((prev) => [...prev, newToast])

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id)
        }, duration)
      }

      return id
    },
    [dismissToast]
  )

  const toastHelpers = useMemo(
    () => ({
      show: showToast,
      success: (message, title = 'Thành công') =>
        showToast({ type: 'success', title, message }),
      error: (message, title = 'Có lỗi xảy ra') =>
        showToast({ type: 'error', title, message }),
      info: (message, title = 'Thông báo') =>
        showToast({ type: 'info', title, message }),
      warning: (message, title = 'Cảnh báo') =>
        showToast({ type: 'warning', title, message }),
      dismiss: dismissToast,
    }),
    [showToast, dismissToast]
  )

  return (
    <ToastContext.Provider value={toastHelpers}>
      {children}

      {/* Global Toast Container */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

import { useContext } from 'react'
import { ToastContext } from '@/components/ui/toast-context'

/**
 * Custom hook providing toast helpers (success, error, warning, info, show, dismiss).
 * @returns {object} Toast methods
 */
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

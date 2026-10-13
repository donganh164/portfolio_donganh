import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const TOAST_ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const TOAST_STYLES = {
  success: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/40',
  error: 'border-rose-500/30 text-rose-400 bg-rose-950/40',
  warning: 'border-amber-500/30 text-amber-400 bg-amber-950/40',
  info: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/40',
}

export function ToastItem({ toast, onDismiss }) {
  const IconComponent = TOAST_ICONS[toast.type] || TOAST_ICONS.info
  const styleClasses = TOAST_STYLES[toast.type] || TOAST_STYLES.info

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      className={cn(
        'w-full max-w-sm pointer-events-auto rounded-xl p-4 shadow-xl backdrop-blur-md border',
        'flex items-start gap-3 bg-[var(--bg-card)]/90 text-[var(--text-primary)]',
        styleClasses
      )}
    >
      <IconComponent className="w-5 h-5 shrink-0 mt-0.5 text-current" />

      <div className="flex-1 space-y-0.5 min-w-0">
        {toast.title && (
          <h4 className="text-sm font-heading font-semibold text-[var(--text-primary)] truncate">
            {toast.title}
          </h4>
        )}
        {toast.message && (
          <p className="text-xs font-sans text-[var(--text-muted)] leading-relaxed">
            {toast.message}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Đóng thông báo"
        className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/[0.08] transition-colors shrink-0 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

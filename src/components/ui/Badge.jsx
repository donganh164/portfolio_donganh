import { cn } from '@/lib/utils'

const BADGE_VARIANTS = {
  default:
    'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)]',
  accent:
    'bg-indigo-500/10 text-indigo-400 border border-indigo-500/25',
  arcade:
    'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]',
  success:
    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  warning:
    'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  danger:
    'bg-rose-500/10 text-rose-400 border border-rose-500/20',
  outline:
    'bg-transparent text-[var(--text-muted)] border border-[var(--border-subtle)]',
  mono:
    'font-mono bg-white/[0.04] text-[var(--text-primary)] border border-white/10',
}

const BADGE_SIZES = {
  sm: 'px-2 py-0.5 text-[11px] rounded-md gap-1',
  md: 'px-2.5 py-1 text-xs rounded-lg gap-1.5',
  lg: 'px-3 py-1.5 text-xs font-semibold rounded-lg gap-2',
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className,
  ...props
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-heading font-medium tracking-wide select-none transition-colors duration-150',
        BADGE_VARIANTS[variant] || BADGE_VARIANTS.default,
        BADGE_SIZES[size] || BADGE_SIZES.md,
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  )
}

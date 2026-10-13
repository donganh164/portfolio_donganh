import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const CARD_VARIANTS = {
  default:
    'bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)]',
  glass:
    'glass-card text-[var(--text-primary)]',
  interactive:
    'bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] text-[var(--text-primary)] transition-all duration-300 hover:shadow-[0_12px_40px_var(--accent-glow)] cursor-pointer',
  arcade:
    'bg-[var(--bg-card)] border border-cyan-500/30 text-[var(--text-primary)] hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all duration-300',
}

export const Card = forwardRef(function Card(
  {
    variant = 'default',
    interactive = false,
    className,
    children,
    asMotion = false,
    ...props
  },
  ref
) {
  const chosenVariant = interactive ? 'interactive' : variant
  const baseClasses = cn(
    'rounded-2xl p-6 backdrop-blur-md relative overflow-hidden',
    CARD_VARIANTS[chosenVariant] || CARD_VARIANTS.default,
    className
  )

  if (asMotion) {
    return (
      <motion.div
        ref={ref}
        whileHover={interactive ? { y: -3, scale: 1.01 } : undefined}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className={baseClasses}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div ref={ref} className={baseClasses} {...props}>
      {children}
    </div>
  )
})

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('mb-4 space-y-1.5', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn('text-lg font-heading font-semibold text-[var(--text-primary)] tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn('text-sm font-sans text-[var(--text-muted)] leading-relaxed', className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn('mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center', className)} {...props}>
      {children}
    </div>
  )
}

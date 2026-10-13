import { cn } from '@/lib/utils'

export function SkeletonLoader({
  className,
  variant = 'rectangular',
  width,
  height,
  ...props
}) {
  const variantStyles = {
    text: 'h-4 w-full rounded-md',
    circular: 'rounded-full aspect-square',
    rectangular: 'rounded-xl w-full',
    card: 'rounded-2xl w-full h-48',
  }

  const customDimensions = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  }

  return (
    <div
      aria-hidden="true"
      style={customDimensions}
      className={cn(
        'relative overflow-hidden bg-white/[0.05] border border-white/[0.03]',
        'before:absolute before:inset-0 before:-translate-x-full',
        'before:animate-[shimmer_2s_infinite]',
        'before:bg-gradient-to-r before:from-transparent before:via-white/[0.08] before:to-transparent',
        variantStyles[variant] || variantStyles.rectangular,
        className
      )}
      {...props}
    />
  )
}

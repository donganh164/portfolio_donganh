import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge dynamic class names with Tailwind CSS conflict resolution.
 * Combines clsx (conditional classes) and tailwind-merge (deduplicates overlapping utilities).
 *
 * @param {...any} inputs - Class values, objects, or arrays
 * @returns {string} - Optimized and merged className string
 *
 * @example
 * cn('px-4 py-2 bg-blue-500', isLarge && 'px-6 py-3', className)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

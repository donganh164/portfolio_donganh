import { useState } from 'react'
import { Terminal, LogIn, Gamepad2, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui'

export function Navbar({ onOpenAuth, activeMode, onToggleMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Giới thiệu', href: '#about' },
    { label: 'Kỹ năng', href: '#skills' },
    { label: 'Dự án', href: '#projects' },
    { label: 'Liên hệ', href: '#contact' },
  ]

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--bg-primary)]/85 border-b border-[var(--border-subtle)] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[var(--accent-cool)]/10 border border-[var(--accent-cool)]/30 flex items-center justify-center text-[var(--accent-cool)] group-hover:scale-105 transition-transform">
            <Terminal className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-base text-[var(--text-primary)] tracking-tight">
              Đông Anh
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)] -mt-1 tracking-wider uppercase">
              Software Engineer
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-heading font-medium text-[var(--text-muted)]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[var(--text-primary)] transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Subtle Arcade Switcher */}
          <Button
            variant={activeMode === 'arcade' ? 'arcade' : 'ghost'}
            size="sm"
            onClick={onToggleMode}
            leftIcon={<Gamepad2 className="w-4 h-4" />}
            className="text-xs"
          >
            {activeMode === 'arcade' ? 'Về Portfolio' : 'Arcade Game'}
          </Button>

          {/* Primary Login Button */}
          <Button
            variant="primary"
            size="sm"
            leftIcon={<LogIn className="w-4 h-4" />}
            onClick={onOpenAuth}
          >
            Đăng Nhập
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<LogIn className="w-3.5 h-3.5" />}
            onClick={onOpenAuth}
            className="px-2.5 py-1 text-xs"
          >
            Đăng Nhập
          </Button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/[0.06] transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-[var(--border-subtle)] bg-[var(--bg-card)]/95 backdrop-blur-lg px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-heading font-medium text-[var(--text-primary)] hover:bg-white/[0.05] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)] font-mono">Chế độ giải trí:</span>
            <Button
              variant={activeMode === 'arcade' ? 'arcade' : 'outline'}
              size="sm"
              onClick={() => {
                onToggleMode()
                setMobileMenuOpen(false)
              }}
              leftIcon={<Gamepad2 className="w-3.5 h-3.5" />}
            >
              {activeMode === 'arcade' ? 'Về Portfolio' : 'Arcade Mode'}
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

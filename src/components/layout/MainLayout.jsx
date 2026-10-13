import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function MainLayout({
  children,
  onOpenAuth,
  activeMode = 'portfolio',
  onToggleMode,
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 relative selection:bg-[var(--accent-cool)] selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-48 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-3xl transition-all duration-700 ${
            activeMode === 'arcade' ? 'bg-cyan-500/15' : 'bg-indigo-500/10'
          }`}
        />
        <div
          className={`absolute -bottom-48 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl transition-all duration-700 ${
            activeMode === 'arcade' ? 'bg-purple-600/20' : 'bg-slate-700/15'
          }`}
        />
      </div>

      {/* Main Navbar */}
      <Navbar
        onOpenAuth={onOpenAuth}
        activeMode={activeMode}
        onToggleMode={onToggleMode}
      />

      {/* Content Area */}
      <div className="flex-1 flex flex-col">{children}</div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

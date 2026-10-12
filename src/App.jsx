import { useState } from 'react'
import { Terminal, ShieldCheck, Gamepad2, Sparkles, Layers } from 'lucide-react'

function App() {
  const [activeMode, setActiveMode] = useState('portfolio')

  const toggleMode = () => {
    const nextMode = activeMode === 'portfolio' ? 'arcade' : 'portfolio'
    setActiveMode(nextMode)
    if (nextMode === 'arcade') {
      document.documentElement.setAttribute('data-theme', 'arcade')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl w-full glass-card rounded-2xl p-8 sm:p-10 border border-white/10 shadow-2xl space-y-6">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Hệ Thống Sẵn Sàng • Giai Đoạn 1.4 Hoàn Tất</span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center justify-center gap-3">
            <Terminal className="w-8 h-8 text-indigo-400" />
            Đông Anh Portfolio & Arcade
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Kiến trúc Dual-Mode đã được thiết lập modular hóa: Tách biệt hoàn toàn tầng UI, Portfolio, Game Arcade, Services và Custom Hooks.
          </p>
        </div>

        {/* System Diagnostics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Bảo Mật
            </div>
            <p className="text-[11px] text-gray-500 leading-tight">RLS & Database Functions RPC chuẩn bị tích hợp.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
              <Layers className="w-4 h-4 text-indigo-400" />
              Cấu Trúc
            </div>
            <p className="text-[11px] text-gray-500 leading-tight">Feature-Driven: `components/`, `features/`, `services/`.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
              Chế Độ
            </div>
            <p className="text-[11px] text-gray-500 leading-tight">Hiện tại: {activeMode === 'portfolio' ? 'Executive Tech' : 'Neon Arcade'}</p>
          </div>
        </div>

        {/* Action Button: Test Dynamic Theme Toggle */}
        <div className="pt-2">
          <button
            type="button"
            onClick={toggleMode}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-indigo-600/25 cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4" />
            Chuyển Thử Chế Độ ({activeMode === 'portfolio' ? 'Sang Arcade Theme' : 'Về Executive Theme'})
          </button>
        </div>
      </div>

      <footer className="mt-8 text-xs text-gray-500">
        © 2026 Đông Anh • Thiết kế & Kiến trúc React 19 + Tailwind CSS v4
      </footer>
    </main>
  )
}

export default App

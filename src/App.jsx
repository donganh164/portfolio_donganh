import { useState, useEffect } from 'react'
import {
  ShieldCheck,
  Gamepad2,
  ArrowRight,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  Mail,
  Send,
} from 'lucide-react'

function GithubIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={`${className} fill-current`} viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  ToastProvider,
} from '@/components/ui'
import { useToast } from '@/hooks/useToast'
import { MainLayout } from '@/components/layout'
import { AuthModal } from '@/components/auth/AuthModal'

function PortfolioHomePage() {
  const [activeMode, setActiveMode] = useState('portfolio')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [contactMessage, setContactMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const { success, info } = useToast()

  const toggleMode = () => {
    const nextMode = activeMode === 'portfolio' ? 'arcade' : 'portfolio'
    setActiveMode(nextMode)
    if (nextMode === 'arcade') {
      document.documentElement.setAttribute('data-theme', 'arcade')
      info('Đã bật Arcade Mode!', 'Chuyển Đổi Giao Diện')
    } else {
      document.documentElement.removeAttribute('data-theme')
      info('Đã trở về Portfolio!', 'Chuyển Đổi Giao Diện')
    }
  }

  useEffect(() => {
    if (activeMode === 'arcade') {
      document.documentElement.setAttribute('data-theme', 'arcade')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [activeMode])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!contactMessage.trim()) return

    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      setContactMessage('')
      success('Tin nhắn liên hệ đã được gửi tới Đông Anh!', 'Gửi Thành Công')
    }, 900)
  }

  return (
    <MainLayout
      onOpenAuth={() => setIsAuthModalOpen(true)}
      activeMode={activeMode}
      onToggleMode={toggleMode}
    >
      {/* 1. HERO SECTION */}
      <section id="hero" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center space-y-6">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-heading font-medium border border-emerald-500/25 bg-emerald-500/10 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sẵn sàng cho các dự án & cơ hội nghề nghiệp mới</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-heading font-bold tracking-tight text-[var(--text-primary)] leading-tight">
            Kỹ Sư Phần Mềm & <br />
            <span className="text-[var(--accent-cool)] inline-block">Creative Developer</span>
          </h1>
          <p className="font-sans text-[var(--text-muted)] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Xin chào, tôi là <strong>Đông Anh</strong>. Chuyên sâu xây dựng ứng dụng web hiện đại với React 19, kiến trúc hệ thống chuẩn bảo mật RLS và trải nghiệm số mượt mà, tối ưu hiệu năng.
          </p>
        </div>

        {/* Hero Call-To-Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => {
              const el = document.getElementById('projects')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Xem Dự Án Nổi Bật
          </Button>

          <Button
            variant="secondary"
            size="lg"
            leftIcon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
            onClick={() => setIsAuthModalOpen(true)}
          >
            Đăng Nhập Nhà Tuyển Dụng
          </Button>

          <Button
            variant="outline"
            size="lg"
            leftIcon={<Mail className="w-4 h-4" />}
            onClick={() => {
              const el = document.getElementById('contact')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Liên Hệ Nhanh
          </Button>
        </div>
      </section>

      {/* 2. SKILLS MATRIX SECTION PREVIEW */}
      <section id="skills" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <h2 className="text-2xl font-heading font-bold text-[var(--text-primary)]">
              Kỹ Năng & Năng Lực Kỹ Thuật
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[var(--text-muted)] mt-1">
              Hệ sinh thái công nghệ được tối ưu cho hiệu năng và độ ổn định cao.
            </p>
          </div>
          <Badge variant="mono">Tech Matrix 2026</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card interactive asMotion>
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-[var(--accent-cool)] mb-2">
                <Code2 className="w-5 h-5" />
              </div>
              <CardTitle>Frontend & UI Engineering</CardTitle>
              <CardDescription>Trải nghiệm mượt 60fps, responsive chuẩn.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1.5">
              <Badge variant="accent">React 19</Badge>
              <Badge variant="accent">Vite</Badge>
              <Badge variant="default">Tailwind CSS v4</Badge>
              <Badge variant="default">Framer Motion</Badge>
              <Badge variant="default">JavaScript ES6+</Badge>
            </CardContent>
          </Card>

          <Card interactive asMotion>
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 mb-2">
                <Database className="w-5 h-5" />
              </div>
              <CardTitle>Backend & Cloud Database</CardTitle>
              <CardDescription>Cơ sở dữ liệu quan hệ và bảo mật dữ liệu.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1.5">
              <Badge variant="arcade">Supabase</Badge>
              <Badge variant="arcade">PostgreSQL</Badge>
              <Badge variant="default">Row Level Security</Badge>
              <Badge variant="default">Database RPC</Badge>
              <Badge variant="default">OAuth 2.0</Badge>
            </CardContent>
          </Card>

          <Card interactive asMotion>
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 mb-2">
                <Cpu className="w-5 h-5" />
              </div>
              <CardTitle>Kiến Trúc & DevOps</CardTitle>
              <CardDescription>Tiêu chuẩn mã nguồn sạch, tối ưu hóa SEO.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1.5">
              <Badge variant="mono">Clean Architecture</Badge>
              <Badge variant="mono">CI/CD Pipeline</Badge>
              <Badge variant="mono">Git Workflow</Badge>
              <Badge variant="mono">Lighthouse 100</Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3. FEATURED PROJECTS PREVIEW */}
      <section id="projects" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <h2 className="text-2xl font-heading font-bold text-[var(--text-primary)]">
              Dự Án Nổi Bật
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[var(--text-muted)] mt-1">
              Các sản phẩm và giải pháp công nghệ tiêu biểu của Đông Anh.
            </p>
          </div>
          <Badge variant="accent">Portfolio Showcase</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card interactive asMotion>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="accent">Hệ Thống Tiêu Biểu</Badge>
                <span className="text-xs font-mono text-[var(--text-muted)]">2026</span>
              </div>
              <CardTitle className="pt-2">Dual-Mode Portfolio & Q&A Arcade</CardTitle>
              <CardDescription>
                Nền tảng kép kết hợp Portfolio công nghệ tối giản với hệ thống Gamified Q&A tích điểm đổi voucher cho bạn bè.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="default">React 19</Badge>
                <Badge variant="default">Tailwind v4</Badge>
                <Badge variant="default">Supabase RLS</Badge>
                <Badge variant="default">Framer Motion</Badge>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-sans">
                Đặc điểm kỹ thuật: Phân quyền vai trò (RBAC), bảo vệ đáp án server-side bằng PostgreSQL Functions, hiệu năng chuyển theme 0ms.
              </p>
            </CardContent>
            <CardFooter className="justify-between">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<GithubIcon className="w-3.5 h-3.5" />}
                onClick={() => window.open('https://github.com', '_blank')}
              >
                Mã Nguồn
              </Button>
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                onClick={() => setIsAuthModalOpen(true)}
              >
                Chi Tiết Kiến Trúc
              </Button>
            </CardFooter>
          </Card>

          <Card interactive asMotion>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="arcade">Cloud & Database</Badge>
                <span className="text-xs font-mono text-[var(--text-muted)]">2026</span>
              </div>
              <CardTitle className="pt-2">Enterprise Resource Management System</CardTitle>
              <CardDescription>
                Hệ thống quản lý dữ liệu lớn với kiến trúc bảo mật nhiều lớp, đồng bộ realtime và phân quyền granular.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="default">PostgreSQL</Badge>
                <Badge variant="default">Row Level Security</Badge>
                <Badge variant="default">Edge Functions</Badge>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-sans">
                Đặc điểm kỹ thuật: Xử lý hàng nghìn truy vấn đồng thời, tự động đồng bộ tài khoản Google OAuth qua Database Triggers.
              </p>
            </CardContent>
            <CardFooter className="justify-between">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<GithubIcon className="w-3.5 h-3.5" />}
                onClick={() => window.open('https://github.com', '_blank')}
              >
                Mã Nguồn
              </Button>
              <Button
                variant="secondary"
                size="sm"
                rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                onClick={() => setIsAuthModalOpen(true)}
              >
                Xem Case Study
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* 4. FAST CONTACT SECTION */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="accent">Kết Nối Trực Tiếp</Badge>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[var(--text-primary)]">
            Liên Hệ Với Đông Anh
          </h2>
          <p className="text-xs sm:text-sm font-sans text-[var(--text-muted)]">
            Bạn có câu hỏi, lời mời phỏng vấn hoặc cơ hội hợp tác dự án? Hãy để lại lời nhắn!
          </p>
        </div>

        <form onSubmit={handleSendMessage} className="p-6 rounded-2xl glass-card space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="contact-message-input" className="text-xs font-heading font-medium text-[var(--text-primary)]">
              Lời nhắn của bạn:
            </label>
            <textarea
              id="contact-message-input"
              rows={3}
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder="Xin chào Đông Anh, tôi muốn trao đổi về cơ hội hợp tác..."
              className="w-full p-3.5 rounded-xl bg-white/[0.04] border border-[var(--border-subtle)] focus:border-[var(--accent-cool)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]/50 focus:outline-none transition-colors font-sans resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <span className="text-xs font-mono text-[var(--text-muted)]">
              Phản hồi thường trong vòng 24 giờ.
            </span>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSending}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Gửi Tin Nhắn Nhanh
            </Button>
          </div>
        </form>
      </section>

      {/* 5. SUBTLE ARCADE DISCOVERY FOOTNOTE */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="p-6 rounded-2xl bg-cyan-500/[0.04] border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-cyan-400 font-heading font-semibold text-sm">
              <Gamepad2 className="w-4 h-4" />
              <span>Góc Giải Trí Minigame Dành Cho Bạn Bè</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-sans">
              Khám phá khu vực Arcade Q&A để trả lời câu hỏi kỷ niệm, tích điểm và đổi voucher cà phê/ăn trưa cùng Đông Anh!
            </p>
          </div>

          <Button
            variant="arcade"
            size="sm"
            onClick={toggleMode}
            leftIcon={<Gamepad2 className="w-4 h-4" />}
            className="shrink-0"
          >
            {activeMode === 'arcade' ? 'Về Giao Diện Portfolio' : 'Thử Chế Độ Arcade'}
          </Button>
        </div>
      </section>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSwitchToArcade={toggleMode}
      />
    </MainLayout>
  )
}

function App() {
  return (
    <ToastProvider>
      <PortfolioHomePage />
    </ToastProvider>
  )
}

export default App

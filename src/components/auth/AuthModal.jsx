import { useState } from 'react'
import { ShieldCheck, KeyRound, Gamepad2, ArrowRight } from 'lucide-react'
import { Modal, Button, Badge } from '@/components/ui'
import { useToast } from '@/hooks/useToast'

export function AuthModal({ isOpen, onClose, onSwitchToArcade }) {
  const [activeTab, setActiveTab] = useState('google') // 'google' | 'recruiter' | 'friend'
  const [vipCode, setVipCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { success, error, info } = useToast()

  const handleGoogleLogin = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      info('Đang kết nối cổng xác thực Google OAuth...', 'Đăng Nhập Gmail')
      onClose()
    }, 800)
  }

  const handleVipSubmit = (e) => {
    e.preventDefault()
    if (!vipCode.trim()) {
      error('Vui lòng nhập mã VIP Access Key được cấp.', 'Chưa Nhập Mã')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      if (vipCode.trim().toUpperCase() === 'VIP2026' || vipCode.trim().toUpperCase() === 'RECRUITER') {
        success('Xác thực quyền Nhà Tuyển Dụng VIP thành công!', 'Quyền Truy Cập Mở')
        onClose()
      } else {
        error('Mã truy cập không hợp lệ. Vui lòng thử lại hoặc đăng nhập bằng Gmail.', 'Từ Chối Quyền')
      }
    }, 700)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Đăng Nhập Hệ Thống"
      description="Lựa chọn phương thức xác thực phù hợp để mở khóa toàn bộ thông tin chuyên sâu hoặc tham gia mini-game."
      size="md"
    >
      <div className="space-y-5">
        {/* Role Tab Selector */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-[var(--border-subtle)] text-xs font-heading">
          <button
            type="button"
            onClick={() => setActiveTab('google')}
            className={`py-2 px-2 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'google'
                ? 'bg-[var(--accent-cool)] text-white shadow-md'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Gmail / Google
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('recruiter')}
            className={`py-2 px-2 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'recruiter'
                ? 'bg-[var(--accent-cool)] text-white shadow-md'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Nhà Tuyển Dụng
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('friend')}
            className={`py-2 px-2 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'friend'
                ? 'bg-[var(--accent-cool)] text-white shadow-md'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Bạn Bè / Arcade
          </button>
        </div>

        {/* Tab 1: Google OAuth */}
        {activeTab === 'google' && (
          <div className="space-y-4 pt-1">
            <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed">
              Đăng nhập một chạm bằng tài khoản Google để tự động lưu hồ sơ, lịch sử tương tác và điểm thưởng mini-game vào Supabase.
            </p>

            <Button
              variant="outline"
              size="lg"
              className="w-full justify-center bg-white/[0.03] hover:bg-white/[0.08] border-white/15"
              isLoading={isSubmitting}
              onClick={handleGoogleLogin}
              leftIcon={
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              }
            >
              Tiếp tục với Google / Gmail
            </Button>
          </div>
        )}

        {/* Tab 2: Recruiter VIP Key */}
        {activeTab === 'recruiter' && (
          <form onSubmit={handleVipSubmit} className="space-y-4 pt-1">
            <div className="flex items-center gap-2">
              <Badge variant="success" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                Dành cho Recruiter / Đối tác
              </Badge>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed">
              Nhập mã VIP Access Pass được Đông Anh cung cấp (thử mã: <code className="text-[var(--accent-cool)] font-mono">VIP2026</code>) để truy cập bản tóm tắt hồ sơ và tài liệu kiến trúc.
            </p>

            <div className="space-y-1.5">
              <label htmlFor="vip-code-input" className="text-xs font-heading font-medium text-[var(--text-primary)]">
                Mã VIP Access Key:
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="vip-code-input"
                  type="text"
                  placeholder="Ví dụ: VIP2026"
                  value={vipCode}
                  onChange={(e) => setVipCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-[var(--border-subtle)] focus:border-[var(--accent-cool)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full justify-center"
              isLoading={isSubmitting}
            >
              Kích Hoạt Quyền VIP
            </Button>
          </form>
        )}

        {/* Tab 3: Friends / Arcade Layer */}
        {activeTab === 'friend' && (
          <div className="space-y-4 pt-1">
            <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-heading font-semibold text-xs">
                <Gamepad2 className="w-4 h-4" />
                <span>Khu Vực Bạn Bè & Thử Thách Q&A</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed">
                Tham gia trả lời các câu hỏi kỷ niệm, tích lũy Coins và mở khóa Voucher ăn trưa, cà phê cùng Đông Anh!
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="arcade"
                size="md"
                className="w-full justify-center"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  onClose()
                  if (onSwitchToArcade) onSwitchToArcade()
                }}
              >
                Vào Khu Arcade Ngay
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

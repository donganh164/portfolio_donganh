---
name: portfolio-game-architecture
description: Domain logic and engineering guidelines for Dong Anh's Dual-Mode Web Portfolio & Gamified Platform built with React 19 + Vite, JavaScript ES6+, Tailwind CSS, and Supabase.
---

# Domain & Business Architecture Guidelines (SKILL.md)

## 1. Hard Constraints & Tech Stack
- **Framework**: React 19 with Vite (Strictly NO Next.js).
- **Language**: Modern JavaScript ES6+ (`.jsx` for components, `.js` for logic). Strictly NO TypeScript.
- **Styling & UI**: Tailwind CSS, Lucide React, Framer Motion.
- **Backend & Auth**: Supabase (PostgreSQL, Auth, Realtime, RLS Policies, Database RPC Functions).
- **Localization Strategy**:
  - **User-Facing UI**: 100% Tiếng Việt (Toàn bộ nội dung hiển thị cho người dùng phải là Tiếng Việt chuẩn).
  - **Codebase Standards**: 100% English (Variables, functions, file names, comments, and database schemas).

---

## 2. Domain Concept & System Overview
This system is a **Dual-Mode Web Platform** created for **Đông Anh**:
1. **Professional Web Portfolio (Primary Priority)**: High-impact showcase of engineering skills, projects, case studies, AI chatbot, and interactive contact for recruiters and tech executives.
   - **Aesthetic**: Minimalist Tech Editorial / Modern Gazette. Clean cool palette (Deep Obsidian / Slate / Cool Monochrome), refined typography, subtle 1px borders, high-impact interactive micro-motions and physics.
2. **Gamified Arcade Module (Secondary / Social Layer)**: Interactive Q&A quest system for friends and relatives with point accumulation (EXP/Coins), level progression, unlockable personal trivia/easter eggs, and redeemable vouchers.
   - **Aesthetic**: Refined Minimalist Arcade. Tasteful cool electric accents, higher motion intensity, interactive quest map, engaging without being oversaturated or carnival-like.
3. **Theming Architecture**: Single primary dark-cool foundation (no distracting light/dark toggle). Decoupled CSS variable tokens so components remain flexible and independent of hardcoded colors.

---

## 3. Role-Based Access Control (RBAC) & User Flow

| Role | Auth Method | Portfolio Access | Game Access | Lock/Unlock Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **Recruiter / VIP (Admin-Granted)** | Magic Link / Direct Key / VIP Credentials | **100% Unlocked** (Instant view of all professional & deep-dive info) | Optional / Bypass | No lock barriers. Executive summary available immediately. |
| **Friend / Relative** | Simple Auth (OAuth / Email Pass) | Public Professional Info Unlocked + Personal Info Locked | **Full Access** | Personal trivia, secret galleries, and vouchers locked behind Q&A level clearance. |
| **Guest (Public)** | Anonymous | Public Professional Info (Introduce, Skills, Public Projects) | Demo Quest Mode | Prompts login or VIP pass entry. |

---

## 4. Core Feature Modules

### A. Professional Web Portfolio Module
- **Introduce Section**: High-impact Hero banner, dynamic title typing, quick action buttons (Tải CV, Liên hệ, Chế độ Nhà tuyển dụng).
- **About Me**: Professional backstory, career trajectory, core values, technical philosophy.
- **Skills Matrix**: Categorized tech stack (Frontend, Backend, Database, Cloud/DevOps, AI Integrations) with visual proficiency & experience badges.
- **Projects Showcase**: Interactive cards with filter tags, live demo links, Github repositories, Architecture diagrams, and Impact metrics.
- **Contact & Booking**: Interactive contact form with Supabase backend, email notifications, and optional scheduler integration.
- **AI Portfolio Assistant**: Context-aware RAG AI Chatbot answering questions about Đông Anh's experience, project architecture, and availability.

### B. Gamified Q&A Module (Friend Playground)
- **Player System**: Profile avatar, total points (EXP/Coins), current level/rank title (e.g., "Tân Thủ", "Bạn Thân Cứng", "Tri Kỷ Đông Anh").
- **Level Clearance (Vượt ải)**: Multi-stage Q&A trivia about Đông Anh (personal interests, shared memories, tech quirks).
- **Unlock Engine**: Answering questions correctly unlocks secret portfolio cards, photo memories, and bonus stories.
- **Voucher Store & Economy**:
  - Point conversion logic (Points -> Redeemable Code/Voucher).
  - Vouchers: Free Coffee, Free Lunch Pass, Code Review Ticket, Task Helper Pass.
  - Transaction History & Redemption Status tracking via Supabase.

---

## 5. Technical Architecture (React 19 + Vite + Supabase)

### Database Schema Draft (Supabase PostgreSQL)
- **`profiles`**: `id` (UUID, FK to auth.users), `full_name`, `avatar_url`, `role` (`recruiter`, `friend`, `admin`), `created_at`.
- **`game_profiles`**: `user_id` (FK), `points`, `level`, `rank_title`, `unlocked_nodes` (JSONB array).
- **`questions`**: `id`, `stage_level`, `question_text`, `options` (JSONB), `correct_option_index`, `points_reward`, `unlocked_content_id`.
- **`vouchers`**: `id`, `title`, `description`, `cost_points`, `stock`, `voucher_code_prefix`.
- **`user_vouchers`**: `id`, `user_id` (FK), `voucher_id` (FK), `redemption_code`, `status` (`active`, `used`, `expired`), `redeemed_at`.
- **`contacts`**: `id`, `sender_name`, `sender_email`, `message`, `is_recruiter`, `created_at`.

### Security & Row Level Security (RLS) Rules
1. `profiles`: Read allowed for authenticated user's own profile; Read role metadata for system routes.
2. `questions`: Correct answers column hidden from public queries via Supabase Database Functions (RPC) to prevent client-side inspection/cheating.
3. `vouchers`: Only redeemable via atomic PostgreSQL transaction functions (`redeem_voucher_rpc`).

---

## 6. Pair-Programming & Agent Operational Workflow (STRICT)
- **Mindset**: Agent là người đồng hành (Co-pilot / DevOps Mentor), tuyệt đối KHÔNG thực thi âm thầm (No blackbox / silent execution).
- **Quy trình bắt buộc trước khi code hoặc chạy terminal**:
  1. **Mở khối `<brainstorm>`**:
     - **Bối cảnh & Phân tích**: Tại sao cần làm mục này, tác động tới kiến trúc hệ thống ra sao.
     - **Kế hoạch chi tiết & Gợi ý code**: Trình bày từng file dự kiến tạo/sửa, giải thích chi tiết mục đích từng hàm/biến.
     - **Kiến thức cốt lõi cần học**: Chỉ rõ các kiến thức công nghệ mà người dùng cần hiểu để sau này tự tin vận hành, bảo trì và phát triển thêm tính năng mà không bị phụ thuộc.
  2. **Thống nhất phương án**: Trao đổi, trả lời thắc mắc của người dùng và chờ người dùng xác nhận trước khi thực hiện bất kỳ thay đổi nào lên mã nguồn.


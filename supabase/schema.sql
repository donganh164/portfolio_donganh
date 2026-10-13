-- ==============================================================================
-- DỰ ÁN: PORTFOLIO & GAMIFIED ARCADE - ĐÔNG ANH
-- DATABASE BLUEPRINT (POSTGRESQL + SUPABASE)
-- Hướng dẫn: Mở Supabase Dashboard -> SQL Editor -> Dán toàn bộ file này -> Nhấn RUN.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ==============================================================================
-- 2. CORE TABLES (7 BẢNG DỮ LIỆU CỐT LÕI)
-- ==============================================================================

-- BẢNG 1: PROFILES (Hồ sơ & Phân quyền 4 Roles: admin, interviewer, user, guest)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'interviewer', 'user', 'guest')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- BẢNG 2: PROJECTS (Dự án Portfolio công nghệ của Đông Anh)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    demo_link TEXT,
    github_link TEXT,
    metrics TEXT,
    is_locked_for_guest BOOLEAN DEFAULT false,
    order_index INT DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- BẢNG 3: CONTACTS (Hòm thư liên hệ & Phản hồi)
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    message TEXT NOT NULL,
    category TEXT DEFAULT 'general' CHECK (category IN ('general', 'recruiter_inquiry', 'game_feedback', 'bug_report')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- BẢNG 4: GAME_PROFILES (Thông tin người chơi, EXP, Coins, Cột mốc bản đồ)
CREATE TABLE IF NOT EXISTS public.game_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    player_name TEXT DEFAULT '',
    relationship TEXT DEFAULT '',
    player_wish TEXT DEFAULT '',
    exp INT NOT NULL DEFAULT 0,
    coins INT NOT NULL DEFAULT 0,
    level INT NOT NULL DEFAULT 1,
    rank_title TEXT NOT NULL DEFAULT 'Tân Thủ Khám Phá',
    is_stage2_unlocked BOOLEAN NOT NULL DEFAULT false,
    unlocked_map_nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
    unlocked_portfolio_cards JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- BẢNG 5: QUESTIONS (Kho câu hỏi: Giai đoạn 1 Cơ bản & Giai đoạn 2 Bản đồ Việt Nam)
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stage INT NOT NULL CHECK (stage IN (1, 2)),
    location_tag TEXT, -- 'hanoi', 'danang', 'saigon', 'dalat'
    location_name TEXT, -- 'Hà Nội - Kỷ Niệm Niên Thiếu'
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Mảng 4 lựa chọn: ["A", "B", "C", "D"]
    correct_option_index INT NOT NULL CHECK (correct_option_index BETWEEN 0 AND 3),
    exp_reward INT NOT NULL DEFAULT 100,
    coins_reward INT NOT NULL DEFAULT 10,
    hint TEXT,
    secret_memory_text TEXT,
    secret_image_url TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- BẢNG 6: VOUCHERS (Kho Voucher Quà Tặng Đổi Thưởng Ngoài Đời)
CREATE TABLE IF NOT EXISTS public.vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    cost_coins INT NOT NULL DEFAULT 50,
    icon TEXT DEFAULT 'gift',
    voucher_prefix TEXT DEFAULT 'GIFT',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- BẢNG 7: USER_VOUCHERS (Voucher Người Chơi Đã Đổi & Chống Dùng Lại Lần 2)
CREATE TABLE IF NOT EXISTS public.user_vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    voucher_id UUID NOT NULL REFERENCES public.vouchers(id) ON DELETE CASCADE,
    voucher_code TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used')),
    redeemed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    used_at TIMESTAMPTZ
);

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) - BẢO MẬT PHÂN TẦNG DỮ LIỆU
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_vouchers ENABLE ROW LEVEL SECURITY;

-- Hàm hỗ trợ: Kiểm tra user hiện tại có phải là Admin hay không
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$;

-- Hàm hỗ trợ: Kiểm tra user hiện tại có phải là Interviewer hay không
CREATE OR REPLACE FUNCTION public.is_interviewer()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('interviewer', 'admin')
    );
$$;

-- POLICIES CHO PROFILES
DROP POLICY IF EXISTS "Profiles: Mọi người có thể xem hồ sơ cơ bản" ON public.profiles;
CREATE POLICY "Profiles: Mọi người có thể xem hồ sơ cơ bản"
ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Profiles: Người dùng tự cập nhật thông tin của mình" ON public.profiles;
CREATE POLICY "Profiles: Người dùng tự cập nhật thông tin của mình"
ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Profiles: Admin toàn quyền quản lý" ON public.profiles;
CREATE POLICY "Profiles: Admin toàn quyền quản lý"
ON public.profiles FOR ALL USING (public.is_admin());

-- POLICIES CHO PROJECTS
DROP POLICY IF EXISTS "Projects: Đọc dự án công khai" ON public.projects;
CREATE POLICY "Projects: Đọc dự án công khai"
ON public.projects FOR SELECT USING (
    is_published = true AND (
        is_locked_for_guest = false OR
        public.is_interviewer() OR
        auth.role() = 'authenticated'
    )
);

DROP POLICY IF EXISTS "Projects: Admin toàn quyền" ON public.projects;
CREATE POLICY "Projects: Admin toàn quyền"
ON public.projects FOR ALL USING (public.is_admin());

-- POLICIES CHO CONTACTS
DROP POLICY IF EXISTS "Contacts: Mọi người có thể gửi liên hệ" ON public.contacts;
CREATE POLICY "Contacts: Mọi người có thể gửi liên hệ"
ON public.contacts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Contacts: Admin xem và quản lý liên hệ" ON public.contacts;
CREATE POLICY "Contacts: Admin xem và quản lý liên hệ"
ON public.contacts FOR SELECT USING (public.is_admin());

-- POLICIES CHO GAME_PROFILES
DROP POLICY IF EXISTS "GameProfiles: Người chơi xem điểm của chính mình" ON public.game_profiles;
CREATE POLICY "GameProfiles: Người chơi xem điểm của chính mình"
ON public.game_profiles FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "GameProfiles: Người chơi cập nhật hồ sơ chơi của mình" ON public.game_profiles;
CREATE POLICY "GameProfiles: Người chơi cập nhật hồ sơ chơi của mình"
ON public.game_profiles FOR UPDATE USING (auth.uid() = user_id);

-- POLICIES CHO QUESTIONS (CHỐNG F12: KHÔNG CẤP QUYỀN SELECT TRỰC TIẾP CỘT ĐÁP ÁN CHO CLIENT)
DROP POLICY IF EXISTS "Questions: Chỉ Admin đọc bảng trực tiếp" ON public.questions;
CREATE POLICY "Questions: Chỉ Admin đọc bảng trực tiếp"
ON public.questions FOR ALL USING (public.is_admin());

-- POLICIES CHO VOUCHERS
DROP POLICY IF EXISTS "Vouchers: Mọi người có thể xem danh mục voucher hoạt động" ON public.vouchers;
CREATE POLICY "Vouchers: Mọi người có thể xem danh mục voucher hoạt động"
ON public.vouchers FOR SELECT USING (is_active = true);

-- POLICIES CHO USER_VOUCHERS
DROP POLICY IF EXISTS "UserVouchers: Người dùng xem mã voucher của chính mình" ON public.user_vouchers;
CREATE POLICY "UserVouchers: Người dùng xem mã voucher của chính mình"
ON public.user_vouchers FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

-- ==============================================================================
-- 4. DATABASE FUNCTIONS & TRIGGERS (TỰ ĐỘNG HÓA & AN TOÀN)
-- ==============================================================================

-- TRIGGER 1: TỰ ĐỘNG LƯU USER KHI ĐĂNG NHẬP GMAIL HOẶC TẠO TÀI KHOẢN
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
        'user'
    )
    ON CONFLICT (id) DO UPDATE
    SET
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url,
        updated_at = now();

    -- Tự động khởi tạo Game Profile cho người dùng
    INSERT INTO public.game_profiles (user_id, exp, coins, level, rank_title)
    VALUES (NEW.id, 0, 0, 1, 'Tân Thủ Khám Phá')
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- FUNCTION 2: LẤY DANH SÁCH CÂU HỎI AN TOÀN (ẨN 100% ĐÁP ÁN ĐÚNG)
CREATE OR REPLACE FUNCTION public.get_game_questions(p_stage INT DEFAULT NULL)
RETURNS TABLE (
    id UUID,
    stage INT,
    location_tag TEXT,
    location_name TEXT,
    question_text TEXT,
    options JSONB,
    exp_reward INT,
    coins_reward INT,
    hint TEXT,
    order_index INT
) LANGUAGE sql SECURITY DEFINER STABLE AS $$
    SELECT
        q.id,
        q.stage,
        q.location_tag,
        q.location_name,
        q.question_text,
        q.options,
        q.exp_reward,
        q.coins_reward,
        q.hint,
        q.order_index
    FROM public.questions q
    WHERE (p_stage IS NULL OR q.stage = p_stage)
    ORDER BY q.stage ASC, q.order_index ASC;
$$;

-- FUNCTION 3: LƯU THÔNG TIN BẮT ĐẦU CHƠI PHẦN 1 (Tên, Mối quan hệ, Mong muốn)
CREATE OR REPLACE FUNCTION public.rpc_save_player_intro(
    p_player_name TEXT,
    p_relationship TEXT,
    p_player_wish TEXT
)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_user_id UUID := auth.uid();
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Vui lòng đăng nhập để lưu thông tin người chơi.';
    END IF;

    UPDATE public.game_profiles
    SET
        player_name = TRIM(p_player_name),
        relationship = TRIM(p_relationship),
        player_wish = TRIM(p_player_wish),
        updated_at = now()
    WHERE user_id = v_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Đã lưu thông tin người chơi thành công.'
    );
END;
$$;

-- FUNCTION 4: CHẤM ĐIỂM SERVER-SIDE, CỘNG EXP & COINS, TÍNH CẤP BẬC VÀ MỞ KHÓA BẢN ĐỒ
CREATE OR REPLACE FUNCTION public.rpc_submit_answer(
    p_question_id UUID,
    p_selected_index INT
)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_q RECORD;
    v_is_correct BOOLEAN;
    v_exp_earned INT;
    v_coins_earned INT;
    v_secret_text TEXT := NULL;
    v_profile RECORD;
    v_new_exp INT;
    v_new_coins INT;
    v_new_level INT;
    v_new_rank TEXT;
    v_stage2_unlocked BOOLEAN;
    v_map_nodes JSONB;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Vui lòng đăng nhập để tham gia trả lời câu hỏi.';
    END IF;

    -- Lấy thông tin câu hỏi
    SELECT * INTO v_q FROM public.questions WHERE id = p_question_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Câu hỏi không tồn tại.';
    END IF;

    -- Kiểm tra đáp án
    IF p_selected_index = v_q.correct_option_index THEN
        v_is_correct := true;
        v_exp_earned := v_q.exp_reward;
        v_coins_earned := v_q.coins_reward;
        v_secret_text := v_q.secret_memory_text;
    ELSE
        v_is_correct := false;
        v_exp_earned := GREATEST(20, v_q.exp_reward / 5); -- Khích lệ người chơi sai vẫn có ít EXP
        v_coins_earned := 0; -- Chỉ đúng mới có Coins
        v_secret_text := NULL;
    END IF;

    -- Lấy hồ sơ game hiện tại
    SELECT * INTO v_profile FROM public.game_profiles WHERE user_id = v_user_id;
    IF NOT FOUND THEN
        INSERT INTO public.game_profiles (user_id, exp, coins) VALUES (v_user_id, 0, 0);
        SELECT * INTO v_profile FROM public.game_profiles WHERE user_id = v_user_id;
    END IF;

    v_new_exp := v_profile.exp + v_exp_earned;
    v_new_coins := v_profile.coins + v_coins_earned;
    v_map_nodes := COALESCE(v_profile.unlocked_map_nodes, '[]'::jsonb);

    -- Nếu câu hỏi giai đoạn 2 thuộc địa danh và trả lời đúng, thêm vào danh sách địa điểm đã vượt qua
    IF v_is_correct AND v_q.stage = 2 AND v_q.location_tag IS NOT NULL THEN
        IF NOT (v_map_nodes ? v_q.location_tag) THEN
            v_map_nodes := v_map_nodes || to_jsonb(v_q.location_tag);
        END IF;
    END IF;

    -- Tính toán 4 Cấp Bậc & Mở Khóa Giai Đoạn 2 Bản Đồ
    IF v_new_exp >= 800 THEN
        v_new_level := 4;
        v_new_rank := 'Tri Kỷ Đông Anh';
        v_stage2_unlocked := true;
    ELSIF v_new_exp >= 400 THEN
        v_new_level := 3;
        v_new_rank := 'Bạn Thân Cứng';
        v_stage2_unlocked := true;
    ELSIF v_new_exp >= 150 THEN
        v_new_level := 2;
        v_new_rank := 'Bạn Bè Xã Giao';
        v_stage2_unlocked := v_profile.is_stage2_unlocked;
    ELSE
        v_new_level := 1;
        v_new_rank := 'Tân Thủ Khám Phá';
        v_stage2_unlocked := v_profile.is_stage2_unlocked;
    END IF;

    -- Cập nhật dữ liệu người chơi
    UPDATE public.game_profiles
    SET
        exp = v_new_exp,
        coins = v_new_coins,
        level = v_new_level,
        rank_title = v_new_rank,
        is_stage2_unlocked = v_stage2_unlocked,
        unlocked_map_nodes = v_map_nodes,
        updated_at = now()
    WHERE user_id = v_user_id;

    RETURN jsonb_build_object(
        'is_correct', v_is_correct,
        'exp_earned', v_exp_earned,
        'coins_earned', v_coins_earned,
        'secret_memory_text', v_secret_text,
        'secret_image_url', CASE WHEN v_is_correct THEN v_q.secret_image_url ELSE NULL END,
        'current_exp', v_new_exp,
        'current_coins', v_new_coins,
        'current_level', v_new_level,
        'rank_title', v_new_rank,
        'is_stage2_unlocked', v_stage2_unlocked
    );
END;
$$;

-- FUNCTION 5: ĐỔI VOUCHER AN TOÀN TRỪ COINS TRONG TRANSACTION
CREATE OR REPLACE FUNCTION public.rpc_redeem_voucher(p_voucher_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_v RECORD;
    v_profile RECORD;
    v_code TEXT;
    v_voucher_user_id UUID;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Vui lòng đăng nhập để đổi quà.';
    END IF;

    -- Lấy thông tin voucher
    SELECT * INTO v_v FROM public.vouchers WHERE id = p_voucher_id AND is_active = true;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Voucher không tồn tại hoặc đã ngừng áp dụng.';
    END IF;

    -- Kiểm tra số dư coin của người chơi
    SELECT * INTO v_profile FROM public.game_profiles WHERE user_id = v_user_id;
    IF v_profile.coins < v_v.cost_coins THEN
        RAISE EXCEPTION 'Bạn không đủ Coins để đổi phần quà này (Cần % Coins, hiện có % Coins).', v_v.cost_coins, v_profile.coins;
    END IF;

    -- Sinh mã voucher duy nhất, ví dụ: COFFEE-DA-X79K2
    v_code := v_v.voucher_prefix || '-DA-' || upper(substr(encode(gen_random_bytes(3), 'hex'), 1, 5));

    -- Trừ coin
    UPDATE public.game_profiles
    SET coins = coins - v_v.cost_coins, updated_at = now()
    WHERE user_id = v_user_id;

    -- Thêm vào kho voucher của người chơi
    INSERT INTO public.user_vouchers (user_id, voucher_id, voucher_code, status)
    VALUES (v_user_id, v_v.id, v_code, 'active')
    RETURNING id INTO v_voucher_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Đổi voucher thành công! Hãy xuất trình mã này khi gặp Đông Anh.',
        'user_voucher_id', v_voucher_user_id,
        'voucher_code', v_code,
        'remaining_coins', v_profile.coins - v_v.cost_coins
    );
END;
$$;

-- FUNCTION 6: XÁC NHẬN SỬ DỤNG VOUCHER (CHỐNG DÙNG LẦN 2)
CREATE OR REPLACE FUNCTION public.rpc_use_voucher(p_user_voucher_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_uv RECORD;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Yêu cầu đăng nhập.';
    END IF;

    SELECT * INTO v_uv FROM public.user_vouchers WHERE id = p_user_voucher_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Mã voucher không tồn tại.';
    END IF;

    IF v_uv.user_id != v_user_id AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Bạn không sở hữu voucher này.';
    END IF;

    IF v_uv.status = 'used' THEN
        RAISE EXCEPTION 'Voucher này đã được sử dụng trước đó vào lúc %! Không thể dùng lần 2.', v_uv.used_at;
    END IF;

    -- Chuyển trạng thái sang đã sử dụng
    UPDATE public.user_vouchers
    SET status = 'used', used_at = now()
    WHERE id = p_user_voucher_id;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Chúc mừng bạn! Voucher đã được sử dụng thành công.'
    );
END;
$$;

-- ==============================================================================
-- 5. SEED DATA KHỞI TẠO (DỰ ÁN MẪU, CÂU HỎI MẪU & VOUCHERS MẪU)
-- ==============================================================================

-- 5.1 DỰ ÁN MẪU
INSERT INTO public.projects (title, summary, description, tags, demo_link, github_link, metrics, order_index)
VALUES
(
    'Dual-Mode Portfolio & Q&A Arcade',
    'Nền tảng kép kết hợp Portfolio kỹ sư công nghệ với hệ thống Gamified Q&A tích điểm đổi voucher.',
    'Xây dựng với React 19, Tailwind CSS v4, Framer Motion và cơ sở dữ liệu Supabase PostgreSQL. Tích hợp Row Level Security, chống gian lận kiểm tra đáp án server-side RPC.',
    ARRAY['React 19', 'Tailwind v4', 'Supabase', 'Framer Motion'],
    'https://portfolio-donganh.dev',
    'https://github.com/donganh164/portfolio_donganh',
    'Lighthouse 100/100 • 60fps Physics',
    1
),
(
    'Enterprise Data Cloud & Auth RBAC',
    'Hệ thống quản lý dữ liệu lớn với kiến trúc bảo mật nhiều lớp, phân quyền granular và OAuth 2.0.',
    'Tự động đồng bộ tài khoản Google OAuth qua Database Trigger, xử lý transaction nguyên tử chống xung đột số dư.',
    ARRAY['PostgreSQL', 'Row Level Security', 'Database RPC', 'OAuth 2.0'],
    'https://demo.donganh.dev',
    'https://github.com/donganh164/enterprise-data-cloud',
    'Tốc độ truy vấn < 50ms',
    2
)
ON CONFLICT DO NOTHING;

-- 5.2 CÂU HỎI GIAI ĐOẠN 1 (THÔNG TIN CƠ BẢN VỀ ĐÔNG ANH)
INSERT INTO public.questions (stage, location_tag, location_name, question_text, options, correct_option_index, exp_reward, coins_reward, hint, secret_memory_text, order_index)
VALUES
(
    1,
    NULL,
    'Khởi Động',
    'Ngôn ngữ và hệ sinh thái lập trình mà Đông Anh yêu thích và gắn bó sâu sắc nhất hiện tại là gì?',
    '["Python & Django", "JavaScript / TypeScript & React", "PHP & Laravel", "Java & Spring Boot"]'::jsonb,
    1,
    100,
    10,
    'Nền tảng của dự án web portfolio này chính là một gợi ý!',
    'Đông Anh đã dành hàng nghìn giờ chuyên sâu với React và hệ sinh thái JavaScript hiện đại để xây dựng các sản phẩm mượt mà, trực quan nhất.',
    1
),
(
    1,
    NULL,
    'Khởi Động',
    'Khi bắt tay vào phát triển một ứng dụng mới, triết lý kỹ thuật nào được Đông Anh đặt lên hàng đầu?',
    '["Viết thật nhanh không cần tối ưu", "Trải nghiệm người dùng mượt mà & Mã nguồn sạch (Clean Code)", "Chỉ tập trung vào giao diện", "Dùng càng nhiều thư viện ngoài càng tốt"]'::jsonb,
    1,
    100,
    10,
    'Chất lượng và sự bền vững luôn quan trọng hơn sự vội vàng.',
    'Đông Anh luôn ưu tiên hiệu năng 60fps, kiến trúc mô-đun hóa dễ bảo trì và trải nghiệm tương tác chân thực cho người dùng.',
    2
)
ON CONFLICT DO NOTHING;

-- 5.3 CÂU HỎI GIAI ĐOẠN 2 (BẢN ĐỒ VIỆT NAM & CÁC CỘT MỐC CUỘC ĐỜI)
INSERT INTO public.questions (stage, location_tag, location_name, question_text, options, correct_option_index, exp_reward, coins_reward, hint, secret_memory_text, order_index)
VALUES
(
    2,
    'hanoi',
    'Hà Nội - Những Năm Tháng Khởi Đầu',
    'Cột mốc đáng nhớ nhất của Đông Anh khi học tập và bắt đầu làm quen với lập trình tại Hà Nội là gì?',
    '["Tự build dự án cá nhân đầu tiên và thức trắng đêm fix bug", "Đi lạc ở hồ Gươm", "Bỏ học đi chơi game", "Thi trượt môn lập trình cơ sở"]'::jsonb,
    0,
    150,
    20,
    'Cảm giác nhìn thấy dòng code đầu tiên chạy thành công trên màn hình.',
    'Kỷ niệm thức trắng đêm tại Hà Nội để gõ dòng lệnh đầu tiên và chứng kiến trang web hoạt động là khoảnh khắc Đông Anh nhận ra đam mê trọn đời của mình với ngành kỹ thuật phần mềm.',
    1
),
(
    2,
    'danang',
    'Đà Nẵng - Cột Mốc Mở Rộng Chân Trời',
    'Đông Anh ấn tượng nhất với điều gì trong những chuyến đi và trải nghiệm làm việc tại Đà Nẵng?',
    '["Những cây cầu lung linh và không gian làm việc công nghệ cởi mở", "Bị say sóng", "Thời tiết mưa bão", "Quên đem laptop"]'::jsonb,
    0,
    150,
    20,
    'Thành phố đáng sống với nhịp sống năng động và công nghệ phát triển.',
    'Chuyến đi Đà Nẵng đã tiếp thêm cho Đông Anh nguồn cảm hứng sáng tạo dồi dào, từ đó định hình phong cách thiết kế sản phẩm vừa hiện đại vừa thân thiện.',
    2
),
(
    2,
    'saigon',
    'TP. Hồ Chí Minh - Nhịp Sống Đột Phá',
    'Mục tiêu nghề nghiệp lớn nhất mà Đông Anh hướng tới khi tiếp cận các dự án quy mô tại TP. Hồ Chí Minh là gì?',
    '["Xây dựng những sản phẩm công nghệ có tác động thực tế tới hàng nghìn người dùng", "Chỉ làm việc từ xa", "Thử nghiệm mọi quán cà phê", "Không có mục tiêu cụ thể"]'::jsonb,
    0,
    150,
    20,
    'Giá trị thực tế và chỉ số người dùng tạo ra.',
    'Đông Anh luôn khao khát ứng dụng công nghệ để giải quyết các bài toán đời sống thực tế, tối ưu hóa quy trình và mang lại giá trị cao nhất cho cộng đồng.',
    3
)
ON CONFLICT DO NOTHING;

-- 5.4 DANH MỤC VOUCHER ĐỔI THƯỞNG
INSERT INTO public.vouchers (title, description, cost_coins, icon, voucher_prefix)
VALUES
(
    '1 Ly Cà Phê Highlands / Phúc Long',
    'Đổi voucher này để được Đông Anh mời 1 ly cà phê hoặc trà sữa tùy chọn khi hẹn gặp ngoài đời.',
    30,
    'coffee',
    'COFFEE'
),
(
    '1 Bữa Trưa Thân Mật Bao Trọn',
    'Đổi voucher này để được Đông Anh bao trọn gói 1 bữa trưa giao lưu thân mật cùng trò chuyện.',
    60,
    'utensils',
    'LUNCH'
),
(
    '1 Suất Review Code & Hỗ Trợ Task',
    'Đông Anh sẽ dành 2 giờ 1-on-1 cùng bạn review mã nguồn, gỡ bug hoặc hỗ trợ định hướng kỹ thuật.',
    50,
    'code',
    'REVIEW'
),
(
    '1 Lần Nhờ Vả Việc Bất Kỳ',
    'Đông Anh cam kết hỗ trợ bạn 1 công việc trong khả năng (chuyển đồ, tư vấn công nghệ, giải cứu deadline).',
    100,
    'gift',
    'FAVOR'
)
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- HOÀN TẤT THIẾT KẾ CƠ SỞ DỮ LIỆU!
-- ==============================================================================

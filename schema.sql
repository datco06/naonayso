-- ============================================================
--  NÃO NẢY SỐ — Supabase Schema
--  Chạy file này trong Supabase > SQL Editor
-- ============================================================

-- 1. Tạo bảng leaderboard
CREATE TABLE IF NOT EXISTS leaderboard (
  id        uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name      text        NOT NULL,
  score     integer     DEFAULT 0,
  correct   integer     DEFAULT 0,
  total     integer     DEFAULT 0,
  max_combo integer     DEFAULT 0,
  date      timestamptz DEFAULT now()
);

-- 2. Bật Row Level Security
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- 3. Policy: cho phép MỌI NGƯỜI đọc bảng xếp hạng
CREATE POLICY "public_read_leaderboard"
  ON leaderboard
  FOR SELECT
  USING (true);

-- 4. Policy: cho phép MỌI NGƯỜI thêm điểm
CREATE POLICY "public_insert_leaderboard"
  ON leaderboard
  FOR INSERT
  WITH CHECK (true);

-- 5. Index để query nhanh hơn
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard (score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_date  ON leaderboard (date  DESC);

-- Add JTB genre categories to hospitals
-- These correspond to the official JTB Medical & Healthcare category system:
-- 健診, 治療, 透析, 歯科, 眼科, 整形外科, 美容, 再生医療, 免疫療法, 粒子線,
-- コンサルティング, その他, 内科, 外科, iPS エクソソーム, 小児科, オンライン診療・往診

ALTER TABLE jtb_hospitals
  ADD COLUMN IF NOT EXISTS jtb_genres TEXT[] DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_jtb_hospitals_jtb_genres ON jtb_hospitals USING GIN(jtb_genres);

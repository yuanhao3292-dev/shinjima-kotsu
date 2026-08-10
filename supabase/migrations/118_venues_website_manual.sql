-- =====================================================
-- 118: venues 官网补充(117 未命中的手工补齐)
-- =====================================================
-- 117 里 3 家因 fankura 现目录已无而留空。逐家网搜后确认了其中 2 家的独立官网
-- (地址/电话核对一致),补上。剩 D2(大阪·心斎橋筋2-1-8 藤田ビル2F)网上唯一的
-- d2-minami.com 实为另一家(宗右衛門町的 bar,地址不符),故仍留空,不误链。
-- 至此 148/149 有官网。
--
-- ⚠️ 本项目无迁移自动跟踪,需手动在生产库执行本文件。

UPDATE venues SET website_url = 'https://www.amaclub-nakasu.com/' WHERE name = 'エマクラブ 中洲';
UPDATE venues SET website_url = 'https://www.club-mersaison.com/' WHERE name = 'メルセゾン';

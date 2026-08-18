-- 123: 移除「健康故事社区」三张表
--
-- 背景：091 建的 health_stories / story_helpful_votes / health_articles
-- 对应的功能是半成品 —— /community 页面没有任何站内入口、投稿页
-- (/community/submit) 从未实现、health_articles 与 story_helpful_votes
-- 代码里从未引用。2026-08-18 已把页面与 API 一并从仓库删除。
--
-- 执行前核对过线上：三张表均为 0 行（content-range: */0）。
-- 如果日后要做健康内容/社区，重新按当时的需求建表，不必沿用这份结构。

DROP TABLE IF EXISTS story_helpful_votes;
DROP TABLE IF EXISTS health_articles;
DROP TABLE IF EXISTS health_stories;

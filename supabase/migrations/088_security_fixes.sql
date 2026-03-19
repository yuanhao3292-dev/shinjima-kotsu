-- 088: Fix security issues flagged by Supabase Security Advisor
-- Enable RLS on all tables that were missing it

-- subscription_plans: public config, read-only
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subscription_plans_public_read" ON subscription_plans FOR SELECT USING (true);
CREATE POLICY "subscription_plans_service_write" ON subscription_plans FOR ALL USING (auth.role() = 'service_role');

-- ui_color_themes: public config, read-only
ALTER TABLE ui_color_themes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ui_color_themes_public_read" ON ui_color_themes FOR SELECT USING (true);
CREATE POLICY "ui_color_themes_service_write" ON ui_color_themes FOR ALL USING (auth.role() = 'service_role');

-- audit_logs: sensitive, service_role only
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit_logs_service_only" ON audit_logs FOR ALL USING (auth.role() = 'service_role');

-- tier_reset_logs: sensitive, service_role only
ALTER TABLE tier_reset_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tier_reset_logs_service_only" ON tier_reset_logs FOR ALL USING (auth.role() = 'service_role');

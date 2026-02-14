-- =============================================
-- Error Detection & Auto-Fix System
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. System Errors Table
CREATE TABLE IF NOT EXISTS system_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    error_code TEXT,
    error_message TEXT NOT NULL,
    error_details JSONB,
    source TEXT,
    severity TEXT DEFAULT 'error' CHECK (severity IN ('warning', 'error', 'critical')),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'analyzed', 'fixed', 'ignored')),
    ai_analysis TEXT,
    suggested_sql TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES auth.users(id)
);

-- 2. Schema Fixes Table
CREATE TABLE IF NOT EXISTS schema_fixes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    error_id UUID REFERENCES system_errors(id) ON DELETE CASCADE,
    sql_command TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'failed', 'rejected')),
    applied_at TIMESTAMP WITH TIME ZONE,
    applied_by UUID REFERENCES auth.users(id),
    result_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_system_errors_status ON system_errors(status);
CREATE INDEX IF NOT EXISTS idx_system_errors_created ON system_errors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_schema_fixes_error ON schema_fixes(error_id);

-- 4. Enable RLS
ALTER TABLE system_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE schema_fixes ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies (authenticated users only)
CREATE POLICY "Authenticated users can view system_errors" ON system_errors
    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert system_errors" ON system_errors
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update system_errors" ON system_errors
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view schema_fixes" ON schema_fixes
    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert schema_fixes" ON schema_fixes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update schema_fixes" ON schema_fixes
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 6. Enable realtime for system_errors
ALTER PUBLICATION supabase_realtime ADD TABLE system_errors;

-- 7. Secure SQL execution function
CREATE OR REPLACE FUNCTION exec_admin_sql(sql_command TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Block dangerous operations
    IF sql_command ~* '^\s*(DROP\s+DATABASE|DROP\s+SCHEMA|TRUNCATE)' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Blocked: DROP DATABASE, DROP SCHEMA, and TRUNCATE are not allowed.'
        );
    END IF;

    EXECUTE sql_command;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'SQL executed successfully'
    );
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'error', SQLERRM,
        'detail', SQLSTATE
    );
END;
$$;

-- Restrict function to authenticated users only
REVOKE ALL ON FUNCTION exec_admin_sql(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION exec_admin_sql(TEXT) TO authenticated;

-- 8. Seed gemini_api_key setting
INSERT INTO settings (setting_key, setting_type, description)
VALUES ('gemini_api_key', 'api_key', 'Google Gemini API key for error analysis')
ON CONFLICT (setting_key) DO NOTHING;

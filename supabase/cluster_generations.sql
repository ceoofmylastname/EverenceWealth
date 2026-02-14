-- =============================================
-- Cluster Generation Job Tracking
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Cluster Generations Table
CREATE TABLE IF NOT EXISTS cluster_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cluster_id UUID REFERENCES clusters(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'partial')) DEFAULT 'pending',
    topic TEXT NOT NULL,
    primary_keyword TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    language TEXT DEFAULT 'en',
    total_articles INTEGER DEFAULT 6,
    completed_articles INTEGER DEFAULT 0,
    user_id UUID,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_cluster_generations_cluster ON cluster_generations(cluster_id);
CREATE INDEX IF NOT EXISTS idx_cluster_generations_status ON cluster_generations(status);

-- 3. Enable RLS
ALTER TABLE cluster_generations ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Authenticated users can view cluster_generations" ON cluster_generations
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert cluster_generations" ON cluster_generations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update cluster_generations" ON cluster_generations
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 5. Enable realtime for progress tracking
ALTER PUBLICATION supabase_realtime ADD TABLE cluster_generations;

-- 6. Atomic increment function (prevents race conditions with parallel chunk execution)
CREATE OR REPLACE FUNCTION increment_completed_articles(gen_id UUID)
RETURNS TABLE(new_count INTEGER, is_complete BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_new_count INTEGER;
    v_total INTEGER;
BEGIN
    UPDATE cluster_generations
    SET completed_articles = completed_articles + 1,
        last_heartbeat = NOW()
    WHERE id = gen_id
    RETURNING completed_articles, total_articles
    INTO v_new_count, v_total;

    new_count := v_new_count;
    is_complete := (v_new_count >= v_total);

    IF is_complete THEN
        UPDATE cluster_generations
        SET status = 'completed', completed_at = NOW()
        WHERE id = gen_id;
    END IF;

    RETURN NEXT;
END;
$$;

-- Restrict function to authenticated users + service role
REVOKE ALL ON FUNCTION increment_completed_articles(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION increment_completed_articles(UUID) TO authenticated;

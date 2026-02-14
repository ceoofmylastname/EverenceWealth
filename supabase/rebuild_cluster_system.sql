-- ============================================================================
-- CLUSTER GENERATION SYSTEM REBUILD
-- ============================================================================
-- Run this in Supabase SQL Editor
-- This drops and recreates cluster-related tables with the new schema
-- NOTE: Does NOT touch settings, admin_users, system_errors, schema_fixes
-- ============================================================================

-- DROP EXISTING CLUSTER TABLES (order matters for foreign keys)
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS cluster_generations CASCADE;
DROP TABLE IF EXISTS clusters CASCADE;
DROP FUNCTION IF EXISTS increment_completed_articles(UUID);

-- ============================================================================
-- CREATE CLUSTERS TABLE
-- ============================================================================
CREATE TABLE clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    topic TEXT,
    keywords TEXT,
    target_audience TEXT,
    status TEXT CHECK (status IN ('draft', 'generating', 'active', 'archived')) DEFAULT 'draft',
    content_count INTEGER DEFAULT 0,
    en_count INTEGER DEFAULT 0,
    es_count INTEGER DEFAULT 0,
    required_content_count INTEGER DEFAULT 12,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CREATE CLUSTER GENERATIONS TABLE (Job Tracker)
-- ============================================================================
CREATE TABLE cluster_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cluster_id UUID REFERENCES clusters(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
    topic TEXT NOT NULL,
    primary_keyword TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    language TEXT DEFAULT 'en',
    total_articles INTEGER DEFAULT 6,
    completed_articles INTEGER DEFAULT 0,
    user_id UUID,
    error_message TEXT,
    last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CREATE BLOG POSTS TABLE
-- ============================================================================
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cluster_id UUID NOT NULL REFERENCES clusters(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content TEXT,
    language TEXT CHECK (language IN ('en', 'es')) NOT NULL DEFAULT 'en',
    funnel_stage TEXT CHECK (funnel_stage IN ('tofu', 'mofu', 'bofu')),
    funnel_position INTEGER,
    keywords TEXT,
    status TEXT DEFAULT 'draft',
    word_count INTEGER DEFAULT 0,
    reading_time INTEGER DEFAULT 0,
    meta_title TEXT,
    meta_description TEXT,
    hreflang_group_id UUID,
    translations JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cluster_id, language, slug)
);

-- ============================================================================
-- ATOMIC INCREMENT FUNCTION (for parallel chunk completion tracking)
-- ============================================================================
CREATE OR REPLACE FUNCTION increment_completed_articles(gen_id UUID)
RETURNS TABLE(new_count INTEGER, is_complete BOOLEAN)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_new_count INTEGER;
    v_total INTEGER;
BEGIN
    UPDATE cluster_generations
    SET completed_articles = completed_articles + 1,
        last_heartbeat = NOW()
    WHERE id = gen_id
    RETURNING completed_articles, total_articles INTO v_new_count, v_total;

    new_count := v_new_count;
    is_complete := (v_new_count >= v_total);

    IF is_complete THEN
        UPDATE cluster_generations
        SET status = 'completed'
        WHERE id = gen_id;
    END IF;

    RETURN NEXT;
END;
$$;

-- ============================================================================
-- ENABLE REALTIME on cluster_generations for progress tracking
-- ============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE cluster_generations;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluster_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage clusters" ON clusters
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage generations" ON cluster_generations
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage posts" ON blog_posts
    FOR ALL USING (auth.role() = 'authenticated');

-- Public read access for published blog posts (needed for public blog pages)
CREATE POLICY "Public can view published posts" ON blog_posts
    FOR SELECT TO anon USING (status = 'published');

-- Service role bypass (for internal chunk handler)
CREATE POLICY "Service role full access clusters" ON clusters
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access generations" ON cluster_generations
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access posts" ON blog_posts
    FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_clusters_status ON clusters(status);
CREATE INDEX idx_clusters_slug ON clusters(slug);
CREATE INDEX idx_blog_posts_cluster ON blog_posts(cluster_id);
CREATE INDEX idx_blog_posts_language ON blog_posts(language);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_cluster_gen_status ON cluster_generations(status);
CREATE INDEX idx_cluster_gen_cluster ON cluster_generations(cluster_id);

-- ============================================================================
-- VERIFY
-- ============================================================================
-- Run this to confirm:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name IN ('clusters', 'cluster_generations', 'blog_posts', 'settings');

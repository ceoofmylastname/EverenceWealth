-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id), -- Link to Supabase Auth User
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type TEXT CHECK (setting_type IN ('text', 'api_key', 'prompt')),
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create clusters table
CREATE TABLE IF NOT EXISTS clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  topic TEXT NOT NULL,
  target_audience TEXT,
  keywords TEXT[],
  funnel_strategy TEXT DEFAULT '3-2-1', -- 3 TOFU, 2 MOFU, 1 BOFU
  content_count INTEGER DEFAULT 0,
  required_content_count INTEGER DEFAULT 6,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id UUID REFERENCES clusters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT, -- HTML content
  meta_description TEXT,
  featured_image TEXT,
  funnel_stage TEXT CHECK (funnel_stage IN ('tofu', 'mofu', 'bofu')),
  funnel_position INTEGER, -- 1, 2, 3 for TOFU; 1, 2 for MOFU; 1 for BOFU
  parent_article_id UUID REFERENCES blog_posts(id), -- MOFU/BOFU link to parent
  leads_to_article_ids UUID[], -- Track downstream articles
  keywords TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'review', 'published')),
  views INTEGER DEFAULT 0,
  reading_time INTEGER, -- in minutes
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_funnel ON blog_posts(cluster_id, funnel_stage, funnel_position);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_clusters_slug ON clusters(slug);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies for admin_users
CREATE POLICY "Admins can view all admin profiles" ON admin_users
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update their own profile" ON admin_users
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for settings
CREATE POLICY "Admins can view settings" ON settings
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update settings" ON settings
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert settings" ON settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policies for clusters (public read for published)
CREATE POLICY "Public can view published clusters" ON clusters
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can view all clusters" ON clusters
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update clusters" ON clusters
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert clusters" ON clusters
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete clusters" ON clusters
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for blog_posts (public read for published posts)
CREATE POLICY "Public can view published blog_posts" ON blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can view all blog_posts" ON blog_posts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update blog_posts" ON blog_posts
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert blog_posts" ON blog_posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete blog_posts" ON blog_posts
  FOR DELETE USING (auth.role() = 'authenticated');


-- Initial Settings
INSERT INTO settings (setting_key, setting_type, description) VALUES
  ('master_prompt', 'prompt', 'Master content generation prompt'),
  ('fal_api_key', 'api_key', 'Fal.ai API key for image generation'),
  ('perplexity_api_key', 'api_key', 'Perplexity API key for research'),
  ('openai_api_key', 'api_key', 'OpenAI API key for content writing'),
  ('site_base_url', 'text', 'Base URL for canonical links'),
  ('default_author', 'text', 'Default author name for blog posts')
ON CONFLICT (setting_key) DO NOTHING;

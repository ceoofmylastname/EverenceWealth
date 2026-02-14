-- ============================================================
-- Migration 002: Portal Tables
-- Adds 10 tables for admin, advisor, and client portals + CMS
-- Handles existing advisors/leads tables via ALTER TABLE
-- ============================================================

-- ============================================================
-- TABLE 1: ADVISORS (exists — add missing columns)
-- Existing columns: id, first_name, last_name, email, status, created_at
-- ============================================================
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS license_number TEXT;
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS specialties TEXT[];
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS territories TEXT[];
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS calendar_url TEXT;
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS metrics JSONB DEFAULT '{"leads_claimed": 0, "clients_active": 0, "revenue_ytd": 0}';
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_advisors_status ON advisors(status);
CREATE INDEX IF NOT EXISTS idx_advisors_user ON advisors(user_id);
CREATE INDEX IF NOT EXISTS idx_advisors_email ON advisors(email);

-- ============================================================
-- TABLE 2: LEADS (exists — add missing columns)
-- Existing columns: id, source_cluster_id, source_content_id, language,
--                   first_name, last_name, email, phone, status, created_at
-- ============================================================
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source_type TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS age_range TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS retirement_assets_range TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS primary_concern TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS interest_level TEXT DEFAULT 'warm';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS assigned_advisor_id UUID REFERENCES advisors(id);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contacted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS qualified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS converted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes JSONB DEFAULT '[]';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add check constraints (only if not already present)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'leads_source_type_check'
    ) THEN
        ALTER TABLE leads ADD CONSTRAINT leads_source_type_check
            CHECK (source_type IN ('blog', 'landing_page', 'workshop', 'referral', 'manual'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'leads_interest_level_check'
    ) THEN
        ALTER TABLE leads ADD CONSTRAINT leads_interest_level_check
            CHECK (interest_level IN ('hot', 'warm', 'cold'));
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_advisor ON leads(assigned_advisor_id);
CREATE INDEX IF NOT EXISTS idx_leads_source_cluster ON leads(source_cluster_id);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- ============================================================
-- TABLE 3: CLIENTS (new)
-- ============================================================
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id),
    advisor_id UUID REFERENCES advisors(id) NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    address JSONB,
    status TEXT CHECK (status IN ('active', 'inactive', 'archived')) DEFAULT 'active',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    portal_access_enabled BOOLEAN DEFAULT FALSE,
    total_assets DECIMAL(15,2),
    annual_income DECIMAL(15,2),
    risk_tolerance TEXT CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
    documents JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_advisor ON clients(advisor_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

-- ============================================================
-- TABLE 4: APPOINTMENTS (new)
-- ============================================================
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    advisor_id UUID REFERENCES advisors(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('fna', 'review', 'follow-up', 'onboarding')) NOT NULL,
    status TEXT CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show')) DEFAULT 'scheduled',
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    meeting_url TEXT,
    notes TEXT,
    agenda JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_advisor ON appointments(advisor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled ON appointments(scheduled_at);

-- ============================================================
-- TABLE 5: MESSAGES (new)
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_type TEXT CHECK (sender_type IN ('advisor', 'client', 'admin')) NOT NULL,
    sender_id UUID NOT NULL,
    recipient_type TEXT CHECK (recipient_type IN ('advisor', 'client', 'admin')) NOT NULL,
    recipient_id UUID NOT NULL,
    subject TEXT,
    body TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id, recipient_type);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id, sender_type);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);

-- ============================================================
-- TABLE 6: TASKS (new)
-- ============================================================
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    advisor_id UUID REFERENCES advisors(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    status TEXT CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')) DEFAULT 'pending',
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_advisor ON tasks(advisor_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due ON tasks(due_date);

-- ============================================================
-- TABLE 7: LANDING_PAGES (new)
-- ============================================================
CREATE TABLE IF NOT EXISTS landing_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    template TEXT CHECK (template IN ('killers', 'indexed', 'taxes', 'workshop', 'custom')),
    headline TEXT NOT NULL,
    subheadline TEXT,
    hero_image_url TEXT,
    content JSONB,
    cta_text TEXT DEFAULT 'Schedule Financial Needs Assessment',
    cta_url TEXT DEFAULT '/#contact',
    status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
    views INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_landing_pages_status ON landing_pages(status);
CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON landing_pages(slug);

-- ============================================================
-- TABLE 8: QA_PAGES (new)
-- ============================================================
CREATE TABLE IF NOT EXISTS qa_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cluster_id UUID REFERENCES clusters(id) ON DELETE CASCADE,
    parent_article_id UUID REFERENCES blog_posts(id) ON DELETE SET NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    language TEXT CHECK (language IN ('en', 'es')) DEFAULT 'en',
    speakable TEXT,
    status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qa_pages_cluster ON qa_pages(cluster_id);
CREATE INDEX IF NOT EXISTS idx_qa_pages_status ON qa_pages(status);
CREATE INDEX IF NOT EXISTS idx_qa_pages_language ON qa_pages(language);
CREATE INDEX IF NOT EXISTS idx_qa_pages_slug ON qa_pages(slug);

-- ============================================================
-- TABLE 9: WORKSHOPS (new)
-- ============================================================
CREATE TABLE IF NOT EXISTS workshops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    instructor_advisor_id UUID REFERENCES advisors(id),
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 90,
    max_attendees INTEGER DEFAULT 50,
    current_attendees INTEGER DEFAULT 0,
    meeting_url TEXT,
    status TEXT CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')) DEFAULT 'scheduled',
    recording_url TEXT,
    materials JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshops_scheduled ON workshops(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_workshops_status ON workshops(status);

-- ============================================================
-- TABLE 10: WORKSHOP_REGISTRATIONS (new)
-- ============================================================
CREATE TABLE IF NOT EXISTS workshop_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    attended BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshop_regs_workshop ON workshop_registrations(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_regs_email ON workshop_registrations(email);

-- ============================================================
-- REALTIME: Enable for real-time tables
-- (Use DO block to handle "already added" errors gracefully)
-- ============================================================
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE leads;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE messages;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
END $$;

-- ============================================================
-- ROW LEVEL SECURITY: Enable on all tables
-- ============================================================
ALTER TABLE advisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_registrations ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES: Admin full access
-- (DROP IF EXISTS then recreate to ensure clean state)
-- ============================================================
DROP POLICY IF EXISTS "Admins full access advisors" ON advisors;
CREATE POLICY "Admins full access advisors" ON advisors
    FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users));

DROP POLICY IF EXISTS "Admins full access leads" ON leads;
CREATE POLICY "Admins full access leads" ON leads
    FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users));

DROP POLICY IF EXISTS "Admins full access clients" ON clients;
CREATE POLICY "Admins full access clients" ON clients
    FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users));

DROP POLICY IF EXISTS "Admins full access appointments" ON appointments;
CREATE POLICY "Admins full access appointments" ON appointments
    FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users));

DROP POLICY IF EXISTS "Admins full access messages" ON messages;
CREATE POLICY "Admins full access messages" ON messages
    FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users));

DROP POLICY IF EXISTS "Admins full access tasks" ON tasks;
CREATE POLICY "Admins full access tasks" ON tasks
    FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users));

DROP POLICY IF EXISTS "Admins full access landing_pages" ON landing_pages;
CREATE POLICY "Admins full access landing_pages" ON landing_pages
    FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users));

DROP POLICY IF EXISTS "Admins full access qa_pages" ON qa_pages;
CREATE POLICY "Admins full access qa_pages" ON qa_pages
    FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users));

DROP POLICY IF EXISTS "Admins full access workshops" ON workshops;
CREATE POLICY "Admins full access workshops" ON workshops
    FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users));

DROP POLICY IF EXISTS "Admins full access workshop_registrations" ON workshop_registrations;
CREATE POLICY "Admins full access workshop_registrations" ON workshop_registrations
    FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- ============================================================
-- RLS POLICIES: Advisor access
-- ============================================================
DROP POLICY IF EXISTS "Advisors read own profile" ON advisors;
CREATE POLICY "Advisors read own profile" ON advisors
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Advisors update own profile" ON advisors;
CREATE POLICY "Advisors update own profile" ON advisors
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Advisors read assigned leads" ON leads;
CREATE POLICY "Advisors read assigned leads" ON leads
    FOR SELECT USING (auth.uid() IN (
        SELECT user_id FROM advisors WHERE id = assigned_advisor_id
    ));

DROP POLICY IF EXISTS "Advisors update assigned leads" ON leads;
CREATE POLICY "Advisors update assigned leads" ON leads
    FOR UPDATE USING (auth.uid() IN (
        SELECT user_id FROM advisors WHERE id = assigned_advisor_id
    ));

DROP POLICY IF EXISTS "Advisors read their clients" ON clients;
CREATE POLICY "Advisors read their clients" ON clients
    FOR SELECT USING (auth.uid() IN (
        SELECT user_id FROM advisors WHERE id = advisor_id
    ));

DROP POLICY IF EXISTS "Advisors update their clients" ON clients;
CREATE POLICY "Advisors update their clients" ON clients
    FOR UPDATE USING (auth.uid() IN (
        SELECT user_id FROM advisors WHERE id = advisor_id
    ));

DROP POLICY IF EXISTS "Advisors read their appointments" ON appointments;
CREATE POLICY "Advisors read their appointments" ON appointments
    FOR SELECT USING (auth.uid() IN (
        SELECT user_id FROM advisors WHERE id = advisor_id
    ));

DROP POLICY IF EXISTS "Advisors manage their appointments" ON appointments;
CREATE POLICY "Advisors manage their appointments" ON appointments
    FOR ALL USING (auth.uid() IN (
        SELECT user_id FROM advisors WHERE id = advisor_id
    ));

DROP POLICY IF EXISTS "Advisors read their messages" ON messages;
CREATE POLICY "Advisors read their messages" ON messages
    FOR SELECT USING (
        (sender_type = 'advisor' AND auth.uid() IN (
            SELECT user_id FROM advisors WHERE id = sender_id
        ))
        OR
        (recipient_type = 'advisor' AND auth.uid() IN (
            SELECT user_id FROM advisors WHERE id = recipient_id
        ))
    );

DROP POLICY IF EXISTS "Advisors send messages" ON messages;
CREATE POLICY "Advisors send messages" ON messages
    FOR INSERT WITH CHECK (
        sender_type = 'advisor' AND auth.uid() IN (
            SELECT user_id FROM advisors WHERE id = sender_id
        )
    );

DROP POLICY IF EXISTS "Advisors read their tasks" ON tasks;
CREATE POLICY "Advisors read their tasks" ON tasks
    FOR SELECT USING (auth.uid() IN (
        SELECT user_id FROM advisors WHERE id = advisor_id
    ));

DROP POLICY IF EXISTS "Advisors manage their tasks" ON tasks;
CREATE POLICY "Advisors manage their tasks" ON tasks
    FOR ALL USING (auth.uid() IN (
        SELECT user_id FROM advisors WHERE id = advisor_id
    ));

DROP POLICY IF EXISTS "Advisors read their workshops" ON workshops;
CREATE POLICY "Advisors read their workshops" ON workshops
    FOR SELECT USING (auth.uid() IN (
        SELECT user_id FROM advisors WHERE id = instructor_advisor_id
    ));

-- ============================================================
-- RLS POLICIES: Client access
-- ============================================================
DROP POLICY IF EXISTS "Clients read own profile" ON clients;
CREATE POLICY "Clients read own profile" ON clients
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Clients read own appointments" ON appointments;
CREATE POLICY "Clients read own appointments" ON appointments
    FOR SELECT USING (auth.uid() IN (
        SELECT user_id FROM clients WHERE id = client_id
    ));

DROP POLICY IF EXISTS "Clients read own messages" ON messages;
CREATE POLICY "Clients read own messages" ON messages
    FOR SELECT USING (
        (recipient_type = 'client' AND auth.uid() IN (
            SELECT user_id FROM clients WHERE id = recipient_id
        ))
        OR
        (sender_type = 'client' AND auth.uid() IN (
            SELECT user_id FROM clients WHERE id = sender_id
        ))
    );

DROP POLICY IF EXISTS "Clients send messages" ON messages;
CREATE POLICY "Clients send messages" ON messages
    FOR INSERT WITH CHECK (
        sender_type = 'client' AND auth.uid() IN (
            SELECT user_id FROM clients WHERE id = sender_id
        )
    );

DROP POLICY IF EXISTS "Clients read own tasks" ON tasks;
CREATE POLICY "Clients read own tasks" ON tasks
    FOR SELECT USING (auth.uid() IN (
        SELECT user_id FROM clients WHERE id = client_id
    ));

-- ============================================================
-- RLS POLICIES: Public access for published content
-- ============================================================
DROP POLICY IF EXISTS "Public read published landing pages" ON landing_pages;
CREATE POLICY "Public read published landing pages" ON landing_pages
    FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public read published qa pages" ON qa_pages;
CREATE POLICY "Public read published qa pages" ON qa_pages
    FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public read scheduled workshops" ON workshops;
CREATE POLICY "Public read scheduled workshops" ON workshops
    FOR SELECT USING (status IN ('scheduled', 'live'));

DROP POLICY IF EXISTS "Public insert workshop registrations" ON workshop_registrations;
CREATE POLICY "Public insert workshop registrations" ON workshop_registrations
    FOR INSERT WITH CHECK (true);

-- ============================================================
-- RLS POLICIES: Public lead submission (anon key)
-- ============================================================
DROP POLICY IF EXISTS "Public submit leads" ON leads;
CREATE POLICY "Public submit leads" ON leads
    FOR INSERT WITH CHECK (true);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers (drop first to avoid duplicates)
DROP TRIGGER IF EXISTS set_updated_at_advisors ON advisors;
CREATE TRIGGER set_updated_at_advisors BEFORE UPDATE ON advisors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_leads ON leads;
CREATE TRIGGER set_updated_at_leads BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_clients ON clients;
CREATE TRIGGER set_updated_at_clients BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_appointments ON appointments;
CREATE TRIGGER set_updated_at_appointments BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_tasks ON tasks;
CREATE TRIGGER set_updated_at_tasks BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_landing_pages ON landing_pages;
CREATE TRIGGER set_updated_at_landing_pages BEFORE UPDATE ON landing_pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_qa_pages ON qa_pages;
CREATE TRIGGER set_updated_at_qa_pages BEFORE UPDATE ON qa_pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_workshops ON workshops;
CREATE TRIGGER set_updated_at_workshops BEFORE UPDATE ON workshops
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

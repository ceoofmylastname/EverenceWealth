-- ============================================================
-- Migration 003: Client Portal Tables
-- Tables: policies, accounts, document_vault, financial_health
-- ============================================================

-- 1. POLICIES TABLE (Insurance Policies)
CREATE TABLE IF NOT EXISTS policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    advisor_id UUID REFERENCES advisors(id),
    policy_type TEXT NOT NULL CHECK (policy_type IN ('iul', 'term_life', 'whole_life', 'disability', 'ltc', 'annuity')),
    policy_number TEXT UNIQUE,
    carrier TEXT,
    coverage_amount DECIMAL(15,2) DEFAULT 0,
    premium_amount DECIMAL(10,2) DEFAULT 0,
    premium_frequency TEXT CHECK (premium_frequency IN ('monthly', 'quarterly', 'annual')) DEFAULT 'monthly',
    status TEXT CHECK (status IN ('active', 'pending', 'lapsed', 'paid_up')) DEFAULT 'active',
    issue_date DATE,
    next_payment_due DATE,
    cash_value DECIMAL(15,2) DEFAULT 0,
    death_benefit DECIMAL(15,2) DEFAULT 0,
    policy_document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ACCOUNTS TABLE (Indexed/Investment Accounts)
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    advisor_id UUID REFERENCES advisors(id),
    account_type TEXT NOT NULL CHECK (account_type IN ('iul_cash_value', 'indexed_annuity', 'brokerage', 'ira', 'roth_ira', '401k')),
    account_number TEXT,
    tax_bucket TEXT CHECK (tax_bucket IN ('taxable', 'tax_deferred', 'tax_exempt')) DEFAULT 'taxable',
    current_value DECIMAL(15,2) DEFAULT 0,
    contribution_ytd DECIMAL(15,2) DEFAULT 0,
    gain_loss_ytd DECIMAL(15,2) DEFAULT 0,
    status TEXT CHECK (status IN ('active', 'closed')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. DOCUMENT_VAULT TABLE (Secure File Storage)
CREATE TABLE IF NOT EXISTS document_vault (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    uploaded_by_type TEXT CHECK (uploaded_by_type IN ('advisor', 'client', 'admin')) DEFAULT 'advisor',
    uploaded_by_id UUID,
    document_type TEXT CHECK (document_type IN ('policy', 'statement', 'tax_form', 'financial_plan', 'other')) DEFAULT 'other',
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER DEFAULT 0,
    year INTEGER,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. FINANCIAL_HEALTH TABLE (Dashboard Metrics)
CREATE TABLE IF NOT EXISTS financial_health (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE UNIQUE,
    health_score INTEGER CHECK (health_score >= 0 AND health_score <= 100) DEFAULT 0,
    total_coverage DECIMAL(15,2) DEFAULT 0,
    total_assets DECIMAL(15,2) DEFAULT 0,
    total_premiums_annual DECIMAL(15,2) DEFAULT 0,
    emergency_fund_months INTEGER DEFAULT 0,
    debt_to_income_ratio DECIMAL(5,2) DEFAULT 0,
    last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_policies_client_id ON policies(client_id);
CREATE INDEX IF NOT EXISTS idx_policies_advisor_id ON policies(advisor_id);
CREATE INDEX IF NOT EXISTS idx_policies_status ON policies(status);
CREATE INDEX IF NOT EXISTS idx_policies_policy_type ON policies(policy_type);

CREATE INDEX IF NOT EXISTS idx_accounts_client_id ON accounts(client_id);
CREATE INDEX IF NOT EXISTS idx_accounts_advisor_id ON accounts(advisor_id);
CREATE INDEX IF NOT EXISTS idx_accounts_tax_bucket ON accounts(tax_bucket);
CREATE INDEX IF NOT EXISTS idx_accounts_status ON accounts(status);

CREATE INDEX IF NOT EXISTS idx_document_vault_client_id ON document_vault(client_id);
CREATE INDEX IF NOT EXISTS idx_document_vault_document_type ON document_vault(document_type);
CREATE INDEX IF NOT EXISTS idx_document_vault_year ON document_vault(year);

CREATE INDEX IF NOT EXISTS idx_financial_health_client_id ON financial_health(client_id);

-- ============================================================
-- RLS POLICIES
-- ============================================================
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_health ENABLE ROW LEVEL SECURITY;

-- Policies RLS
DROP POLICY IF EXISTS "Clients can view own policies" ON policies;
CREATE POLICY "Clients can view own policies" ON policies
    FOR SELECT USING (
        client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Advisors can manage client policies" ON policies;
CREATE POLICY "Advisors can manage client policies" ON policies
    FOR ALL USING (
        advisor_id IN (SELECT id FROM advisors WHERE user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Admins full access to policies" ON policies;
CREATE POLICY "Admins full access to policies" ON policies
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
    );

-- Accounts RLS
DROP POLICY IF EXISTS "Clients can view own accounts" ON accounts;
CREATE POLICY "Clients can view own accounts" ON accounts
    FOR SELECT USING (
        client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Advisors can manage client accounts" ON accounts;
CREATE POLICY "Advisors can manage client accounts" ON accounts
    FOR ALL USING (
        advisor_id IN (SELECT id FROM advisors WHERE user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Admins full access to accounts" ON accounts;
CREATE POLICY "Admins full access to accounts" ON accounts
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
    );

-- Document Vault RLS
DROP POLICY IF EXISTS "Clients can view own documents" ON document_vault;
CREATE POLICY "Clients can view own documents" ON document_vault
    FOR SELECT USING (
        client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Clients can upload own documents" ON document_vault;
CREATE POLICY "Clients can upload own documents" ON document_vault
    FOR INSERT WITH CHECK (
        client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Advisors can manage client documents" ON document_vault;
CREATE POLICY "Advisors can manage client documents" ON document_vault
    FOR ALL USING (
        client_id IN (SELECT id FROM clients WHERE advisor_id IN (SELECT id FROM advisors WHERE user_id = auth.uid()))
    );

DROP POLICY IF EXISTS "Admins full access to documents" ON document_vault;
CREATE POLICY "Admins full access to documents" ON document_vault
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
    );

-- Financial Health RLS
DROP POLICY IF EXISTS "Clients can view own financial health" ON financial_health;
CREATE POLICY "Clients can view own financial health" ON financial_health
    FOR SELECT USING (
        client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Advisors can manage client financial health" ON financial_health;
CREATE POLICY "Advisors can manage client financial health" ON financial_health
    FOR ALL USING (
        client_id IN (SELECT id FROM clients WHERE advisor_id IN (SELECT id FROM advisors WHERE user_id = auth.uid()))
    );

DROP POLICY IF EXISTS "Admins full access to financial health" ON financial_health;
CREATE POLICY "Admins full access to financial health" ON financial_health
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
    );

-- ============================================================
-- TRIGGERS (updated_at)
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_policies_updated_at ON policies;
CREATE TRIGGER update_policies_updated_at
    BEFORE UPDATE ON policies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_accounts_updated_at ON accounts;
CREATE TRIGGER update_accounts_updated_at
    BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_financial_health_updated_at ON financial_health;
CREATE TRIGGER update_financial_health_updated_at
    BEFORE UPDATE ON financial_health
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- REALTIME
-- ============================================================
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE policies;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE accounts;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE document_vault;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE financial_health;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

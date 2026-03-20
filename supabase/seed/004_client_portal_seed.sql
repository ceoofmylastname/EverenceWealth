-- ============================================================
-- Seed Data: Client Portal Demo Data
-- Run this AFTER migrations 002 and 003
-- Replace UUIDs with actual auth.users IDs as needed
-- ============================================================

-- NOTE: You must first create auth users in Supabase and get their UUIDs.
-- Replace the placeholder UUIDs below with actual user IDs.

-- Placeholder UUIDs (replace with real ones):
-- Advisor user: 11111111-1111-1111-1111-111111111111
-- Client user:  22222222-2222-2222-2222-222222222222

-- 1. Advisor
INSERT INTO advisors (id, user_id, first_name, last_name, email, phone, bio, photo_url, license_number, status, specialties, territories, calendar_url)
VALUES (
    'a0000001-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    'Sarah',
    'Johnson',
    'sarah@everencewealth.com',
    '(415) 555-0100',
    'Sarah is a Certified Financial Planner with over 15 years of experience helping families build and protect their wealth. She specializes in retirement planning, tax-efficient strategies, and indexed life insurance.',
    NULL,
    'CFP-12345',
    'active',
    ARRAY['Retirement Planning', 'Tax Strategy', 'Indexed Life Insurance', 'Estate Planning'],
    ARRAY['San Francisco Bay Area', 'Northern California'],
    'https://calendly.com/sarah-everence'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Client
INSERT INTO clients (id, advisor_id, user_id, first_name, last_name, email, phone, date_of_birth, status, onboarding_completed, portal_access_enabled, total_assets, annual_income, risk_tolerance)
VALUES (
    'c0000001-0000-0000-0000-000000000001',
    'a0000001-0000-0000-0000-000000000001',
    '22222222-2222-2222-2222-222222222222',
    'John',
    'Mitchell',
    'john@example.com',
    '(415) 555-0200',
    '1975-06-15',
    'active',
    true,
    true,
    850000,
    175000,
    'moderate'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Policies (3 policies)
INSERT INTO policies (id, client_id, advisor_id, policy_type, policy_number, carrier, coverage_amount, premium_amount, premium_frequency, status, issue_date, next_payment_due, cash_value, death_benefit)
VALUES
    ('p0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'iul', 'IUL-2024-001', 'Pacific Life', 1500000, 850, 'monthly', 'active', '2024-01-15', '2025-03-15', 42500, 1500000),
    ('p0000002-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'term_life', 'TL-2023-045', 'Northwestern Mutual', 750000, 125, 'monthly', 'active', '2023-06-01', '2025-03-01', 0, 750000),
    ('p0000003-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'disability', 'DI-2024-012', 'Guardian', 250000, 175, 'monthly', 'active', '2024-03-01', '2025-03-01', 0, 0)
ON CONFLICT (id) DO NOTHING;

-- 4. Accounts (2 accounts)
INSERT INTO accounts (id, client_id, advisor_id, account_type, account_number, tax_bucket, current_value, contribution_ytd, gain_loss_ytd, status)
VALUES
    ('ac000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'iul_cash_value', 'IUL-CV-2024001', 'tax_exempt', 42500, 10200, 3800, 'active'),
    ('ac000002-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'roth_ira', 'ROTH-2023045', 'tax_exempt', 285000, 7000, 18500, 'active')
ON CONFLICT (id) DO NOTHING;

-- 5. Financial Health
INSERT INTO financial_health (id, client_id, health_score, total_coverage, total_assets, total_premiums_annual, emergency_fund_months, debt_to_income_ratio)
VALUES (
    'fh000001-0000-0000-0000-000000000001',
    'c0000001-0000-0000-0000-000000000001',
    85,
    2500000,
    327500,
    13800,
    6,
    0.28
)
ON CONFLICT (id) DO NOTHING;

-- 6. Documents (5 documents)
INSERT INTO document_vault (id, client_id, uploaded_by_type, uploaded_by_id, document_type, file_name, file_url, file_size, year, description)
VALUES
    ('d0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'advisor', 'a0000001-0000-0000-0000-000000000001', 'policy', 'IUL-Policy-Document.pdf', '/documents/sample.pdf', 2450000, 2024, 'Indexed Universal Life policy document'),
    ('d0000002-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001', 'advisor', 'a0000001-0000-0000-0000-000000000001', 'policy', 'Term-Life-Policy.pdf', '/documents/sample.pdf', 1800000, 2023, 'Term Life policy document'),
    ('d0000003-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000001', 'advisor', 'a0000001-0000-0000-0000-000000000001', 'financial_plan', 'Financial-Plan-2025.pdf', '/documents/sample.pdf', 3200000, 2025, 'Annual financial plan review'),
    ('d0000004-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000001', 'advisor', 'a0000001-0000-0000-0000-000000000001', 'tax_form', '1099-R-2024.pdf', '/documents/sample.pdf', 450000, 2024, '1099-R Distribution form'),
    ('d0000005-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000001', 'advisor', 'a0000001-0000-0000-0000-000000000001', 'statement', 'Q4-2024-Statement.pdf', '/documents/sample.pdf', 780000, 2024, 'Q4 2024 account statement')
ON CONFLICT (id) DO NOTHING;

-- 7. Appointments (2 upcoming + 1 past)
INSERT INTO appointments (id, client_id, advisor_id, type, status, scheduled_at, duration_minutes, meeting_url, notes)
VALUES
    ('ap000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'review', 'scheduled', (NOW() + INTERVAL '7 days')::timestamptz, 60, 'https://zoom.us/j/123456789', 'Annual portfolio review'),
    ('ap000002-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'follow-up', 'scheduled', (NOW() + INTERVAL '21 days')::timestamptz, 30, 'https://zoom.us/j/987654321', 'Tax strategy follow-up'),
    ('ap000003-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'fna', 'completed', (NOW() - INTERVAL '30 days')::timestamptz, 90, NULL, 'Initial Financial Needs Assessment')
ON CONFLICT (id) DO NOTHING;

-- 8. Messages (3 threads)
INSERT INTO messages (id, sender_type, sender_id, recipient_type, recipient_id, subject, body, read, created_at)
VALUES
    ('m0000001-0000-0000-0000-000000000001', 'advisor', 'a0000001-0000-0000-0000-000000000001', 'client', 'c0000001-0000-0000-0000-000000000001', 'Welcome to Everence Wealth', 'Hi John, welcome to your client portal! I''m excited to work with you on building a comprehensive financial plan. Feel free to reach out anytime you have questions.', true, NOW() - INTERVAL '14 days'),
    ('m0000002-0000-0000-0000-000000000002', 'client', 'c0000001-0000-0000-0000-000000000001', 'advisor', 'a0000001-0000-0000-0000-000000000001', NULL, 'Thank you Sarah! Looking forward to our annual review next week. Should I prepare anything specific?', true, NOW() - INTERVAL '13 days'),
    ('m0000003-0000-0000-0000-000000000003', 'advisor', 'a0000001-0000-0000-0000-000000000001', 'client', 'c0000001-0000-0000-0000-000000000001', NULL, 'Great question! Please bring any recent tax documents and a list of any major financial changes from this year. We''ll review everything together.', false, NOW() - INTERVAL '12 days'),
    ('m0000004-0000-0000-0000-000000000004', 'advisor', 'a0000001-0000-0000-0000-000000000001', 'client', 'c0000001-0000-0000-0000-000000000001', 'Policy Update', 'I wanted to let you know your IUL cash value has grown nicely this quarter. We''re on track with our projections. I''ve uploaded the latest statement to your documents.', false, NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

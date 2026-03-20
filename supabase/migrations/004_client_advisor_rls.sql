-- Allow clients to view their assigned advisor's profile
-- Without this, the clients.select('*, advisors(*)') join returns null for advisors
CREATE POLICY "Clients can view their advisor" ON advisors
    FOR SELECT USING (
        id IN (SELECT advisor_id FROM clients WHERE user_id = auth.uid())
    );

-- Allow admin_users to be queried for role detection
-- Without this, client-side detectRoleClient() can't check admin_users table
CREATE POLICY "Users can check own admin status" ON admin_users
    FOR SELECT USING (auth.uid() = user_id);

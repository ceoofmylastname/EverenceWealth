# Everence Wealth CMS - Phase 1

This project is the Admin Dashboard and CMS for Everence Wealth, built with Next.js 14, Supabase, and Tailwind CSS.

## Getting Started

1.  **Environment Setup**:
    Create a `.env.local` file in the root directory with the following variables:
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ENCRYPTION_KEY=your_32_byte_secret_key_for_api_keys
    ```

2.  **Database Setup**:
    Run the SQL script located in `supabase/schema.sql` in your Supabase SQL Editor to create the necessary tables (`admin_users`, `settings`) and security policies.

3.  **Install Dependencies**:
    ```bash
    npm install
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

5.  **Access Admin Dashboard**:
    Navigate to `http://localhost:3000/admin/login`.
    You must be an authenticated Supabase user to access the dashboard.
    (Note: You can create a user in Supabase Auth dashboard manually if no signup flow exists yet).

## Features

-   **Admin Authentication**: Secure login via Supabase Auth.
-   **Dashboard**: Overview of system status and quick actions.
-   **Settings Management**: Configure Master Prompt, API Keys (encrypted), and Site Settings.
-   **Responsive Design**: Mobile-friendly admin interface.

## Project Structure

-   `/app/admin`: Admin dashboard routes and pages.
-   `/components/admin`: Admin-specific UI components.
-   `/lib/supabase`: Supabase client and server utilities.
-   `/lib/api`: API interaction logic.
-   `/supabase`: Database schema and migrations.

## Tech Stack

-   **Framework**: Next.js 14 (App Router)
-   **Database**: Supabase (PostgreSQL)
-   **Auth**: Supabase Auth
-   **Styling**: Tailwind CSS
-   **State/Forms**: React Hook Form

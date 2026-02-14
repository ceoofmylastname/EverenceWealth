export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            admin_users: {
                Row: {
                    id: string
                    user_id: string | null
                    email: string
                    name: string
                    role: string | null
                    created_at: string | null
                    last_login: string | null
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    email: string
                    name: string
                    role?: string | null
                    created_at?: string | null
                    last_login?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    email?: string
                    name?: string
                    role?: string | null
                    created_at?: string | null
                    last_login?: string | null
                }
            }
            settings: {
                Row: {
                    id: string
                    setting_key: string
                    setting_value: string | null
                    setting_type: 'text' | 'api_key' | 'prompt' | null
                    description: string | null
                    updated_at: string | null
                    updated_by: string | null
                }
                Insert: {
                    id?: string
                    setting_key: string
                    setting_value?: string | null
                    setting_type?: 'text' | 'api_key' | 'prompt' | null
                    description?: string | null
                    updated_at?: string | null
                    updated_by?: string | null
                }
                Update: {
                    id?: string
                    setting_key?: string
                    setting_value?: string | null
                    setting_type?: 'text' | 'api_key' | 'prompt' | null
                    description?: string | null
                    updated_at?: string | null
                    updated_by?: string | null
                }
            }
            clusters: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    topic: string | null
                    keywords: string | null
                    target_audience: string | null
                    status: 'draft' | 'generating' | 'active' | 'archived'
                    content_count: number
                    en_count: number
                    es_count: number
                    required_content_count: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    topic?: string | null
                    keywords?: string | null
                    target_audience?: string | null
                    status?: 'draft' | 'generating' | 'active' | 'archived'
                    content_count?: number
                    en_count?: number
                    es_count?: number
                    required_content_count?: number
                }
                Update: {
                    name?: string
                    slug?: string
                    topic?: string | null
                    keywords?: string | null
                    target_audience?: string | null
                    status?: 'draft' | 'generating' | 'active' | 'archived'
                    content_count?: number
                    en_count?: number
                    es_count?: number
                }
            }
            blog_posts: {
                Row: {
                    id: string
                    cluster_id: string
                    title: string
                    slug: string
                    content: string | null
                    language: 'en' | 'es'
                    funnel_stage: 'tofu' | 'mofu' | 'bofu' | null
                    funnel_position: number | null
                    keywords: string | null
                    status: string
                    word_count: number
                    reading_time: number
                    meta_title: string | null
                    meta_description: string | null
                    hreflang_group_id: string | null
                    translations: any
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    cluster_id: string
                    title: string
                    slug: string
                    content?: string | null
                    language: 'en' | 'es'
                    funnel_stage?: 'tofu' | 'mofu' | 'bofu' | null
                    funnel_position?: number | null
                    keywords?: string | null
                    status?: string
                    word_count?: number
                    reading_time?: number
                }
                Update: {
                    title?: string
                    content?: string | null
                    status?: string
                    word_count?: number
                    reading_time?: number
                    meta_title?: string | null
                    meta_description?: string | null
                    keywords?: string | null
                    updated_at?: string
                }
            }
            system_errors: {
                Row: {
                    id: string
                    error_code: string | null
                    error_message: string
                    error_details: Record<string, any> | null
                    source: string | null
                    severity: 'warning' | 'error' | 'critical' | null
                    status: 'new' | 'analyzed' | 'fixed' | 'ignored' | null
                    ai_analysis: string | null
                    suggested_sql: string | null
                    created_at: string | null
                    resolved_at: string | null
                    resolved_by: string | null
                }
                Insert: {
                    id?: string
                    error_code?: string | null
                    error_message: string
                    error_details?: Record<string, any> | null
                    source?: string | null
                    severity?: 'warning' | 'error' | 'critical' | null
                    status?: 'new' | 'analyzed' | 'fixed' | 'ignored' | null
                    ai_analysis?: string | null
                    suggested_sql?: string | null
                    created_at?: string | null
                    resolved_at?: string | null
                    resolved_by?: string | null
                }
                Update: {
                    id?: string
                    error_code?: string | null
                    error_message?: string
                    error_details?: Record<string, any> | null
                    source?: string | null
                    severity?: 'warning' | 'error' | 'critical' | null
                    status?: 'new' | 'analyzed' | 'fixed' | 'ignored' | null
                    ai_analysis?: string | null
                    suggested_sql?: string | null
                    created_at?: string | null
                    resolved_at?: string | null
                    resolved_by?: string | null
                }
            }
            cluster_generations: {
                Row: {
                    id: string
                    cluster_id: string | null
                    status: 'pending' | 'processing' | 'completed' | 'failed'
                    topic: string
                    primary_keyword: string
                    target_audience: string
                    language: string
                    total_articles: number
                    completed_articles: number
                    user_id: string | null
                    error_message: string | null
                    last_heartbeat: string
                    created_at: string
                }
                Insert: {
                    cluster_id?: string | null
                    status?: 'pending' | 'processing' | 'completed' | 'failed'
                    topic: string
                    primary_keyword: string
                    target_audience: string
                    language?: string
                    total_articles?: number
                    completed_articles?: number
                    user_id?: string | null
                }
                Update: {
                    status?: 'pending' | 'processing' | 'completed' | 'failed'
                    completed_articles?: number
                    error_message?: string | null
                    last_heartbeat?: string
                }
            }
            schema_fixes: {
                Row: {
                    id: string
                    error_id: string | null
                    sql_command: string
                    description: string | null
                    status: 'pending' | 'applied' | 'failed' | 'rejected' | null
                    applied_at: string | null
                    applied_by: string | null
                    result_message: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    error_id?: string | null
                    sql_command: string
                    description?: string | null
                    status?: 'pending' | 'applied' | 'failed' | 'rejected' | null
                    applied_at?: string | null
                    applied_by?: string | null
                    result_message?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    error_id?: string | null
                    sql_command?: string
                    description?: string | null
                    status?: 'pending' | 'applied' | 'failed' | 'rejected' | null
                    applied_at?: string | null
                    applied_by?: string | null
                    result_message?: string | null
                    created_at?: string | null
                }
            }
            // ================================================
            // NEW PORTAL TABLES (Migration 002)
            // ================================================
            advisors: {
                Row: {
                    id: string
                    user_id: string | null
                    first_name: string
                    last_name: string
                    email: string
                    phone: string | null
                    bio: string | null
                    photo_url: string | null
                    license_number: string | null
                    status: 'active' | 'inactive' | 'pending'
                    specialties: string[] | null
                    territories: string[] | null
                    calendar_url: string | null
                    metrics: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    first_name: string
                    last_name: string
                    email: string
                    phone?: string | null
                    bio?: string | null
                    photo_url?: string | null
                    license_number?: string | null
                    status?: 'active' | 'inactive' | 'pending'
                    specialties?: string[] | null
                    territories?: string[] | null
                    calendar_url?: string | null
                    metrics?: Json | null
                }
                Update: {
                    user_id?: string | null
                    first_name?: string
                    last_name?: string
                    email?: string
                    phone?: string | null
                    bio?: string | null
                    photo_url?: string | null
                    license_number?: string | null
                    status?: 'active' | 'inactive' | 'pending'
                    specialties?: string[] | null
                    territories?: string[] | null
                    calendar_url?: string | null
                    metrics?: Json | null
                    updated_at?: string
                }
            }
            leads: {
                Row: {
                    id: string
                    source_cluster_id: string | null
                    source_content_id: string | null
                    source_type: 'blog' | 'landing_page' | 'workshop' | 'referral' | 'manual' | null
                    first_name: string
                    last_name: string
                    email: string
                    phone: string | null
                    age_range: string | null
                    retirement_assets_range: string | null
                    primary_concern: string | null
                    interest_level: 'hot' | 'warm' | 'cold'
                    status: 'new' | 'claimed' | 'contacted' | 'qualified' | 'converted' | 'lost'
                    assigned_advisor_id: string | null
                    claimed_at: string | null
                    contacted_at: string | null
                    qualified_at: string | null
                    converted_at: string | null
                    notes: Json | null
                    language: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    source_cluster_id?: string | null
                    source_content_id?: string | null
                    source_type?: 'blog' | 'landing_page' | 'workshop' | 'referral' | 'manual' | null
                    first_name: string
                    last_name: string
                    email: string
                    phone?: string | null
                    age_range?: string | null
                    retirement_assets_range?: string | null
                    primary_concern?: string | null
                    interest_level?: 'hot' | 'warm' | 'cold'
                    status?: 'new' | 'claimed' | 'contacted' | 'qualified' | 'converted' | 'lost'
                    assigned_advisor_id?: string | null
                    notes?: Json | null
                    language?: string
                }
                Update: {
                    source_type?: 'blog' | 'landing_page' | 'workshop' | 'referral' | 'manual' | null
                    first_name?: string
                    last_name?: string
                    email?: string
                    phone?: string | null
                    age_range?: string | null
                    retirement_assets_range?: string | null
                    primary_concern?: string | null
                    interest_level?: 'hot' | 'warm' | 'cold'
                    status?: 'new' | 'claimed' | 'contacted' | 'qualified' | 'converted' | 'lost'
                    assigned_advisor_id?: string | null
                    claimed_at?: string | null
                    contacted_at?: string | null
                    qualified_at?: string | null
                    converted_at?: string | null
                    notes?: Json | null
                    updated_at?: string
                }
            }
            clients: {
                Row: {
                    id: string
                    lead_id: string | null
                    advisor_id: string
                    user_id: string | null
                    first_name: string
                    last_name: string
                    email: string
                    phone: string | null
                    date_of_birth: string | null
                    address: Json | null
                    status: 'active' | 'inactive' | 'archived'
                    onboarding_completed: boolean
                    portal_access_enabled: boolean
                    total_assets: number | null
                    annual_income: number | null
                    risk_tolerance: 'conservative' | 'moderate' | 'aggressive' | null
                    documents: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    lead_id?: string | null
                    advisor_id: string
                    user_id?: string | null
                    first_name: string
                    last_name: string
                    email: string
                    phone?: string | null
                    date_of_birth?: string | null
                    address?: Json | null
                    status?: 'active' | 'inactive' | 'archived'
                    onboarding_completed?: boolean
                    portal_access_enabled?: boolean
                    total_assets?: number | null
                    annual_income?: number | null
                    risk_tolerance?: 'conservative' | 'moderate' | 'aggressive' | null
                    documents?: Json | null
                }
                Update: {
                    lead_id?: string | null
                    advisor_id?: string
                    user_id?: string | null
                    first_name?: string
                    last_name?: string
                    email?: string
                    phone?: string | null
                    date_of_birth?: string | null
                    address?: Json | null
                    status?: 'active' | 'inactive' | 'archived'
                    onboarding_completed?: boolean
                    portal_access_enabled?: boolean
                    total_assets?: number | null
                    annual_income?: number | null
                    risk_tolerance?: 'conservative' | 'moderate' | 'aggressive' | null
                    documents?: Json | null
                    updated_at?: string
                }
            }
            appointments: {
                Row: {
                    id: string
                    client_id: string
                    advisor_id: string
                    type: 'fna' | 'review' | 'follow-up' | 'onboarding'
                    status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'
                    scheduled_at: string
                    duration_minutes: number
                    meeting_url: string | null
                    notes: string | null
                    agenda: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    client_id: string
                    advisor_id: string
                    type: 'fna' | 'review' | 'follow-up' | 'onboarding'
                    status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'
                    scheduled_at: string
                    duration_minutes?: number
                    meeting_url?: string | null
                    notes?: string | null
                    agenda?: Json | null
                }
                Update: {
                    client_id?: string
                    advisor_id?: string
                    type?: 'fna' | 'review' | 'follow-up' | 'onboarding'
                    status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'
                    scheduled_at?: string
                    duration_minutes?: number
                    meeting_url?: string | null
                    notes?: string | null
                    agenda?: Json | null
                    updated_at?: string
                }
            }
            messages: {
                Row: {
                    id: string
                    sender_type: 'advisor' | 'client' | 'admin'
                    sender_id: string
                    recipient_type: 'advisor' | 'client' | 'admin'
                    recipient_id: string
                    subject: string | null
                    body: string
                    read: boolean
                    read_at: string | null
                    attachments: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    sender_type: 'advisor' | 'client' | 'admin'
                    sender_id: string
                    recipient_type: 'advisor' | 'client' | 'admin'
                    recipient_id: string
                    subject?: string | null
                    body: string
                    read?: boolean
                    attachments?: Json | null
                }
                Update: {
                    subject?: string | null
                    body?: string
                    read?: boolean
                    read_at?: string | null
                    attachments?: Json | null
                }
            }
            tasks: {
                Row: {
                    id: string
                    advisor_id: string
                    client_id: string | null
                    title: string
                    description: string | null
                    priority: 'low' | 'medium' | 'high' | 'urgent'
                    status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
                    due_date: string | null
                    completed_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    advisor_id: string
                    client_id?: string | null
                    title: string
                    description?: string | null
                    priority?: 'low' | 'medium' | 'high' | 'urgent'
                    status?: 'pending' | 'in-progress' | 'completed' | 'cancelled'
                    due_date?: string | null
                }
                Update: {
                    advisor_id?: string
                    client_id?: string | null
                    title?: string
                    description?: string | null
                    priority?: 'low' | 'medium' | 'high' | 'urgent'
                    status?: 'pending' | 'in-progress' | 'completed' | 'cancelled'
                    due_date?: string | null
                    completed_at?: string | null
                    updated_at?: string
                }
            }
            landing_pages: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    template: 'killers' | 'indexed' | 'taxes' | 'workshop' | 'custom' | null
                    headline: string
                    subheadline: string | null
                    hero_image_url: string | null
                    content: Json | null
                    cta_text: string
                    cta_url: string
                    status: 'draft' | 'published' | 'archived'
                    views: number
                    conversions: number
                    published_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    slug: string
                    template?: 'killers' | 'indexed' | 'taxes' | 'workshop' | 'custom' | null
                    headline: string
                    subheadline?: string | null
                    hero_image_url?: string | null
                    content?: Json | null
                    cta_text?: string
                    cta_url?: string
                    status?: 'draft' | 'published' | 'archived'
                    views?: number
                    conversions?: number
                    published_at?: string | null
                }
                Update: {
                    title?: string
                    slug?: string
                    template?: 'killers' | 'indexed' | 'taxes' | 'workshop' | 'custom' | null
                    headline?: string
                    subheadline?: string | null
                    hero_image_url?: string | null
                    content?: Json | null
                    cta_text?: string
                    cta_url?: string
                    status?: 'draft' | 'published' | 'archived'
                    views?: number
                    conversions?: number
                    published_at?: string | null
                    updated_at?: string
                }
            }
            qa_pages: {
                Row: {
                    id: string
                    cluster_id: string
                    parent_article_id: string | null
                    question: string
                    answer: string
                    slug: string
                    language: 'en' | 'es'
                    speakable: string | null
                    status: 'draft' | 'published'
                    meta_title: string | null
                    meta_description: string | null
                    keywords: string | null
                    views: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    cluster_id: string
                    parent_article_id?: string | null
                    question: string
                    answer: string
                    slug: string
                    language?: 'en' | 'es'
                    speakable?: string | null
                    status?: 'draft' | 'published'
                    meta_title?: string | null
                    meta_description?: string | null
                    keywords?: string | null
                    views?: number
                }
                Update: {
                    cluster_id?: string
                    parent_article_id?: string | null
                    question?: string
                    answer?: string
                    slug?: string
                    language?: 'en' | 'es'
                    speakable?: string | null
                    status?: 'draft' | 'published'
                    meta_title?: string | null
                    meta_description?: string | null
                    keywords?: string | null
                    views?: number
                    updated_at?: string
                }
            }
            workshops: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    instructor_advisor_id: string | null
                    scheduled_at: string
                    duration_minutes: number
                    max_attendees: number
                    current_attendees: number
                    meeting_url: string | null
                    status: 'scheduled' | 'live' | 'completed' | 'cancelled'
                    recording_url: string | null
                    materials: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    instructor_advisor_id?: string | null
                    scheduled_at: string
                    duration_minutes?: number
                    max_attendees?: number
                    current_attendees?: number
                    meeting_url?: string | null
                    status?: 'scheduled' | 'live' | 'completed' | 'cancelled'
                    recording_url?: string | null
                    materials?: Json | null
                }
                Update: {
                    title?: string
                    description?: string | null
                    instructor_advisor_id?: string | null
                    scheduled_at?: string
                    duration_minutes?: number
                    max_attendees?: number
                    current_attendees?: number
                    meeting_url?: string | null
                    status?: 'scheduled' | 'live' | 'completed' | 'cancelled'
                    recording_url?: string | null
                    materials?: Json | null
                    updated_at?: string
                }
            }
            workshop_registrations: {
                Row: {
                    id: string
                    workshop_id: string
                    lead_id: string | null
                    first_name: string
                    last_name: string
                    email: string
                    phone: string | null
                    attended: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    workshop_id: string
                    lead_id?: string | null
                    first_name: string
                    last_name: string
                    email: string
                    phone?: string | null
                    attended?: boolean
                }
                Update: {
                    workshop_id?: string
                    lead_id?: string | null
                    first_name?: string
                    last_name?: string
                    email?: string
                    phone?: string | null
                    attended?: boolean
                }
            }
        }
        Functions: {
            increment_completed_articles: {
                Args: { gen_id: string }
                Returns: { new_count: number; is_complete: boolean }[]
            }
        }
    }
}

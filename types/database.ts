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
        }
        Functions: {
            increment_completed_articles: {
                Args: { gen_id: string }
                Returns: { new_count: number; is_complete: boolean }[]
            }
        }
    }
}

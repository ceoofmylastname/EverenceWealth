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
                    topic: string
                    target_audience: string | null
                    keywords: string[] | null
                    funnel_strategy: string | null
                    content_count: number | null
                    required_content_count: number | null
                    status: 'draft' | 'generating' | 'published' | 'archived' | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    topic: string
                    target_audience?: string | null
                    keywords?: string[] | null
                    funnel_strategy?: string | null
                    content_count?: number | null
                    required_content_count?: number | null
                    status?: 'draft' | 'generating' | 'published' | 'archived' | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    topic?: string
                    target_audience?: string | null
                    keywords?: string[] | null
                    funnel_strategy?: string | null
                    content_count?: number | null
                    required_content_count?: number | null
                    status?: 'draft' | 'generating' | 'published' | 'archived' | null
                    created_at?: string | null
                    updated_at?: string | null
                }
            }
            blog_posts: {
                Row: {
                    id: string
                    cluster_id: string | null
                    title: string
                    slug: string
                    content: string | null
                    meta_description: string | null
                    featured_image: string | null
                    funnel_stage: 'tofu' | 'mofu' | 'bofu' | null
                    funnel_position: number | null
                    parent_article_id: string | null
                    leads_to_article_ids: string[] | null
                    keywords: string[] | null
                    status: 'draft' | 'generating' | 'review' | 'published' | null
                    views: number | null
                    reading_time: number | null
                    published_at: string | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    cluster_id?: string | null
                    title: string
                    slug: string
                    content?: string | null
                    meta_description?: string | null
                    featured_image?: string | null
                    funnel_stage?: 'tofu' | 'mofu' | 'bofu' | null
                    funnel_position?: number | null
                    parent_article_id?: string | null
                    leads_to_article_ids?: string[] | null
                    keywords?: string[] | null
                    status?: 'draft' | 'generating' | 'review' | 'published' | null
                    views?: number | null
                    reading_time?: number | null
                    published_at?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    cluster_id?: string | null
                    title?: string
                    slug?: string
                    content?: string | null
                    meta_description?: string | null
                    featured_image?: string | null
                    funnel_stage?: 'tofu' | 'mofu' | 'bofu' | null
                    funnel_position?: number | null
                    parent_article_id?: string | null
                    leads_to_article_ids?: string[] | null
                    keywords?: string[] | null
                    status?: 'draft' | 'generating' | 'review' | 'published' | null
                    views?: number | null
                    reading_time?: number | null
                    published_at?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
            }
        }
    }
}

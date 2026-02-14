// =============================================================================
// LEGACY SERVER ACTIONS — Superseded by API Routes
// =============================================================================
// These functions have been replaced by:
//   - app/api/clusters/generate/route.ts (orchestrator)
//   - app/api/clusters/generate-chunk/route.ts (per-article content gen)
//
// The new system uses API routes with real-time progress tracking
// via the cluster_generations table. See CreateClusterDialog component.
// =============================================================================

export {}

// import { createClient } from '@/lib/supabase/server'
// import { getSettings } from '../settings/data'
// import { OpenAI } from 'openai'
// import { revalidatePath } from 'next/cache'
// import { redirect } from 'next/navigation'
// import { captureErrorServer } from '@/lib/error-capture-server'

// export async function generateClusterTopics(topic: string, audience: string, keywords: string) {
//     // 1. Get OpenAI Key from Settings
//     const settings = await getSettings()
//     const apiKeySetting = settings.find(s => s.setting_key === 'openai_api_key')
//
//     if (!apiKeySetting || !apiKeySetting.setting_value) {
//         return { error: 'OpenAI API Key not configured in Settings. Please add it first.' }
//     }
//
//     const openai = new OpenAI({ apiKey: apiKeySetting.setting_value })
//
//     // 2. Construct Prompt
//     const prompt = `
//     You are a content strategist for Everence Wealth, a fiduciary financial firm.
//
//     Given this cluster topic and keywords, generate 6 strategic article topics that follow a content funnel:
//
//     CLUSTER TOPIC: ${topic}
//     TARGET AUDIENCE: ${audience}
//     CORE KEYWORDS: ${keywords}
//
//     Generate topics following this structure:
//
//     3 TOFU (Top of Funnel) Articles:
//     - Educational, eye-opening content
//     - Focus on problems and awareness
//     - Question-based titles
//     - Address: "What is...", "Why should I care...", "Is my [retirement/portfolio] at risk?"
//     - Focus: Educational, awareness
//
//     2 MOFU (Middle of Funnel) Articles:
//     - Comparison and evaluation content
//     - Focus on solutions and alternatives
//     - Comparison-based titles
//     - Address: "X vs Y", "How to choose...", "Which strategy is right..."
//     - Focus: Consideration, comparison
//
//     1 BOFU (Bottom of Funnel) Article:
//     - Action-oriented, strategic content
//     - Focus on implementation and next steps
//     - Outcome-based titles
//     - Address: "How to bridge...", "Your complete guide to...", "Strategic plan for..."
//     - Focus: Decision, action
//
//     OUTPUT FORMAT (JSON):
//     {
//       "tofu": [
//         {
//           "title": "Article title as question",
//           "focus": "What this article educates on",
//           "keywords": ["keyword1", "keyword2"]
//         }
//       ],
//       "mofu": [
//         {
//           "title": "Comparison or evaluation title",
//           "focus": "What solutions this compares",
//           "keywords": ["keyword3", "keyword4"]
//         }
//       ],
//       "bofu": [
//         {
//           "title": "Action-oriented strategic title",
//           "focus": "Implementation plan",
//           "keywords": ["keyword5", "keyword6"]
//         }
//       ]
//     }
//     `
//
//     try {
//         const response = await openai.chat.completions.create({
//             model: 'gpt-4o',
//             messages: [{ role: 'user', content: prompt }],
//             response_format: { type: 'json_object' }
//         })
//
//         const content = response.choices[0].message.content
//         if (!content) return { error: 'No content generated from OpenAI' }
//
//         return { data: JSON.parse(content) }
//     } catch (error: any) {
//         console.error('OpenAI Error:', error)
//         return { error: error.message || 'Failed to generate topics' }
//     }
// }

// export async function createCluster(data: {
//     name: string,
//     topic: string,
//     target_audience: string,
//     keywords: string[],
//     articles: any
// }) {
//     const supabase = createClient()
//
//     // 1. Create Cluster
//     const { data: cluster, error: clusterError } = await supabase
//         .from('clusters')
//         .insert({
//             name: data.name,
//             slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
//             topic: data.topic,
//             target_audience: data.target_audience,
//             keywords: data.keywords,
//             funnel_strategy: '3-2-1',
//             required_content_count: 6,
//             content_count: 0,
//             status: 'draft'
//         })
//         .select()
//         .single()
//
//     if (clusterError) {
//         console.error('Create Cluster Error:', clusterError)
//         await captureErrorServer(clusterError, { source: 'clusters.actions.createCluster', details: { operation: 'insert', table: 'clusters' } })
//         return { error: clusterError.message }
//     }
//
//     // 2. Create Blog Posts (Drafts)
//     const postsToInsert: any[] = []
//
//     // TOFU (3)
//     data.articles.tofu.forEach((article: any, index: number) => {
//         postsToInsert.push({
//             cluster_id: cluster.id,
//             title: article.title,
//             slug: article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
//             funnel_stage: 'tofu',
//             funnel_position: index + 1,
//             keywords: article.keywords,
//             status: 'draft',
//             meta_description: article.focus
//         })
//     })
//
//     // MOFU (2)
//     data.articles.mofu.forEach((article: any, index: number) => {
//         postsToInsert.push({
//             cluster_id: cluster.id,
//             title: article.title,
//             slug: article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
//             funnel_stage: 'mofu',
//             funnel_position: index + 1,
//             keywords: article.keywords,
//             status: 'draft',
//             meta_description: article.focus
//         })
//     })
//
//     // BOFU (1)
//     data.articles.bofu.forEach((article: any, index: number) => {
//         postsToInsert.push({
//             cluster_id: cluster.id,
//             title: article.title,
//             slug: article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
//             funnel_stage: 'bofu',
//             funnel_position: index + 1,
//             keywords: article.keywords,
//             status: 'draft',
//             meta_description: article.focus
//         })
//     })
//
//     const { error: postsError } = await supabase
//         .from('blog_posts')
//         .insert(postsToInsert)
//
//     if (postsError) {
//         console.error('Create Posts Error:', postsError)
//         await captureErrorServer(postsError, { source: 'clusters.actions.createCluster', details: { operation: 'insert', table: 'blog_posts', clusterId: cluster.id } })
//         return { error: 'Cluster created but failed to create posts: ' + postsError.message }
//     }
//
//     revalidatePath('/admin/clusters')
//     return { success: true, clusterId: cluster.id }
// }

// export async function generateClusterContent(clusterId: string) {
//     const supabase = createClient()
//
//     // 1. Get OpenAI Key from Settings
//     const settings = await getSettings()
//     const apiKeySetting = settings.find(s => s.setting_key === 'openai_api_key')
//
//     if (!apiKeySetting || !apiKeySetting.setting_value) {
//         return { error: 'OpenAI API Key not configured in Settings. Please add it first.' }
//     }
//
//     const openai = new OpenAI({ apiKey: apiKeySetting.setting_value })
//
//     // 2. Fetch Cluster
//     const { data: cluster, error: clusterError } = await supabase
//         .from('clusters')
//         .select('*')
//         .eq('id', clusterId)
//         .single()
//
//     if (clusterError || !cluster) {
//         return { error: 'Cluster not found' }
//     }
//
//     // 3. Fetch draft posts for this cluster
//     const { data: posts, error: postsError } = await supabase
//         .from('blog_posts')
//         .select('*')
//         .eq('cluster_id', clusterId)
//         .in('status', ['draft'])
//         .order('funnel_position', { ascending: true })
//
//     if (postsError || !posts || posts.length === 0) {
//         return { error: 'No draft posts found for this cluster' }
//     }
//
//     // 4. Set cluster status to generating
//     await supabase
//         .from('clusters')
//         .update({ status: 'generating' })
//         .eq('id', clusterId)
//
//     // 5. Generate content for each post
//     let generatedCount = 0
//     let lastError = ''
//
//     for (const post of posts) {
//         const stageContext = {
//             tofu: 'This is a Top of Funnel (Awareness) article...',
//             mofu: 'This is a Middle of Funnel (Consideration) article...',
//             bofu: 'This is a Bottom of Funnel (Decision) article...'
//         }
//
//         const prompt = `You are a senior financial content writer for Everence Wealth...`
//
//         try {
//             const response = await openai.chat.completions.create({
//                 model: 'gpt-4o',
//                 messages: [{ role: 'user', content: prompt }],
//             })
//             const content = response.choices[0].message.content
//             if (!content) continue
//
//             let articleContent = content
//             let metaDesc = post.meta_description
//             const metaMatch = content.match(/META:\s*(.+?)$/m)
//             if (metaMatch) {
//                 metaDesc = metaMatch[1].trim()
//                 articleContent = content.replace(/META:\s*.+?$/m, '').trim()
//             }
//
//             const wordCount = articleContent.split(/\s+/).length
//             const readingTime = Math.max(1, Math.round(wordCount / 200))
//
//             const { error: updateError } = await supabase
//                 .from('blog_posts')
//                 .update({
//                     content: articleContent,
//                     meta_description: metaDesc,
//                     reading_time: readingTime,
//                     status: 'review',
//                     updated_at: new Date().toISOString()
//                 })
//                 .eq('id', post.id)
//
//             if (!updateError) {
//                 generatedCount++
//             }
//         } catch (error: any) {
//             lastError = error.message || String(error)
//             console.error(`Error generating content for post "${post.title}":`, lastError)
//         }
//     }
//
//     // 6. Update cluster status and content count
//     const { data: allPosts } = await supabase
//         .from('blog_posts')
//         .select('id, status')
//         .eq('cluster_id', clusterId)
//
//     const completedCount = allPosts?.filter(p => p.status !== 'draft').length || 0
//
//     await supabase
//         .from('clusters')
//         .update({
//             status: generatedCount > 0 ? 'draft' : 'draft',
//             content_count: completedCount,
//             updated_at: new Date().toISOString()
//         })
//         .eq('id', clusterId)
//
//     revalidatePath('/admin/clusters')
//     revalidatePath(`/admin/clusters/${clusterId}`)
//
//     if (generatedCount === 0) {
//         return { error: lastError || 'Failed to generate any content. Check your OpenAI API key.' }
//     }
//
//     return { success: true, generated: generatedCount, total: posts.length }
// }

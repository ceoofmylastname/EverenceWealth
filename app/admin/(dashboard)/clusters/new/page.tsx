'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Sparkles, Check, ChevronRight } from 'lucide-react'
import { generateClusterTopics, createCluster } from '../actions'
import toast from 'react-hot-toast'

type ClusterFormValues = {
    name: string
    topic: string
    target_audience: string
    keywords: string
}

export default function NewClusterPage() {
    const router = useRouter()
    const [step, setStep] = useState(1) // 1: Config, 2: Review
    const [loading, setLoading] = useState(false)
    const [generatedTopics, setGeneratedTopics] = useState<any>(null)

    const { register, handleSubmit, getValues, formState: { errors } } = useForm<ClusterFormValues>()

    const onGenerate = async (data: ClusterFormValues) => {
        setLoading(true)
        try {
            const result = await generateClusterTopics(data.topic, data.target_audience, data.keywords)

            if (result.error) {
                toast.error(result.error)
                setLoading(false)
                return
            }

            setGeneratedTopics(result.data)
            setStep(2)
        } catch (error) {
            toast.error('Failed to generate topics')
        } finally {
            setLoading(false)
        }
    }

    const onCreate = async () => {
        setLoading(true)
        const formValues = getValues()

        try {
            // Validate data structure
            if (!generatedTopics || !generatedTopics.tofu || !generatedTopics.mofu || !generatedTopics.bofu) {
                toast.error('Invalid topic data. Please regenerate.')
                setLoading(false)
                return
            }

            const result = await createCluster({
                name: formValues.name,
                topic: formValues.topic,
                target_audience: formValues.target_audience,
                keywords: formValues.keywords.split(',').map(k => k.trim()),
                articles: generatedTopics
            })

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Cluster created successfully!')
                router.push('/admin/clusters')
            }
        } catch (error) {
            toast.error('Unexpected error creating cluster')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-8">
                <Link href="/admin/clusters" className="flex items-center text-sm text-gray-400 hover:text-white mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Clusters
                </Link>
                <h2 className="text-3xl font-bold text-brand-gold">Create New Cluster</h2>
                <p className="mt-1 text-sm text-gray-400">Define your strategic content funnel.</p>
            </div>

            {/* Stepper */}
            <div className="flex items-center mb-8 border-b border-white/10 pb-4">
                <div className={`flex items-center ${step >= 1 ? 'text-brand-gold' : 'text-gray-500'}`}>
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full border ${step >= 1 ? 'border-brand-gold bg-brand-gold/10' : 'border-gray-600'} mr-3 text-sm font-bold`}>
                        1
                    </span>
                    <span className="text-sm font-medium">Configuration</span>
                </div>
                <ChevronRight className="h-4 w-4 mx-4 text-gray-600" />
                <div className={`flex items-center ${step >= 2 ? 'text-brand-gold' : 'text-gray-500'}`}>
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full border ${step >= 2 ? 'border-brand-gold bg-brand-gold/10' : 'border-gray-600'} mr-3 text-sm font-bold`}>
                        2
                    </span>
                    <span className="text-sm font-medium">Topic Review</span>
                </div>
            </div>

            {step === 1 && (
                <form onSubmit={handleSubmit(onGenerate)} className="space-y-6 bg-[#0A1210] p-8 rounded-xl border border-white/5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Cluster Name</label>
                        <input
                            {...register('name', { required: true })}
                            className="mt-1 block w-full bg-[#020806] border border-white/10 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-gold focus:border-brand-gold sm:text-sm"
                            placeholder="e.g. Retirement Planning Strategy"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">Primary Topic</label>
                        <input
                            {...register('topic', { required: true })}
                            className="mt-1 block w-full bg-[#020806] border border-white/10 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-gold focus:border-brand-gold sm:text-sm"
                            placeholder="e.g. 401k optimization and tax strategies"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">Target Audience</label>
                        <input
                            {...register('target_audience', { required: true })}
                            className="mt-1 block w-full bg-[#020806] border border-white/10 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-gold focus:border-brand-gold sm:text-sm"
                            placeholder="e.g. High-income professionals 45-65"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">Core Keywords (comma separated)</label>
                        <input
                            {...register('keywords', { required: true })}
                            className="mt-1 block w-full bg-[#020806] border border-white/10 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-gold focus:border-brand-gold sm:text-sm"
                            placeholder="e.g. retirement, 401k, tax buckets, wealth preservation"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#020806] bg-brand-gold hover:bg-brand-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold disabled:opacity-50 transition-all font-bold"
                        >
                            {loading ? (
                                <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Generating Strategy...</>
                            ) : (
                                <><Sparkles className="h-5 w-5 mr-2" /> Generate Funnel Strategy</>
                            )}
                        </button>
                    </div>
                </form>
            )}

            {step === 2 && generatedTopics && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* TOFU Section */}
                    <div className="bg-[#0A1210] rounded-xl border border-white/10 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-900/20 to-[#0A1210] px-6 py-4 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white">TOFU (Top of Funnel)</h3>
                            <span className="text-xs font-mono text-blue-400 bg-blue-400/10 px-2 py-1 rounded">Awareness Stage • 3 Articles</span>
                        </div>
                        <div className="divide-y divide-white/5">
                            {generatedTopics.tofu.map((article: any, i: number) => (
                                <div key={i} className="p-6 hover:bg-white/5 transition-colors">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                value={article.title}
                                                onChange={(e) => {
                                                    const newTopics = { ...generatedTopics }
                                                    newTopics.tofu[i].title = e.target.value
                                                    setGeneratedTopics(newTopics)
                                                }}
                                                className="w-full bg-transparent border-none text-white font-medium focus:ring-0 p-0 text-lg mb-1 placeholder-gray-600"
                                                placeholder="Article Title"
                                            />
                                            <p className="text-sm text-gray-400">{article.focus}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MOFU Section */}
                    <div className="bg-[#0A1210] rounded-xl border border-white/10 overflow-hidden">
                        <div className="bg-gradient-to-r from-yellow-900/20 to-[#0A1210] px-6 py-4 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white">MOFU (Middle of Funnel)</h3>
                            <span className="text-xs font-mono text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">Consideration Stage • 2 Articles</span>
                        </div>
                        <div className="divide-y divide-white/5">
                            {generatedTopics.mofu.map((article: any, i: number) => (
                                <div key={i} className="p-6 hover:bg-white/5 transition-colors">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold text-sm">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                value={article.title}
                                                onChange={(e) => {
                                                    const newTopics = { ...generatedTopics }
                                                    newTopics.mofu[i].title = e.target.value
                                                    setGeneratedTopics(newTopics)
                                                }}
                                                className="w-full bg-transparent border-none text-white font-medium focus:ring-0 p-0 text-lg mb-1 placeholder-gray-600"
                                                placeholder="Article Title"
                                            />
                                            <p className="text-sm text-gray-400">{article.focus}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* BOFU Section */}
                    <div className="bg-[#0A1210] rounded-xl border border-white/10 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-900/20 to-[#0A1210] px-6 py-4 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white">BOFU (Bottom of Funnel)</h3>
                            <span className="text-xs font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded">Decision Stage • 1 Article</span>
                        </div>
                        <div className="divide-y divide-white/5">
                            {generatedTopics.bofu.map((article: any, i: number) => (
                                <div key={i} className="p-6 hover:bg-white/5 transition-colors">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-sm">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                value={article.title}
                                                onChange={(e) => {
                                                    const newTopics = { ...generatedTopics }
                                                    newTopics.bofu[i].title = e.target.value
                                                    setGeneratedTopics(newTopics)
                                                }}
                                                className="w-full bg-transparent border-none text-white font-medium focus:ring-0 p-0 text-lg mb-1 placeholder-gray-600"
                                                placeholder="Article Title"
                                            />
                                            <p className="text-sm text-gray-400">{article.focus}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between pt-4">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="px-6 py-3 border border-white/10 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Back to Config
                        </button>
                        <button
                            type="button"
                            onClick={onCreate}
                            disabled={loading}
                            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-bold rounded-md shadow-sm text-[#020806] bg-brand-gold hover:bg-brand-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold disabled:opacity-50 transition-all transform hover:-translate-y-1"
                        >
                            {loading ? (
                                <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Creating Cluster...</>
                            ) : (
                                <><Check className="h-5 w-5 mr-2" /> Approve & Create Cluster</>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

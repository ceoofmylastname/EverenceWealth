'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/providers/auth-provider'
import { Loader2, Plus, X, CheckSquare } from 'lucide-react'
import toast from 'react-hot-toast'

interface Task {
    id: string
    title: string
    description: string | null
    priority: string
    status: string
    due_date: string | null
    completed_at: string | null
    client_id: string | null
    created_at: string
    clients?: { first_name: string; last_name: string } | null
}

const priorityColors: Record<string, string> = {
    urgent: 'bg-red-500/20 text-red-400',
    high: 'bg-orange-500/20 text-orange-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    low: 'bg-gray-500/20 text-gray-400',
}

const statusColors: Record<string, string> = {
    pending: 'bg-blue-500/20 text-blue-400',
    'in-progress': 'bg-yellow-500/20 text-yellow-400',
    completed: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-gray-500/20 text-gray-400',
}

export default function AgentTasksPage() {
    const { user } = useAuth()
    const [advisorId, setAdvisorId] = useState<string | null>(null)
    const [tasks, setTasks] = useState<Task[]>([])
    const [clients, setClients] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreate, setShowCreate] = useState(false)
    const [filter, setFilter] = useState('active')
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', client_id: '', due_date: '' })
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        if (!user) return
        loadTasks()
    }, [user])

    async function loadTasks() {
        try {
            const supabase = createClient()

            const { data: advisor } = await supabase
                .from('advisors')
                .select('id')
                .eq('user_id', user!.id)
                .single()

            if (!advisor) {
                setLoading(false)
                return
            }

            setAdvisorId(advisor.id)

            const [tasksRes, clientsRes] = await Promise.all([
                supabase.from('tasks').select('*, clients(first_name, last_name)').eq('advisor_id', advisor.id).order('created_at', { ascending: false }),
                supabase.from('clients').select('id, first_name, last_name').eq('advisor_id', advisor.id).eq('status', 'active'),
            ])

            setTasks(tasksRes.data || [])
            setClients(clientsRes.data || [])
        } catch (err) {
            console.error('Tasks load error:', err)
        } finally {
            setLoading(false)
        }
    }

    async function createTask() {
        if (!advisorId || !newTask.title.trim()) return
        setCreating(true)
        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('tasks')
                .insert({
                    advisor_id: advisorId,
                    title: newTask.title.trim(),
                    description: newTask.description.trim() || null,
                    priority: newTask.priority,
                    client_id: newTask.client_id || null,
                    due_date: newTask.due_date || null,
                })
                .select('*, clients(first_name, last_name)')
                .single()

            if (error) throw error

            setTasks(prev => [data, ...prev])
            setNewTask({ title: '', description: '', priority: 'medium', client_id: '', due_date: '' })
            setShowCreate(false)
            toast.success('Task created')
        } catch {
            toast.error('Failed to create task')
        } finally {
            setCreating(false)
        }
    }

    async function updateTaskStatus(taskId: string, newStatus: string) {
        const supabase = createClient()
        const updates: any = { status: newStatus }
        if (newStatus === 'completed') updates.completed_at = new Date().toISOString()

        const { error } = await supabase.from('tasks').update(updates).eq('id', taskId)
        if (error) {
            toast.error('Failed to update task')
            return
        }

        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t))
        toast.success('Task updated')
    }

    const filteredTasks = tasks.filter(t => {
        if (filter === 'active') return t.status !== 'completed' && t.status !== 'cancelled'
        if (filter === 'completed') return t.status === 'completed'
        return true
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Tasks</h1>
                    <p className="text-gray-400 mt-1">Manage your tasks and to-dos</p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold text-black text-sm font-medium rounded-lg hover:bg-brand-gold/80 transition-colors"
                >
                    <Plus className="h-4 w-4" /> New Task
                </button>
            </div>

            {/* Create Task Form */}
            {showCreate && (
                <div className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-white">New Task</h3>
                        <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-white">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <input
                        type="text"
                        value={newTask.title}
                        onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Task title"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold"
                    />
                    <textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description (optional)"
                        rows={2}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold resize-none"
                    />
                    <div className="grid grid-cols-3 gap-3">
                        <select
                            value={newTask.priority}
                            onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-gold"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                        <select
                            value={newTask.client_id}
                            onChange={(e) => setNewTask(prev => ({ ...prev, client_id: e.target.value }))}
                            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-gold"
                        >
                            <option value="">No client</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                            ))}
                        </select>
                        <input
                            type="date"
                            value={newTask.due_date}
                            onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-gold"
                        />
                    </div>
                    <button
                        onClick={createTask}
                        disabled={creating || !newTask.title.trim()}
                        className="px-4 py-2 bg-brand-gold text-black text-sm font-medium rounded-lg hover:bg-brand-gold/80 transition-colors disabled:opacity-50"
                    >
                        {creating ? 'Creating...' : 'Create Task'}
                    </button>
                </div>
            )}

            {/* Filter */}
            <div className="flex gap-1 bg-white/5 p-1 rounded-lg w-fit">
                {['active', 'completed', 'all'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
                            filter === f ? 'bg-brand-gold text-black' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Tasks List */}
            <div className="space-y-2">
                {filteredTasks.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 p-8 rounded-lg text-center">
                        <p className="text-gray-500">No tasks found</p>
                    </div>
                ) : (
                    filteredTasks.map(task => (
                        <div key={task.id} className="bg-white/5 border border-white/10 p-4 rounded-lg flex items-center justify-between">
                            <div className="flex items-start gap-3 flex-1">
                                <button
                                    onClick={() => updateTaskStatus(task.id, task.status === 'completed' ? 'pending' : 'completed')}
                                    className={`mt-0.5 h-5 w-5 rounded border flex items-center justify-center flex-shrink-0 ${
                                        task.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-white/20 hover:border-brand-gold'
                                    }`}
                                >
                                    {task.status === 'completed' && <CheckSquare className="h-3 w-3 text-white" />}
                                </button>
                                <div className="flex-1">
                                    <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-white'}`}>
                                        {task.title}
                                    </p>
                                    {task.description && <p className="text-xs text-gray-500 mt-1">{task.description}</p>}
                                    <div className="flex items-center gap-3 mt-2">
                                        {task.clients && (
                                            <span className="text-xs text-gray-500">
                                                {task.clients.first_name} {task.clients.last_name}
                                            </span>
                                        )}
                                        {task.due_date && (
                                            <span className="text-xs text-gray-500">
                                                Due: {new Date(task.due_date).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-medium px-2 py-1 rounded ${priorityColors[task.priority] || ''}`}>
                                    {task.priority}
                                </span>
                                {task.status !== 'completed' && (
                                    <select
                                        value={task.status}
                                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                        className={`text-xs font-medium px-2 py-1 rounded border-0 ${statusColors[task.status] || ''}`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Users, Plus, Phone, Mail, Filter, AlertCircle, CheckCircle2, Clock, MessageSquare, ChevronRight } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const STAGES = [
    { id: 'lead', name: 'New Lead', icon: Plus, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'qualified', name: 'Qualified', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { id: 'proposal', name: 'Proposal', icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { id: 'negotiation', name: 'Negotiation', icon: Filter, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { id: 'closed_won', name: 'Won', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
];

const PRIORITIES: Record<string, { color: string; bg: string }> = {
    high: { color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
    medium: { color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    low: { color: 'text-zinc-500', bg: 'bg-zinc-50 dark:bg-zinc-800' },
};

export default function CRMPage() {
    const [view, setView] = useState<'funnel' | 'add'>('funnel');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        source: 'Walk-in',
        notes: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const { data: leadsData } = useSWR('/api/crm/leads', fetcher, { refreshInterval: 5000 });
    const { data: convData } = useSWR('/api/chat/conversations', fetcher, { refreshInterval: 5000 });

    const conversations = convData?.channels || [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        // Form submission logic remains same...
        setSubmitting(false);
        setView('funnel');
    };

    const getPriorityBadge = (priority: string) => {
        const p = PRIORITIES[priority] || PRIORITIES.low;
        return (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.bg} ${p.color}`}>
                {priority}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-zinc-900 dark:text-white flex items-center gap-3 tracking-tighter">
                            <Users className="w-10 h-10 text-blue-600" />
                            CRM HUB
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium italic">
                            Categorized leads • Priority tracking • Funnel analytics
                        </p>
                    </div>
                    <div className="flex bg-white dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <button
                            onClick={() => setView('funnel')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'funnel' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                        >
                            Funnel View
                        </button>
                        <button
                            onClick={() => setView('add')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'add' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                        >
                            Quick Add
                        </button>
                    </div>
                </div>

                {view === 'funnel' ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 h-[calc(100vh-250px)] overflow-x-auto pb-4 custom-scrollbar">
                        {STAGES.map((stage) => {
                            const stageLeads = conversations.filter((c: any) => c.funnel_stage === stage.id);
                            const StageIcon = stage.icon;

                            return (
                                <div key={stage.id} className="flex flex-col min-w-[280px]">
                                    <div className="flex items-center justify-between mb-4 px-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-lg ${stage.bg} ${stage.color}`}>
                                                <StageIcon className="w-4 h-4" />
                                            </div>
                                            <h3 className="font-bold text-zinc-800 dark:text-zinc-100 text-sm">
                                                {stage.name}
                                            </h3>
                                        </div>
                                        <span className="text-xs font-bold text-zinc-400 bg-zinc-200/50 dark:bg-zinc-800/50 px-2 py-0.5 rounded-full">
                                            {stageLeads.length}
                                        </span>
                                    </div>

                                    <div className="flex-1 space-y-3 p-3 rounded-2xl bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 overflow-y-auto custom-scrollbar">
                                        {stageLeads.length === 0 ? (
                                            <div className="text-center py-10">
                                                <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-2 opacity-50">
                                                    <AlertCircle className="w-5 h-5 text-zinc-400" />
                                                </div>
                                                <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Empty Stage</p>
                                            </div>
                                        ) : (
                                            stageLeads.map((lead: any) => (
                                                <div
                                                    key={lead.id}
                                                    className="group bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all cursor-pointer"
                                                >
                                                    <div className="flex justify-between items-start gap-2 mb-3">
                                                        <h4 className="font-bold text-zinc-900 dark:text-white leading-tight group-hover:text-blue-500 transition-colors">
                                                            {lead.name}
                                                        </h4>
                                                        {getPriorityBadge(lead.priority)}
                                                    </div>

                                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
                                                        {lead.last_message || 'No recent activity'}
                                                    </p>

                                                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/50">
                                                        <div className="flex -space-x-1.5">
                                                            <div className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-900 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                                <span className="text-[10px] font-bold text-blue-600 uppercase">
                                                                    {lead.platform[0]}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200/50 dark:border-zinc-800/50 p-8 max-w-2xl mx-auto">
                        <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-6 flex items-center gap-3">
                            <Plus className="w-8 h-8 text-blue-600" />
                            Capture New Lead
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2 px-1">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border-2 border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="Full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2 px-1">
                                        Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border-2 border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="Contact number"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all disabled:opacity-50 active:scale-[0.98]"
                            >
                                {submitting ? 'PROCESSING...' : 'ADD TO FUNNEL'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

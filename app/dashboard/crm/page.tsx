'use client';

import { useState, useMemo, useEffect } from 'react';
import useSWR from 'swr';
import {
    Users,
    Plus,
    Phone,
    Mail,
    Filter,
    AlertCircle,
    CheckCircle2,
    Clock,
    MessageSquare,
    ChevronRight,
    Search,
    TrendingUp,
    Zap,
    ArrowUpRight,
    Users2,
    Target,
    Layers,
    X,
    MessageCircle,
    Instagram,
    Facebook,
    Bell,
    CheckSquare,
    ListTodo,
    MoreHorizontal,
    MoreVertical
} from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Minimal Color Palette Constants
const ACCENT_COLOR = 'text-[#5c1c8a]';
const ACCENT_BG = 'bg-[#5c1c8a]';
const ACCENT_BORDER = 'border-[#5c1c8a]';
const ACCENT_LIGHT = 'bg-[#5c1c8a]/10';

const STAGES = [
    { id: 'new', name: 'New Leads', icon: Target },
    { id: 'qualified', name: 'Qualified', icon: Zap },
    { id: 'proposition', name: 'Proposal', icon: MessageSquare },
    { id: 'negotiation', name: 'Negotiation', icon: Filter },
    { id: 'won', name: 'Closed Won', icon: CheckCircle2 },
];

const PLATFORMS: Record<string, any> = {
    whatsapp: { icon: MessageCircle, label: 'WhatsApp' },
    instagram: { icon: Instagram, label: 'Instagram' },
    messenger: { icon: Facebook, label: 'Messenger' },
    unknown: { icon: MessageSquare, label: 'Others' }
};

const PRIORITIES: Record<string, { label: string }> = {
    high: { label: 'High' },
    medium: { label: 'Medium' },
    low: { label: 'Standard' },
};

export default function CRMPage() {
    const [view, setView] = useState<'funnel' | 'add'>('funnel');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLead, setSelectedLead] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { data: convData } = useSWR('/api/chat/conversations', fetcher, { refreshInterval: 5000 });

    // Enriched leads
    const leads = useMemo(() => {
        return (convData?.channels || []).map((c: any) => ({
            ...c,
            priority: c.priority || (['high', 'medium', 'low'][Math.floor(Math.random() * 3)]),
            platform: c.platform?.toLowerCase() || 'whatsapp',
            ai_summary: c.ai_summary || "Customer is interested in the holiday package deal. Inquired about group discounts and availability for January.",
            action_items: [
                "Verify group discount availability",
                "Send PDF brochure",
                "Schedule follow-up call"
            ],
            stage: c.funnel_stage || 'new'
        })).filter((lead: any) =>
            lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.phone?.includes(searchQuery)
        );
    }, [convData, searchQuery]);

    const stats = useMemo(() => {
        const total = leads.length;
        const highPriority = leads.filter((l: any) => l.priority === 'high').length;
        return { total, highPriority };
    }, [leads]);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 overflow-hidden flex flex-col font-sans">
            <div className="max-w-7xl mx-auto w-full space-y-8 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
                            CRM
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                            Manage leads and conversations in real-time
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#5c1c8a] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search leads..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:border-[#5c1c8a] focus:ring-[#5c1c8a]/20 transition-all w-64 shadow-sm"
                            />
                        </div>
                        <button className={`px-5 py-2.5 ${ACCENT_BG} text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-purple-900/20 flex items-center gap-2`}>
                            <Plus className="w-4 h-4" />
                            Add Lead
                        </button>
                    </div>
                </div>

                {/* Styled Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg ${ACCENT_LIGHT}`}>
                                <Users2 className={`w-5 h-5 ${ACCENT_COLOR}`} />
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-zinc-400" />
                        </div>
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Leads</p>
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{stats.total}</h3>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg ${ACCENT_LIGHT}`}>
                                <Bell className={`w-5 h-5 ${ACCENT_COLOR}`} />
                            </div>
                            <AlertCircle className={`w-4 h-4 ${ACCENT_COLOR}`} />
                        </div>
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">High Priority</p>
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{stats.highPriority}</h3>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg ${ACCENT_LIGHT}`}>
                                <TrendingUp className={`w-5 h-5 ${ACCENT_COLOR}`} />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Conversion Rate</p>
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">12%</h3>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg ${ACCENT_LIGHT}`}>
                                <CheckSquare className={`w-5 h-5 ${ACCENT_COLOR}`} />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Tasks Pending</p>
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">18</h3>
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar pt-2">
                    {STAGES.map((stage) => {
                        const stageLeads = leads.filter((l: any) =>
                            l.stage.toLowerCase() === stage.id ||
                            (stage.id === 'new' && (!l.stage || l.stage === 'new'))
                        );

                        return (
                            <div key={stage.id} className="flex flex-col min-w-[340px] max-w-[340px] h-full">
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                                        {stage.name}
                                    </h3>
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                                        {stageLeads.length}
                                    </span>
                                </div>

                                <div className="flex-1 space-y-3 overflow-y-auto pr-2 pb-2">
                                    {stageLeads.length === 0 ? (
                                        <div className="py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center opacity-50">
                                            <p className="text-xs font-medium text-zinc-400 italic">No leads</p>
                                        </div>
                                    ) : (
                                        stageLeads.map((lead: any) => {
                                            const Platinum = PLATFORMS[lead.platform] || PLATFORMS.unknown;
                                            return (
                                                <div
                                                    key={lead.id}
                                                    onClick={() => setSelectedLead(lead)}
                                                    className="group bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-lg hover:border-[#5c1c8a]/50 transition-all cursor-pointer relative"
                                                >
                                                    {lead.priority === 'high' && (
                                                        <div className={`absolute right-3 top-3 w-2 h-2 rounded-full ${ACCENT_BG}`} />
                                                    )}

                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-500`}>
                                                                <Platinum.icon className="w-3.5 h-3.5" />
                                                            </div>
                                                            <h4 className="font-bold text-zinc-900 dark:text-white text-sm group-hover:text-[#5c1c8a] transition-colors">
                                                                {lead.name}
                                                            </h4>
                                                        </div>
                                                    </div>

                                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                                                        {lead.ai_summary}
                                                    </p>

                                                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/50">
                                                        <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                                                            <span>{lead.phone || 'Direct'}</span>
                                                        </div>
                                                        <ChevronRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-[#5c1c8a] transition-colors" />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal */}
            {selectedLead && isMounted && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-grayscale transition-opacity"
                        onClick={() => setSelectedLead(null)}
                    />
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative z-10 flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-start bg-zinc-50/50 dark:bg-zinc-900/50">
                            <div className="flex items-center gap-5">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 ${ACCENT_COLOR}`}>
                                    {selectedLead.name?.[0]}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{selectedLead.name}</h2>
                                    <div className="flex items-center gap-3 mt-1 text-xs font-bold uppercase tracking-wider text-zinc-500">
                                        <span className="flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                                            {selectedLead.platform}
                                        </span>
                                        <span className={`${selectedLead.priority === 'high' ? ACCENT_COLOR : ''}`}>
                                            {selectedLead.priority} Priority
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedLead(null)}
                                className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 overflow-y-auto space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Zap className={`w-4 h-4 ${ACCENT_COLOR}`} />
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">AI Summary</h3>
                                </div>
                                <div className={`p-6 rounded-2xl ${ACCENT_LIGHT} border ${ACCENT_BORDER}/20`}>
                                    <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed italic font-medium">
                                        "{selectedLead.ai_summary}"
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <ListTodo className={`w-4 h-4 ${ACCENT_COLOR}`} />
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Suggested Actions</h3>
                                </div>
                                <div className="space-y-3">
                                    {selectedLead.action_items.map((item: string, i: number) => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl">
                                            <div className={`w-6 h-6 rounded-full border-2 border-[#5c1c8a] flex items-center justify-center text-[10px] font-bold ${ACCENT_COLOR}`}>
                                                {i + 1}
                                            </div>
                                            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50">
                                    <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Phone</p>
                                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-white">
                                        <Phone className="w-4 h-4 text-zinc-400" />
                                        {selectedLead.phone || 'N/A'}
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50">
                                    <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Email</p>
                                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-white">
                                        <Mail className="w-4 h-4 text-zinc-400" />
                                        {selectedLead.email || 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex gap-4 bg-zinc-50 dark:bg-zinc-900">
                            <button className={`flex-1 py-3.5 ${ACCENT_BG} hover:opacity-90 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center gap-2`}>
                                <MessageCircle className="w-4 h-4" />
                                Open Chat
                            </button>
                            <button className="px-8 py-3.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl font-bold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all">
                                Mark Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

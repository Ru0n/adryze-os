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
    ListTodo
} from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const STAGES = [
    { id: 'new', name: 'New Leads', icon: Target, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-900/30' },
    { id: 'qualified', name: 'Qualified', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-100 dark:border-purple-900/30' },
    { id: 'proposition', name: 'Proposal', icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-100 dark:border-orange-900/30' },
    { id: 'negotiation', name: 'Negotiation', icon: Filter, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-900/30' },
    { id: 'won', name: 'Closed Won', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-100 dark:border-green-900/30' },
];

const PLATFORMS: Record<string, any> = {
    whatsapp: { icon: MessageCircle, color: 'text-green-500', label: 'WhatsApp' },
    instagram: { icon: Instagram, color: 'text-pink-500', label: 'Instagram' },
    messenger: { icon: Facebook, color: 'text-blue-500', label: 'Messenger' },
    unknown: { icon: MessageSquare, color: 'text-zinc-500', label: 'Others' }
};

const PRIORITIES: Record<string, { color: string; bg: string; label: string }> = {
    high: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', label: 'High Priority' },
    medium: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', label: 'Medium' },
    low: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', label: 'Standard' },
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

    // Enriched leads from chats with added demo logic for priority and tasks
    const leads = useMemo(() => {
        return (convData?.channels || []).map((c: any) => ({
            ...c,
            // Synthetic data for the demo to show priority and action items
            priority: c.priority || (['high', 'medium', 'low'][Math.floor(Math.random() * 3)]),
            platform: c.platform?.toLowerCase() || 'whatsapp',
            ai_summary: c.ai_summary || "Customer is interested in the holiday package deal. Inquired about group discounts and availability for January.",
            action_items: [
                "Verify group discount availability",
                "Send PDF brochure via " + (c.platform || 'WhatsApp'),
                "Schedule follow-up call for tomorrow"
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
        const recent = total > 0 ? 5 : 0; // Simulated
        return { total, highPriority, recent };
    }, [leads]);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black p-8 overflow-hidden flex flex-col">
            <div className="max-w-[1700px] mx-auto w-full space-y-8 flex-1 flex flex-col">
                {/* Header section... */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
                    <div>
                        <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter flex items-center gap-3">
                            <Layers className="w-10 h-10 text-blue-600" />
                            CHANNELS CRM
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium italic">
                            Agent Dashboard • Omnichannel Tracking • AI Summaries
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search customers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all w-72 shadow-sm"
                            />
                        </div>
                        <div className="flex bg-white dark:bg-zinc-900 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <button className="px-5 py-2 rounded-lg text-sm font-bold bg-blue-600 text-white shadow-lg">Funnel View</button>
                        </div>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <div className="flex justify-between mb-4">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600"><Users2 className="w-5 h-5" /></div>
                            <span className="text-[10px] font-bold text-green-600">+4 Today</span>
                        </div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Active Leads</p>
                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">{stats.total}</h3>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <div className="flex justify-between mb-4">
                            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600"><Bell className="w-5 h-5" /></div>
                            <span className="text-[10px] font-bold text-red-600">Urgent</span>
                        </div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">High Priority</p>
                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">{stats.highPriority}</h3>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <div className="flex justify-between mb-4">
                            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600"><TrendingUp className="w-5 h-5" /></div>
                        </div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Daily Success Rate</p>
                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">12%</h3>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <div className="flex justify-between mb-4">
                            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600"><CheckSquare className="w-5 h-5" /></div>
                        </div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Tasks Pending</p>
                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">18</h3>
                    </div>
                </div>

                {/* Funnel Layout */}
                <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
                    {STAGES.map((stage) => {
                        const stageLeads = leads.filter((l: any) =>
                            l.stage.toLowerCase() === stage.id ||
                            (stage.id === 'new' && (!l.stage || l.stage === 'new'))
                        );

                        return (
                            <div key={stage.id} className="flex flex-col min-w-[340px] max-w-[340px] h-full">
                                <div className={`p-4 rounded-t-2xl border-t-2 border-x ${stage.border} ${stage.bg} flex items-center justify-between shrink-0`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-lg bg-white dark:bg-black/20 ${stage.color}`}>
                                            <stage.icon className="w-4 h-4" />
                                        </div>
                                        <h3 className={`font-black text-sm uppercase tracking-tighter ${stage.color}`}>
                                            {stage.name}
                                        </h3>
                                    </div>
                                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-white/60 dark:bg-black/30 text-zinc-600 dark:text-zinc-400">
                                        {stageLeads.length}
                                    </span>
                                </div>

                                <div className="flex-1 bg-zinc-100/40 dark:bg-zinc-900/30 border-x border-b border-zinc-200 dark:border-zinc-800 p-4 space-y-4 rounded-b-2xl overflow-y-auto overflow-x-hidden">
                                    {stageLeads.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-20 opacity-20">
                                            <AlertCircle className="w-10 h-10 mb-2" />
                                            <p className="text-[10px] font-bold uppercase tracking-widest italic">Clear Channel</p>
                                        </div>
                                    ) : (
                                        stageLeads.map((lead: any) => {
                                            const Platinum = PLATFORMS[lead.platform] || PLATFORMS.unknown;
                                            const Priority = PRIORITIES[lead.priority] || PRIORITIES.low;

                                            return (
                                                <div
                                                    key={lead.id}
                                                    onClick={() => setSelectedLead(lead)}
                                                    className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-blue-500/50 hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
                                                >
                                                    {/* Card Header */}
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 ${Platinum.color}`}>
                                                                <Platinum.icon className="w-3.5 h-3.5" />
                                                            </div>
                                                            <h4 className="font-bold text-zinc-900 dark:text-white leading-tight truncate max-w-[140px] group-hover:text-blue-600 transition-colors">
                                                                {lead.name}
                                                            </h4>
                                                        </div>
                                                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${Priority.bg} ${Priority.color}`}>
                                                            {lead.priority}
                                                        </span>
                                                    </div>

                                                    {/* AI Summary Preview */}
                                                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 italic leading-relaxed">
                                                        "{lead.ai_summary}"
                                                    </p>

                                                    {/* Footer Meta */}
                                                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/50">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500 uppercase">
                                                                {lead.name?.[0]}
                                                            </div>
                                                            <span className="text-[10px] font-bold text-zinc-400">
                                                                {lead.phone || 'Direct'}
                                                            </span>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
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

            {/* Premium Detail Modal */}
            {selectedLead && isMounted && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedLead(null)}
                    />
                    <div className="bg-white dark:bg-zinc-950 w-full max-w-2xl rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative transform transition-all scale-100 flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-50/50 dark:bg-zinc-900/50">
                            <div className="flex items-center gap-5">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-inner ${PLATFORMS[selectedLead.platform]?.color} bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800`}>
                                    {selectedLead.name?.[0]}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">{selectedLead.name}</h2>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${PRIORITIES[selectedLead.priority]?.bg} ${PRIORITIES[selectedLead.priority]?.color}`}>
                                            {selectedLead.priority} Priority
                                        </span>
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                                            <PLATFORMS.whatsapp.icon className="w-2.5 h-2.5" />
                                            via {selectedLead.platform}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedLead(null)}
                                className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shadow-sm"
                            >
                                <X className="w-5 h-5 text-zinc-500" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 space-y-8 overflow-y-auto">
                            {/* AI Intelligence Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Gemini Lead Analysis</h3>
                                </div>
                                <div className="p-6 bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-3xl relative">
                                    <div className="absolute -top-3 left-6 px-3 py-1 bg-purple-600 text-white text-[9px] font-black rounded-full shadow-lg">SUMMARY</div>
                                    <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed italic text-lg font-medium">
                                        "{selectedLead.ai_summary}"
                                    </p>
                                </div>
                            </div>

                            {/* Action Items Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <ListTodo className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Required Actions</h3>
                                </div>
                                <div className="grid gap-3">
                                    {selectedLead.action_items.map((item: string, i: number) => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl group hover:border-orange-500/50 transition-all">
                                            <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center text-[10px] font-black text-orange-500">
                                                {i + 1}
                                            </div>
                                            <p className="text-sm font-bold text-zinc-700 dark:text-zinc-200">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Contact Footer */}
                            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 gap-4">
                                <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-zinc-400" />
                                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200">{selectedLead.phone || 'N/A'}</span>
                                </div>
                                <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-zinc-400" />
                                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200">{selectedLead.email || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="p-8 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 flex gap-4 shrink-0">
                            <button className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                                <MessageCircle className="w-4 h-4" />
                                OPEN CHAT
                            </button>
                            <button className="px-8 py-4 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 rounded-2xl font-black text-sm hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all">
                                MARK COMPLETED
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


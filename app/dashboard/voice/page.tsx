'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    CheckCircle2,
    XCircle,
    Clock,
    Phone,
    Play,
    Info,
    ArrowUpRight,
    TrendingUp,
    Zap,
    Search,
    ChevronRight,
    Volume2,
    Calendar,
    Badge,
    X,
    Maximize2
} from 'lucide-react';

const mockCalls = [
    {
        id: '1',
        carrier: 'Ncell',
        trunk_id: 'ST_SIP_KTM_01',
        caller: '+9779801234567',
        status: 'Completed',
        duration: 145,
        recording_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        summary: 'Customer inquired about Ncell data pack validity; Agent provided info on the 30-day pack and confirmed balance.',
        timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    },
    {
        id: '2',
        carrier: 'Ncell',
        trunk_id: 'ST_SIP_KTM_02',
        caller: '+9779802345678',
        status: 'Missed',
        duration: 0,
        recording_url: null,
        summary: 'No conversation recorded.',
        timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
    },
    {
        id: '3',
        carrier: 'Ncell',
        trunk_id: 'ST_SIP_KTM_01',
        caller: '+9779813456789',
        status: 'Completed',
        duration: 88,
        recording_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        summary: 'User reported issues with SMS delivery. AI Troubleshot terminal settings and confirmed service restoration.',
        timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    },
    {
        id: '4',
        carrier: 'Ncell',
        trunk_id: 'ST_SIP_KTM_03',
        caller: '+9779804567890',
        status: 'Completed',
        duration: 320,
        recording_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        summary: 'Corporate inquiry regarding bulk SMS rates for festive season. AI summarized pricing tiers and sent brochure link.',
        timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    },
    {
        id: '5',
        carrier: 'Ncell',
        trunk_id: 'ST_SIP_KTM_01',
        caller: '+9779805678901',
        status: 'Rejected',
        duration: 0,
        recording_url: null,
        summary: 'Call blocked by user preference.',
        timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
    },
    {
        id: '6',
        carrier: 'Ncell',
        trunk_id: 'ST_SIP_KTM_02',
        caller: '+9779816789012',
        status: 'Completed',
        duration: 210,
        recording_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        summary: 'Balance inquiry and roaming activation request. AI verified identity and activated roaming plan for 7 days.',
        timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
    }
];

export default function VoiceIntelligenceDashboard() {
    const [selectedCall, setSelectedCall] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Memoize waveform heights to keep them stable and only on client
    const waveformHeights = useMemo(() =>
        [...Array(30)].map(() => Math.random() * 100),
        []);

    const handleCallClick = (call: any) => {
        setSelectedCall(call);
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const getTimeAgo = (timestamp: string) => {
        if (!isMounted) return '...';
        const diff = Date.now() - new Date(timestamp).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        return `${hours}h ago`;
    };

    return (
        <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto p-8 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-end shrink-0">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Voice Intelligence</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Real-time carrier-grade insights for Ncell traffic</p>
                    </div>
                    <div className="flex gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium border border-green-200 dark:border-green-800">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Live Gateways: 4
                        </span>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-zinc-400" />
                        </div>
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Ncell Traffic</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">1,240</h3>
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">+12% from peak</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <TrendingUp className="w-4 h-4 text-zinc-400" />
                        </div>
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">AI Resolution Rate</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">94%</h3>
                            <span className="text-xs font-medium text-purple-600 dark:text-purple-400">High Efficiency</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <Badge className="w-4 h-4 text-zinc-400" />
                        </div>
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Avg. Latency</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">450ms</h3>
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">Ultra Fast</span>
                        </div>
                    </div>
                </div>

                {/* Call Table */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex-1">
                    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                        <h3 className="font-semibold text-zinc-900 dark:text-white">Recent Call Logs</h3>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search numbers..."
                                className="pl-9 pr-4 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none text-sm focus:ring-2 focus:ring-blue-500 w-64"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-800/30">
                                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Source</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Destination</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">AI Summary</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                                {mockCalls.map((call) => (
                                    <tr
                                        key={call.id}
                                        onClick={() => handleCallClick(call)}
                                        className={`hover:bg-blue-50/50 dark:hover:bg-blue-900/5 cursor-pointer transition-colors ${selectedCall?.id === call.id ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                    >
                                        <td className="px-6 py-4">
                                            {call.status === 'Completed' ? (
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            ) : call.status === 'Missed' ? (
                                                <Clock className="w-5 h-5 text-amber-500" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-500" />
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                            {getTimeAgo(call.timestamp)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                                            {call.caller}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                                                Adryze_AI_Node_01
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400 max-w-xs truncate">
                                            {call.summary}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                                    <Play className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                </button>
                                                <button className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                                    <Info className="w-4 h-4 text-zinc-400" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Player */}
            {selectedCall && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedCall(null)}
                    />
                    <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${selectedCall.status === 'Completed' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-red-100 dark:bg-red-900/20 text-red-600'}`}>
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{selectedCall.caller}</h2>
                                    <p className="text-sm text-zinc-500 font-medium">
                                        {selectedCall.status} • {formatDuration(selectedCall.duration)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                                    <Maximize2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setSelectedCall(null)}
                                    className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 overflow-y-auto space-y-8">

                            {/* Audio Player Container */}
                            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700/50 space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-xs font-mono text-zinc-500">VOICE_EGRESS_STABLE.mp3</span>
                                    </div>
                                    <span className="text-xs text-zinc-400">{formatDuration(selectedCall.duration)}</span>
                                </div>

                                <div className="h-16 flex items-center gap-1">
                                    {isMounted && waveformHeights.map((height, i) => (
                                        <div
                                            key={i}
                                            className={`flex-1 rounded-full bg-blue-500/20 dark:bg-blue-400/20 transition-all duration-300 hover:bg-blue-500 hover:scale-110`}
                                            style={{ height: `${height}%`, backgroundColor: i < 12 ? 'rgb(59 130 246)' : '' }}
                                        />
                                    ))}
                                </div>

                                <div className="flex items-center gap-4">
                                    <button className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95">
                                        <Play className="w-5 h-5 fill-current ml-0.5" />
                                    </button>
                                    <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full relative overflow-hidden cursor-pointer group">
                                        <div className="absolute inset-y-0 left-0 w-1/3 bg-blue-600 group-hover:bg-blue-500 transition-colors" />
                                    </div>
                                    <Volume2 className="w-5 h-5 text-zinc-400" />
                                </div>
                            </div>

                            {/* Intelligence Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Gemini AI Summary</h3>
                                </div>
                                <div className="p-6 bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-3 opacity-10">
                                        <Zap className="w-24 h-24 text-purple-600" />
                                    </div>
                                    <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed italic text-lg relative z-10">
                                        "{selectedCall.summary}"
                                    </p>
                                </div>
                            </div>

                            {/* Metadata Section */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700/50">
                                    <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Carrier</p>
                                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{selectedCall.carrier}</p>
                                </div>
                                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700/50">
                                    <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Trunk ID</p>
                                    <p className="text-sm font-mono text-zinc-900 dark:text-white">{selectedCall.trunk_id}</p>
                                </div>
                                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700/50">
                                    <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Gateway</p>
                                    <p className="text-sm font-medium text-zinc-900 dark:text-white">KTM_DC_12</p>
                                </div>
                                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700/50">
                                    <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Protocol</p>
                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">SIP/WSS</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


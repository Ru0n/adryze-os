'use client';

import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import {
    MessageCircle,
    Send,
    Search,
    MoreVertical,
    CheckCheck,
    Image as ImageIcon,
    Paperclip,
    Bot,
    User,
    ShieldAlert,
    Pause,
    Info,
    ChevronLeft
} from 'lucide-react';
import { supabase } from '@/lib/supabase';


const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Official Logos (Simplifying with high-quality SVGs/Icons and Brand Colors)
const platforms = [
    {
        id: 'all',
        name: 'All Chats',
        icon: MessageCircle,
        color: 'text-zinc-500',
        activeBg: 'bg-zinc-100 dark:bg-zinc-800'
    },
    {
        id: 'whatsapp',
        name: 'WhatsApp',
        iconColor: '#25D366',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
        activeBg: 'bg-green-50 dark:bg-green-900/10'
    },
    {
        id: 'instagram',
        name: 'Instagram',
        iconColor: '#E4405F',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg',
        activeBg: 'bg-pink-50 dark:bg-pink-900/10'
    },
    {
        id: 'facebook',
        name: 'Facebook',
        iconColor: '#1877F2',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg',
        activeBg: 'bg-blue-50 dark:bg-blue-900/10'
    },
    {
        id: 'tiktok',
        name: 'TikTok',
        iconColor: '#000000',
        logo: 'https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg',
        activeBg: 'bg-zinc-100 dark:bg-zinc-800'
    },
];

// Platform color mapping for message bubbles
const platformColors: Record<string, { bg: string; dot: string; dotClass: string }> = {
    whatsapp: {
        bg: 'bg-[#25D366]',
        dot: '#25D366',
        dotClass: 'bg-[#25D366]'
    },
    facebook: {
        bg: 'bg-[#0084FF]',
        dot: '#0084FF',
        dotClass: 'bg-[#0084FF]'
    },
    instagram: {
        bg: 'bg-gradient-to-r from-[#E4405F] to-[#C13584]',
        dot: '#E4405F',
        dotClass: 'bg-[#E4405F]'
    },
    tiktok: {
        bg: 'bg-zinc-700',
        dot: '#71717a',
        dotClass: 'bg-zinc-500'
    },
};

export default function ChatPage() {
    const [selectedPlatform, setSelectedPlatform] = useState('all');
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [messageInput, setMessageInput] = useState('');
    const [sending, setSending] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch conversations
    const { data: conversationsData, mutate: mutateConversations } = useSWR(
        `/api/chat/conversations?platform=${selectedPlatform}`,
        fetcher,
        { refreshInterval: 5000 }
    );

    // Fetch messages
    const { data: messagesData } = useSWR(
        selectedConversation ? `/api/chat/messages?conversationId=${selectedConversation.id}` : null,
        fetcher
    );

    const conversations = conversationsData?.channels || [];
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        if (messagesData?.messages) {
            setMessages(messagesData.messages);
        }
    }, [messagesData]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Supabase Realtime
    useEffect(() => {
        if (!selectedConversation) return;

        const messageSub = supabase
            .channel(`msg_${selectedConversation.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${selectedConversation.id}`
            }, (payload) => {
                setMessages(prev => [...prev, payload.new]);
                mutateConversations();
            })
            .subscribe();

        const convSub = supabase
            .channel(`conv_${selectedConversation.id}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'conversations',
                filter: `id=eq.${selectedConversation.id}`
            }, (payload) => {
                setSelectedConversation(payload.new);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(messageSub);
            supabase.removeChannel(convSub);
        };
    }, [selectedConversation, mutateConversations]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedConversation) return;

        setSending(true);
        const text = messageInput;
        setMessageInput('');

        try {
            await fetch('/api/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId: selectedConversation.id,
                    message: text,
                    author_role: 'agent'
                }),
            });
        } catch (error) {
            console.error(error);
            setMessageInput(text);
        } finally {
            setSending(false);
        }
    };

    const toggleAI = async () => {
        if (!selectedConversation) return;
        const newStatus = selectedConversation.status === 'automated' ? 'manual' : 'automated';
        await supabase.from('conversations').update({ status: newStatus }).eq('id', selectedConversation.id);
        mutateConversations();
    };


    // Get current platform colors
    const currentPlatform = selectedConversation?.platform || selectedPlatform || 'tiktok';
    const platformColor = platformColors[currentPlatform] || platformColors.tiktok;

    return (
        <div className="h-full flex bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
            {/* 1. Platform Bar (Thin & Clean) */}
            <div className="w-16 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center py-6 gap-6">
                {platforms.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => setSelectedPlatform(p.id)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedPlatform === p.id ? 'ring-2 ring-zinc-400 dark:ring-zinc-500 bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-200 dark:hover:bg-zinc-800'
                            }`}
                        title={p.name}
                    >
                        {p.logo ? (
                            <img src={p.logo} alt={p.name} className="w-6 h-6 object-contain" />
                        ) : (
                            p.icon && <p.icon className="w-6 h-6" />
                        )}
                    </button>
                ))}
            </div>

            {/* 2. Chat List */}
            <div className={`border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-80'}`}>
                <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
                    {!isSidebarCollapsed && <h1 className="text-lg font-bold">Messages</h1>}
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <ChevronLeft className={`w-5 h-5 transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {!isSidebarCollapsed && (
                    <div className="px-3 py-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                            <input
                                placeholder="Search chats..."
                                className="w-full bg-zinc-100 dark:bg-zinc-900/50 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-600"
                            />
                        </div>
                    </div>
                )}

                {/* Filter Pills */}
                {!isSidebarCollapsed && (
                    <div className="px-3 py-2 flex items-center gap-2">
                        {['All', 'Unread'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeFilter === filter
                                    ? `${platformColor.bg} text-white shadow-sm`
                                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {conversations.map((conv: any) => (
                        <button
                            key={conv.id}
                            onClick={() => setSelectedConversation(conv)}
                            className={`w-full p-3 flex gap-3 border-b border-zinc-200 dark:border-zinc-800/50 transition-colors ${selectedConversation?.id === conv.id ? 'bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                                }`}
                        >
                            <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden flex-shrink-0">
                                {conv.avatar_url ? (
                                    <img src={conv.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-600 dark:text-zinc-400 font-bold">
                                        {conv.name[0]}
                                    </div>
                                )}
                            </div>
                            {!isSidebarCollapsed && (
                                <div className="flex-1 min-w-0 text-left">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-sm font-semibold truncate">{conv.name}</span>
                                        <span className="text-[10px] text-zinc-500 dark:text-zinc-500">
                                            {conv.updated_at ? new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-1">
                                        {conv.last_message || 'New message'}
                                    </p>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. Chat Window */}
            <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                    <>
                        <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 flex items-center justify-between px-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-200">
                                    {selectedConversation.name[0]}
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold">{selectedConversation.name}</h2>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${platformColor.dotClass}`} />
                                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-bold">
                                            {selectedConversation.platform}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={toggleAI}
                                className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all ${selectedConversation.status === 'automated'
                                    ? `${platformColor.bg} text-white border-transparent`
                                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700'
                                    }`}
                            >
                                {selectedConversation.status === 'automated' ? 'AI ACTIVE' : 'MANUAL MODE'}
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            {messages.map((msg, i) => {
                                const isAgent = msg.author_role !== 'user';
                                const isAI = msg.author_role === 'ai';
                                return (
                                    <div key={msg.id || i} className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] ${isAgent ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                                            <div className={`px-4 py-2 rounded-2xl text-sm ${isAgent
                                                ? `${platformColor.bg} text-white rounded-tr-sm`
                                                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-sm'
                                                }`}>
                                                {msg.body}
                                            </div>
                                            <div className="flex items-center gap-1 px-1">
                                                {isAI && <Bot className="w-3 h-3 text-blue-500" />}
                                                <span className="text-[9px] text-zinc-500 dark:text-zinc-400 font-medium lowercase">
                                                    {isAI ? 'ai agent' : isAgent ? 'human agent' : ''}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30">
                            {selectedConversation.status === 'manual' && (
                                <div className="mb-3 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 text-[10px] font-bold text-amber-700 dark:text-amber-500 border border-amber-200 dark:border-amber-900/30 rounded-lg flex items-center gap-2">
                                    <ShieldAlert className="w-3.5 h-3.5" />
                                    AI DISABLED FOR THIS CHAT
                                </div>
                            )}
                            <form onSubmit={handleSendMessage} className="flex gap-2 items-center bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-2 px-4">
                                <button type="button" className="text-zinc-500 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400"><Paperclip className="w-5 h-5" /></button>
                                <textarea
                                    rows={1}
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent border-none outline-none text-sm py-2 resize-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
                                />
                                <button type="submit" disabled={!messageInput.trim()} className={`${platformColor.dotClass} text-white p-1.5 rounded-lg disabled:opacity-30 transition-opacity`}><Send className="w-5 h-5" /></button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-40">
                        <MessageCircle className="w-16 h-16 mb-4" />
                        <h3 className="text-lg font-bold">Select a conversation</h3>
                        <p className="max-w-xs text-xs mt-2">Pick a chat from the list to start messaging with your customers across platforms.</p>
                    </div>
                )
                }
            </div>
        </div>
    );
}

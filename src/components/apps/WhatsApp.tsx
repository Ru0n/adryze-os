import { useState } from 'react';
import {
    Search,
    MoreVertical,
    MessageSquarePlus,
    Users,
    CircleDashed,
    Phone,
    Video,
    Smile,
    Plus,
    Mic,
    Check,
    CheckCheck,
    Menu,
    Filter,
    AlertTriangle,
    Bot
} from 'lucide-react';
import Image from 'next/image';

// WhatsApp specific colors
// bg-panel-header: #202c33
// bg-conversation: #0b141a
// bg-incoming: #202c33
// bg-outgoing: #005c4b
// text-primary: #e9edef
// text-secondary: #8696a0
// accent: #00a884

interface WhatsAppProps {
    conversations: any[];
    selectedConversation: any;
    onSelectConversation: (conversation: any) => void;
    messages: any[];
    onSendMessage: (text: string) => void;
    onToggleAI?: () => void;
    currentUser?: any;
}

export default function WhatsApp({
    conversations,
    selectedConversation,
    onSelectConversation,
    messages,
    onSendMessage,
    onToggleAI
}: WhatsAppProps) {
    const [inputText, setInputText] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputText.trim()) {
            onSendMessage(inputText);
            setInputText('');
        }
    };

    const formatTime = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const isManualMode = selectedConversation?.status === 'manual';

    return (
        <div className="flex h-full w-full bg-[#0b141a] text-[#e9edef] font-sans selection:bg-[#00a884] selection:text-white">
            {/* Left Sidebar */}
            <div className="w-[400px] flex flex-col border-r border-[#202c33] bg-[#111b21]">
                {/* Header (Simplified) */}
                <div className="h-[60px] px-4 flex items-center justify-between bg-[#202c33]">
                    <h1 className="text-xl font-bold tracking-tight text-[#e9edef]">Messages</h1>
                    <div className="flex items-center gap-4 text-[#aebac1]">
                        <button title="New Chat"><MessageSquarePlus className="w-6 h-6" /></button>
                        <button title="Menu"><MoreVertical className="w-6 h-6" /></button>
                    </div>
                </div>

                {/* Search (Updated to match request) */}
                <div className="px-3 py-2">
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aebac1]">
                            <Search className="w-4 h-4" />
                        </div>
                        <input
                            placeholder="Search chats..."
                            className="w-full bg-[#202c33] rounded-lg pl-10 pr-4 py-2 text-sm text-[#e9edef] placeholder-[#8696a0] focus:outline-none focus:ring-1 focus:ring-[#00a884]/50"
                        />
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="px-3 py-1 flex items-center gap-2 mb-2">
                    {['All', 'Unread', 'Favourites', 'Groups'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${activeFilter === filter
                                ? 'bg-[#005c4b] text-[#e9edef]'
                                : 'bg-[#202c33] text-[#8696a0] hover:bg-[#2a3942]'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto whatsapp-scrollbar">
                    {conversations.map(conv => (
                        <div
                            key={conv.id}
                            onClick={() => onSelectConversation(conv)}
                            className={`flex items-center gap-3 px-3 py-3 cursor-pointer border-b border-[#202c33] hover:bg-[#202c33] ${selectedConversation?.id === conv.id ? 'bg-[#2a3942]' : ''
                                }`}
                        >
                            <div className="w-12 h-12 rounded-full bg-zinc-700 flex-shrink-0 overflow-hidden relative">
                                {conv.avatar_url ? (
                                    <img src={conv.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold text-lg">
                                        {conv.name?.[0]}
                                    </div>
                                )}
                                {/* Status Indicator (Simplified - mostly for demo) */}
                                {conv.status === 'manual' && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-orange-500 rounded-full border-2 border-[#111b21]"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="text-[17px] font-normal text-[#e9edef] truncate">{conv.name || 'Unknown'}</h3>
                                    <span className="text-xs text-[#8696a0] font-light">
                                        {formatTime(conv.updated_at)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-[#8696a0] truncate flex-1 block">
                                        {/* Simplified 'read' tick */}
                                        <span className="inline-block mr-1 text-[#53bdeb]"><CheckCheck className="w-4 h-4 inline" /></span>
                                        {conv.last_message || 'No messages yet'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            {selectedConversation ? (
                <div className="flex-1 flex flex-col h-full bg-[#0b141a] relative">
                    {/* Background Pattern Overlay (Subtle) */}
                    <div className="absolute inset-0 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] opacity-[0.06] pointer-events-none"></div>

                    {/* Chat Header */}
                    <div className="h-[60px] px-4 py-2 bg-[#202c33] flex items-center justify-between z-10 border-b border-[#202c33]">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden cursor-pointer">
                                {selectedConversation.avatar_url ? (
                                    <img src={selectedConversation.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold">
                                        {selectedConversation.name?.[0]}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col justify-center">
                                <h2 className="text-[#e9edef] font-normal text-base leading-tight">
                                    {selectedConversation.name}
                                </h2>
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${selectedConversation.platform === 'whatsapp' ? 'bg-[#25D366]' : 'bg-zinc-500'}`}></span>
                                    <span className="text-[#8696a0] text-xs uppercase tracking-wide">WHATSAPP</span>
                                </div>
                            </div>
                        </div>

                        {/* AI Toggle Button */}
                        <div className="flex items-center gap-4">
                            {onToggleAI && (
                                <button
                                    onClick={onToggleAI}
                                    className={`
                                        flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all border
                                        ${isManualMode
                                            ? 'bg-[#2a3942] text-zinc-300 border-zinc-600 hover:bg-zinc-700'
                                            : 'bg-[#00a884] text-white border-transparent hover:bg-[#008f6f] shadow-[0_0_15px_rgba(0,168,132,0.4)]'
                                        }
                                    `}
                                >
                                    {isManualMode ? (
                                        <>
                                            <span>MANUAL MODE</span>
                                        </>
                                    ) : (
                                        <>
                                            <Bot className="w-3.5 h-3.5" />
                                            <span>AI AGENT ACTIVE</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto px-[5%] py-4 space-y-2 z-10 custom-scrollbar relative">
                        {/* Encryption Notice */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-[#182229] px-4 py-2 rounded-lg shadow-sm">
                                <p className="text-[#ffd279] text-xs text-center flex items-center gap-1">
                                    <span className="text-[10px]">🔒</span> Messages are end-to-end encrypted.
                                </p>
                            </div>
                        </div>

                        {messages.map((msg, i) => {
                            const isMe = msg.author_role === 'agent' || msg.author_role === 'ai';

                            return (
                                <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-1`}>
                                    <div className={`
                                        relative max-w-[65%] px-2 py-1.5 rounded-lg text-sm shadow-sm
                                        ${isMe ? 'bg-[#005c4b] rounded-tr-none' : 'bg-[#202c33] rounded-tl-none'}
                                    `}>
                                        <div className="text-[#e9edef] whitespace-pre-wrap leading-relaxed px-1">
                                            {msg.body}
                                        </div>
                                        <div className="flex justify-end items-center gap-1 mt-1 select-none">
                                            <span className="text-[11px] text-[#8696a0] hs-time">
                                                {formatTime(msg.created_at || new Date().toISOString())}
                                            </span>
                                            {isMe && <CheckCheck className="w-4 h-4 text-[#53bdeb]" />}
                                        </div>
                                        {/* Tag for Human Agent response */}
                                        {msg.author_role === 'agent' && (
                                            <div className="absolute -bottom-4 right-0 text-[10px] text-zinc-500 font-medium opacity-60">
                                                human agent
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* AI Status Banner */}
                    {isManualMode && (
                        <div className="bg-[#111111] border-t border-orange-900/50 py-2 px-4 flex items-center justify-center gap-2 z-20">
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                            <span className="text-orange-600 text-xs font-bold tracking-wide uppercase">AI Disabled for this chat</span>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="min-h-[62px] bg-[#202c33] px-4 py-2 flex items-center gap-4 z-10">
                        <div className="flex gap-4 text-[#8696a0]">
                            <button><Smile className="w-6 h-6" /></button>
                            <button><Plus className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleSend} className="flex-1 flex gap-2">
                            <input
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Type a message..."
                                className="w-full bg-[#2a3942] rounded-lg px-4 py-2.5 text-[#e9edef] placeholder-[#8696a0] text-sm focus:outline-none"
                            />
                        </form>
                        <div className="text-[#8696a0]">
                            {inputText.trim() ? (
                                <button onClick={handleSend} className="text-[#00a884]"><Check className="w-6 h-6" /></button>
                            ) : (
                                <button><Mic className="w-6 h-6" /></button>
                            )}
                        </div>
                    </div>

                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-[#222e35] border-b-[6px] border-[#00a884]">
                    <div className="text-center space-y-4">
                        <div className="relative w-[300px] h-[300px] mx-auto opacity-80">
                            <div className="w-full h-full bg-[url('https://static.whatsapp.net/rsrc.php/v3/yO/r/FsWUqRoOsIy.png')] bg-contain bg-no-repeat bg-center invert-[.8]"></div>
                        </div>
                        <h2 className="text-[#e9edef] text-3xl font-light">WhatsApp Web</h2>
                        <p className="text-[#8696a0] text-sm mt-4">
                            Send and receive messages without keeping your phone online.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

import { useState } from 'react';
import {
    MessageCircle,
    Heart,
    PlusSquare,
    Smile,
    Image as ImageIcon,
    Info,
    Phone,
    Video,
    Search,
    Bot,
    AlertTriangle,
    CheckCheck
} from 'lucide-react';

// Instagram Dark Mode Colors
// bg-black
// border-zinc-800
// text-zinc-100
// text-zinc-400 (secondary)
// button blue: #0095f6

interface InstagramProps {
    conversations: any[];
    selectedConversation: any;
    onSelectConversation: (conversation: any) => void;
    messages: any[];
    onSendMessage: (text: string) => void;
    onToggleAI?: () => void;
}

export default function Instagram({
    conversations,
    selectedConversation,
    onSelectConversation,
    messages,
    onSendMessage,
    onToggleAI
}: InstagramProps) {
    const [inputText, setInputText] = useState('');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputText.trim()) {
            onSendMessage(inputText);
            setInputText('');
        }
    };

    const isManualMode = selectedConversation?.status === 'manual';

    const formatTime = (dateString?: string) => {
        if (!dateString) return '';
        const now = new Date();
        const date = new Date(dateString);
        const diff = now.getTime() - date.getTime();

        // If less than 24 hours, show time
        if (diff < 24 * 60 * 60 * 1000) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        // Otherwise show date
        return date.toLocaleDateString();
    }

    return (
        <div className="flex h-full w-full bg-black text-zinc-100 font-sans">
            {/* Main Content Area - DM Only */}
            <div className="flex w-full h-full max-w-[1500px] mx-auto">
                {/* DM Sidebar */}
                <div className="w-[350px] flex flex-col border-r border-zinc-800">
                    {/* Header Simplified */}
                    <div className="h-[75px] flex items-center justify-between px-6 border-b border-zinc-800">
                        <span className="font-bold text-xl">Messages</span>
                        <PlusSquare className="w-6 h-6 cursor-pointer text-zinc-300 hover:text-white" />
                    </div>

                    {/* Search */}
                    <div className="px-5 py-4">
                        <div className="relative bg-[#262626] rounded-xl">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                                <Search className="w-4 h-4" />
                            </div>
                            <input
                                placeholder="Search chats..."
                                className="w-full bg-transparent text-sm px-10 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between px-6 pb-2">
                            {/* Tabs simplified */}
                        </div>
                        {conversations.map(conv => (
                            <div
                                key={conv.id}
                                onClick={() => onSelectConversation(conv)}
                                className={`flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-zinc-900 ${selectedConversation?.id === conv.id ? 'bg-zinc-900' : ''}`}
                            >
                                <div className="w-14 h-14 rounded-full bg-zinc-800 flex-shrink-0 overflow-hidden relative">
                                    {conv.avatar_url ? (
                                        <img src={conv.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold text-lg">
                                            {conv.name?.[0]}
                                        </div>
                                    )}
                                    {/* Status Indicator */}
                                    {conv.status === 'manual' && (
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-orange-500 rounded-full border-2 border-black"></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-normal text-zinc-100 truncate">{conv.name || 'Instagram User'}</div>
                                    <div className="text-sm text-zinc-500 truncate flex gap-1">
                                        <span className="truncate">{conv.last_message || 'Sent a message'}</span>
                                        <span>·</span>
                                        <span>{formatTime(conv.updated_at)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DM Chat Area */}
                <div className="flex-1 flex flex-col h-full bg-black relative">
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="h-[75px] px-6 border-b border-zinc-800 flex items-center justify-between">
                                <div className="flex items-center gap-3 cursor-pointer">
                                    <div className="w-11 h-11 rounded-full bg-zinc-800 overflow-hidden">
                                        {selectedConversation.avatar_url ? (
                                            <img src={selectedConversation.avatar_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold">
                                                {selectedConversation.name?.[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-base">{selectedConversation.name}</div>
                                        <div className="text-xs text-zinc-500">Active now</div>
                                    </div>
                                </div>

                                {/* AI Toggle Button */}
                                <div>
                                    {onToggleAI && (
                                        <button
                                            onClick={onToggleAI}
                                            className={`
                                                flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all border
                                                ${isManualMode
                                                    ? 'bg-zinc-900/50 text-zinc-300 border-zinc-700 hover:bg-zinc-800'
                                                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent hover:opacity-90 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                                                }
                                            `}
                                        >
                                            {isManualMode ? (
                                                <span>MANUAL MODE</span>
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

                            {/* Messages List */}
                            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2 custom-scrollbar">
                                {messages.map((msg, i) => {
                                    const isMe = msg.author_role === 'agent' || msg.author_role === 'ai';
                                    return (
                                        <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2`}>
                                            {!isMe && (
                                                <div className="w-7 h-7 rounded-full bg-zinc-800 overflow-hidden mr-2 self-end mb-1">
                                                    {/* Recipient Pic Small */}
                                                    {selectedConversation.avatar_url && <img src={selectedConversation.avatar_url} className="w-full h-full object-cover" />}
                                                </div>
                                            )}
                                            <div className={`
                                                relative max-w-[70%] px-4 py-3 rounded-3xl text-sm
                                                ${isMe
                                                    ? 'bg-[#3797f0] text-white'
                                                    : 'bg-[#262626] text-white'
                                                }
                                            `}>
                                                {msg.body}
                                                {/* Timestamp inside bubble for Insta? usually hover, but let's keep clean */}

                                                {/* Tag for Human Agent response */}
                                                {msg.author_role === 'agent' && (
                                                    <div className="absolute -bottom-5 right-1 text-[10px] text-zinc-500 font-medium opacity-60">
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
                                <div className="bg-[#111111] border-t border-orange-900/50 py-2 px-4 flex items-center justify-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                                    <span className="text-orange-600 text-xs font-bold tracking-wide uppercase">AI Disabled for this chat</span>
                                </div>
                            )}

                            {/* Input Area */}
                            <div className="p-4 bg-black">
                                <div className="flex items-center gap-2 bg-[#262626] rounded-full px-4 py-2 border border-transparent focus-within:border-zinc-700">
                                    <button className="text-zinc-100 hover:text-zinc-300">
                                        <Smile className="w-6 h-6" />
                                    </button>
                                    <form onSubmit={handleSend} className="flex-1">
                                        <input
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            placeholder="Message..."
                                            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none"
                                        />
                                    </form>

                                    {inputText.trim() ? (
                                        <button onClick={handleSend} className="text-[#0095f6] font-semibold text-sm hover:text-[#e0f1ff]">Send</button>
                                    ) : (
                                        <>
                                            <button className="text-zinc-100"><ImageIcon className="w-6 h-6" /></button>
                                            <button className="text-zinc-100"><Heart className="w-6 h-6" /></button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                            <div className="w-24 h-24 rounded-full border-2 border-zinc-100 flex items-center justify-center mb-4">
                                <MessageCircle className="w-12 h-12" strokeWidth={1.5} />
                            </div>
                            <h2 className="text-xl font-normal mb-2">Your Messages</h2>
                            <p className="text-zinc-400 text-sm mb-6">Send private photos and messages to a friend or group.</p>
                            <button className="bg-[#0095f6] hover:bg-[#1877f2] text-white px-4 py-1.5 rounded-lg text-sm font-semibold">
                                Send Message
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

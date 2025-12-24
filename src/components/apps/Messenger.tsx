import { useState } from 'react';
import {
    Phone,
    Video,
    Info,
    Image as ImageIcon,
    Sticker,
    ThumbsUp,
    Search,
    MoreHorizontal,
    Edit,
    PlusCircle,
    Mic,
    Smile,
    Bot,
    AlertTriangle
} from 'lucide-react';

interface MessengerProps {
    conversations: any[];
    selectedConversation: any;
    onSelectConversation: (conversation: any) => void;
    messages: any[];
    onSendMessage: (text: string) => void;
    onToggleAI?: () => void;
}

export default function Messenger({
    conversations,
    selectedConversation,
    onSelectConversation,
    messages,
    onSendMessage,
    onToggleAI
}: MessengerProps) {
    const [inputText, setInputText] = useState('');
    const [activeFilter, setActiveFilter] = useState<'inbox' | 'unread' | 'communities'>('inbox');

    const handleSend = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (inputText.trim()) {
            onSendMessage(inputText);
            setInputText('');
        }
    };

    const isManualMode = selectedConversation?.status === 'manual';

    // Filter Logic
    const filteredConversations = conversations.filter(conv => {
        if (activeFilter === 'inbox') return true;
        if (activeFilter === 'unread') {
            return (conv.unread_count && conv.unread_count > 0) || conv.status === 'unread';
        }
        if (activeFilter === 'communities') {
            return conv.is_group || conv.type === 'group' || conv.name?.toLowerCase().includes('group') || conv.name?.toLowerCase().includes('community');
        }
        return true;
    });

    return (
        <div className="flex h-full w-full bg-black text-zinc-100 font-sans overflow-hidden">
            {/* 1. Left Chat Sidebar */}
            <div className="w-[360px] flex flex-col border-r border-zinc-800 h-full">
                {/* Header Simplified */}
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold">Messages</h1>
                        <div className="flex gap-2 text-zinc-400">
                            <div className="p-2 rounded-full bg-zinc-800/50 hover:bg-zinc-800 cursor-pointer">
                                <Edit className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            placeholder="Search chats..."
                            className="w-full bg-zinc-800 text-zinc-200 pl-9 pr-4 py-2 rounded-full text-[15px] focus:outline-none placeholder-zinc-500"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-3 mt-4 overflow-x-auto no-scrollbar pb-1">
                        <button
                            onClick={() => setActiveFilter('inbox')}
                            className={`px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${activeFilter === 'inbox'
                                ? 'bg-[#2d88ff]/20 text-[#2d88ff]'
                                : 'hover:bg-zinc-800 text-zinc-300'
                                }`}
                        >
                            Inbox
                        </button>
                        <button
                            onClick={() => setActiveFilter('unread')}
                            className={`px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${activeFilter === 'unread'
                                ? 'bg-[#2d88ff]/20 text-[#2d88ff]'
                                : 'hover:bg-zinc-800 text-zinc-300'
                                }`}
                        >
                            Unread
                        </button>
                        <button
                            onClick={() => setActiveFilter('communities')}
                            className={`px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${activeFilter === 'communities'
                                ? 'bg-[#2d88ff]/20 text-[#2d88ff]'
                                : 'hover:bg-zinc-800 text-zinc-300'
                                }`}
                        >
                            Communities
                        </button>
                    </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                    {filteredConversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-zinc-500">
                            <p>No chats found.</p>
                        </div>
                    ) : filteredConversations.map(conv => (
                        <div
                            key={conv.id}
                            onClick={() => onSelectConversation(conv)}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedConversation?.id === conv.id ? 'bg-[#2d88ff]/10' : 'hover:bg-zinc-800'}`}
                        >
                            <div className="relative w-12 h-12 flex-shrink-0">
                                <div className="w-full h-full rounded-full overflow-hidden bg-zinc-700 relative">
                                    {conv.avatar_url ? (
                                        <img src={conv.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold">
                                            {conv.name?.[0]}
                                        </div>
                                    )}
                                    {/* Status Indicator */}
                                    {conv.status === 'manual' && (
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-orange-500 rounded-full border-2 border-black z-10"></div>
                                    )}
                                </div>
                                {/* Online Status Dot (simplified) */}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="text-[15px] font-medium text-zinc-100 truncate">{conv.name || 'Facebook User'}</div>
                                <div className="flex items-center gap-1 text-[13px] text-zinc-500">
                                    <span className="truncate max-w-[150px]">{conv.last_message || 'You are now connected on Messenger'}</span>
                                    <span>·</span>
                                    <span>1h</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Main Chat Area */}
            <div className="flex-1 flex flex-col h-full relative">
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-800 bg-black/50 backdrop-blur-sm z-10">
                            <div className="flex items-center gap-3 cursor-pointer p-1 rounded-lg hover:bg-zinc-800/50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden relative">
                                    {selectedConversation.avatar_url ? (
                                        <img src={selectedConversation.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold">
                                            {selectedConversation.name?.[0]}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="font-semibold text-[15px]">{selectedConversation.name}</div>
                                    <div className="text-[12px] text-zinc-500">Active now</div>
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
                                                ? 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                                                : 'bg-[#0084ff] text-white border-transparent hover:bg-[#007af0] shadow-[0_0_15px_rgba(0,132,255,0.4)]'
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

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 custom-scrollbar">
                            <div className="flex flex-col items-center py-6 gap-2">
                                <div className="w-24 h-24 rounded-full bg-zinc-800 overflow-hidden mb-2">
                                    {selectedConversation.avatar_url ? (
                                        <img src={selectedConversation.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold text-3xl">
                                            {selectedConversation.name?.[0]}
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-xl font-bold">{selectedConversation.name}</h2>
                                <p className="text-zinc-500 text-sm">Facebook</p>
                                <p className="text-zinc-500 text-sm">You're friends on Facebook</p>
                            </div>

                            {messages.map((msg, i) => {
                                const isMe = msg.author_role === 'agent' || msg.author_role === 'ai';

                                return (
                                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group mb-1`}>
                                        {!isMe && (
                                            <div className="w-7 h-7 rounded-full bg-zinc-700 overflow-hidden mr-2 self-end mb-1 flex-shrink-0">
                                                {selectedConversation.avatar_url && <img src={selectedConversation.avatar_url} className="w-full h-full object-cover" />}
                                            </div>
                                        )}
                                        <div className={`
                                            relative max-w-[70%] px-4 py-2 text-[15px]
                                            ${isMe
                                                ? 'bg-[#0084ff] text-white rounded-2xl rounded-tr-md'
                                                : 'bg-[#303030] text-zinc-100 rounded-2xl rounded-tl-md'
                                            }
                                        `}>
                                            {msg.body}

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
                        <div className="p-3 bg-black">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center text-[#0084ff]">
                                    <button className="p-2 rounded-full hover:bg-zinc-800"><PlusCircle className="w-6 h-6" /></button>
                                    <button className="p-2 rounded-full hover:bg-zinc-800"><ImageIcon className="w-6 h-6" /></button>
                                    <button className="p-2 rounded-full hover:bg-zinc-800"><Sticker className="w-6 h-6" /></button>
                                    <button className="p-2 rounded-full hover:bg-zinc-800"><div className="border rounded px-1 font-bold text-xs uppercase">GIF</div></button>
                                </div>

                                <form onSubmit={handleSend} className="flex-1">
                                    <div className="relative flex items-center">
                                        <input
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            placeholder="Aa"
                                            className="w-full bg-[#303030] text-white rounded-full pl-4 pr-10 py-2 focus:outline-none"
                                        />
                                        <button className="absolute right-3 p-1 rounded-full hover:bg-zinc-700 text-zinc-400">
                                            <Smile className="w-5 h-5" />
                                        </button>
                                    </div>
                                </form>

                                {inputText.trim() ? (
                                    <button onClick={() => handleSend()} className="p-2 text-[#0084ff] hover:bg-zinc-800 rounded-full">
                                        <Mic className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button className="p-2 text-[#0084ff] hover:bg-zinc-800 rounded-full">
                                        <ThumbsUp className="w-6 h-6" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-400">
                        {/* Empty State */}
                        <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                            <Edit className="w-10 h-10 text-zinc-500" />
                        </div>
                        <h2 className="text-xl font-bold text-zinc-200 mb-2">No chat selected</h2>
                        <p>Select a chat or start a new conversation.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

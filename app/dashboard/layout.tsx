'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MessageCircle, Package, Users, LogOut, Phone, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const navigation = [
    { name: 'Chat', href: '/dashboard/chat', icon: MessageCircle },
    { name: 'CRM', href: '/dashboard/crm', icon: Users },
    { name: 'Voice Intelligence', href: '/dashboard/voice', icon: Phone },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
            {/* Sidebar with Gradient Background */}
            <aside
                className={`relative border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-black shrink-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}
            >
                {/* Gradient Layer */}
                <div
                    className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom_left,_#5c1c8a_0%,_transparent_45%)] opacity-80"
                    style={{ background: 'radial-gradient(circle at bottom left, #5c1c8a 0%, transparent 45%)' }}
                />

                {/* Content Layer */}
                <div className="relative z-10 flex flex-col h-full bg-black/0">
                    {/* Header */}
                    <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                        {!isCollapsed && (
                            <h2 className="text-xl font-bold tracking-tight text-white whitespace-nowrap overflow-hidden">
                                Adryze OS
                            </h2>
                        )}
                        {/* Collapse Toggle Button (Expanded State: Outside/Right Edge) */}
                        {!isCollapsed && (
                            <button
                                onClick={() => setIsCollapsed(true)}
                                className="absolute -right-3 top-7 w-6 h-6 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full flex items-center justify-center text-zinc-500 hover:text-[#5c1c8a] shadow-sm z-50 hover:scale-110 transition-all"
                            >
                                <ChevronLeft className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 space-y-2 mt-4">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-xl transition-all group relative ${isActive
                                        ? 'bg-[#5c1c8a]/20 text-[#be8eeb] font-medium'
                                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                        }`}
                                    title={isCollapsed ? item.name : ''}
                                >
                                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#be8eeb]' : 'group-hover:text-white transition-colors'}`} />

                                    {!isCollapsed && (
                                        <span className="whitespace-nowrap overflow-hidden">{item.name}</span>
                                    )}

                                    {/* Tooltip for collapsed state */}
                                    {isCollapsed && (
                                        <div className="absolute left-14 bg-zinc-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-zinc-800">
                                            {item.name}
                                        </div>
                                    )}
                                </a>
                            );
                        })}
                    </nav>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-zinc-800 flex flex-col gap-4">
                        {/* Expand Button (Collapsed State: Inside/Centered) */}
                        {isCollapsed && (
                            <button
                                onClick={() => setIsCollapsed(false)}
                                className="w-10 h-10 mx-auto bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-all"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}

                        <button
                            onClick={handleLogout}
                            className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-lg text-red-400 hover:bg-red-900/10 transition-all font-medium`}
                            title={isCollapsed ? "Logout" : ""}
                        >
                            <LogOut className="w-5 h-5 shrink-0" />
                            {!isCollapsed && <span>Logout</span>}
                        </button>

                        <div className={`${isCollapsed ? 'flex justify-center' : ''}`}>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-zinc-50 dark:bg-zinc-950">
                {children}
            </main>
        </div>
    );
}

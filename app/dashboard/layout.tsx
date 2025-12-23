'use client';

import { usePathname, useRouter } from 'next/navigation';
import { MessageCircle, Package, Users, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const navigation = [
    { name: 'Inventory', href: '/dashboard/inventory', icon: Package },
    { name: 'Chat', href: '/dashboard/chat', icon: MessageCircle },
    { name: 'CRM', href: '/dashboard/crm', icon: Users },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-white dark:bg-zinc-950">
                <div className="p-6">
                    <h2 className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-500">
                        Adryze OS
                    </h2>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <a
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.name}
                            </a>
                        );
                    })}
                </nav>

                {/* Logout & Theme Toggle */}
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                    <button
                        onClick={handleLogout}
                        className="flex-1 flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                    <ThemeToggle />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-white dark:bg-zinc-950">
                {children}
            </main>
        </div>
    );
}

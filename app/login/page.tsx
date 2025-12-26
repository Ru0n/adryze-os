'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Authentication failed');
                return;
            }

            // Redirect to chat (priority feature per PRD)
            router.push('/dashboard/chat');
        } catch (err: any) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#000000] to-[#5c1c8a] text-zinc-100 relative overflow-hidden px-4">

            <div className="w-full max-w-md relative z-10">
                {/* Login Card */}
                <div className="rounded-2xl bg-black shadow-2xl border border-zinc-800 p-8">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold tracking-tight text-white">
                            Sign In
                        </h1>
                        <p className="mt-2 text-xs text-zinc-400">
                            Use your Odoo credentials to access the dashboard
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-xs font-medium text-zinc-400 mb-1.5"
                            >
                                Email
                            </label>
                            <input
                                id="username"
                                type="email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-zinc-800 bg-black/50 text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 transition-all text-sm"
                                placeholder="api_integration@adryze.com"
                                disabled={loading}
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-xs font-medium text-zinc-400 mb-1.5"
                            >
                                API Key
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-zinc-800 bg-black/50 text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 transition-all text-sm"
                                placeholder="Enter your Odoo API key"
                                disabled={loading}
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="rounded-lg bg-red-900/20 border border-red-900/50 px-4 py-2 text-xs text-red-400">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold text-sm shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Authenticating...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>



                    {/* Helper Text */}
                    {/* <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-600">
                        Use your Odoo credentials to access the dashboard
                    </p> */}
                </div>
            </div>
        </div>
    );
}

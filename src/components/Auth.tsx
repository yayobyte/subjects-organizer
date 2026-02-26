import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, GraduationCap, Loader2 } from 'lucide-react';

export const Auth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            } else {
                const { error, data } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;

                // If email confirmation is enabled, Supabase returns a user but session is null
                if (data.user && !data.session) {
                    setSuccessMessage('Registration successful! Please check your email inbox to verify your account.');
                    setIsLogin(true); // Switch to login view for after they verify
                } else {
                    // If auto-login is enabled (no email confirmation required)
                    setSuccessMessage('Registration successful!');
                }
            }
        } catch (error: any) {
            setError(error.message || 'An error occurred during authentication');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-crimson-violet-100 dark:bg-crimson-violet-900/30 text-crimson-violet-600 dark:text-crimson-violet-400 mb-4 transition-transform hover:scale-110">
                        <GraduationCap size={32} />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-crimson-violet-600 to-indigo-600 dark:from-crimson-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        Curriculum Tracker
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        Manage your academic journey
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                        {isLogin ? 'Welcome back' : 'Create an account'}
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-800/30">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm border border-green-200 dark:border-green-800/30 font-medium">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-crimson-violet-500 focus:border-transparent transition-all outline-none"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-crimson-violet-500 focus:border-transparent transition-all outline-none"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 rounded-lg bg-crimson-violet-600 text-white font-medium hover:bg-crimson-violet-700 focus:ring-4 focus:ring-crimson-violet-500/50 disabled:opacity-50 transition-all"
                        >
                            {isLoading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : isLogin ? (
                                <LogIn size={20} />
                            ) : (
                                <UserPlus size={20} />
                            )}
                            {isLogin ? 'Sign In' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-6">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setSuccessMessage(null);
                                setError(null);
                            }}
                            className="text-crimson-violet-600 dark:text-crimson-violet-400 font-medium hover:underline"
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

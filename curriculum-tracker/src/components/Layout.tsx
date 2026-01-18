import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Network } from 'lucide-react';
import { JSONActions } from './JSONActions';

interface LayoutProps {
    children: ReactNode;
    view: 'list' | 'graph';
    setView: (v: 'list' | 'graph') => void;
}

export const Layout = ({ children, view, setView }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300">
            {/* Background Gradients for Premium Feel */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-crimson-violet-400/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-dark-teal-400/20 rounded-full blur-[120px]" />
            </div>

            <nav className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-black/70 backdrop-blur-lg border-white/20 shadow-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-crimson-violet-500 to-deep-crimson-600 rounded-lg shadow-lg">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                                AcademicPath
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <JSONActions />

                            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />

                            {/* View Switcher */}
                            <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={() => setView('list')}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'list'
                                        ? 'bg-white dark:bg-slate-700 shadow-sm text-crimson-violet-600 dark:text-crimson-violet-400'
                                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                                        }`}
                                >
                                    <BookOpen size={16} />
                                    <span>Curriculum</span>
                                </button>
                                <button
                                    onClick={() => setView('graph')}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'graph'
                                        ? 'bg-white dark:bg-slate-700 shadow-sm text-crimson-violet-600 dark:text-crimson-violet-400'
                                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                                        }`}
                                >
                                    <Network size={16} />
                                    <span>Graph Flow</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { DarkModeToggle } from './DarkModeToggle';
import { StudentNameEditor } from './StudentNameEditor';

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300">
            {/* Background Gradients for Premium Feel */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-crimson-violet-400/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-dark-teal-400/20 rounded-full blur-[120px]" />
            </div>

            <nav className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-black/70 backdrop-blur-lg border-white/20 shadow-xl">
                <div className="w-full px-4 sm:px-6 lg:px-8">
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
                            <StudentNameEditor />
                            <DarkModeToggle />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
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

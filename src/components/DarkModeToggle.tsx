import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

// Initialize theme before component renders
const getInitialTheme = () => {
    const stored = localStorage.getItem('theme');
    if (stored) {
        return stored === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Apply theme immediately
const applyTheme = (isDark: boolean) => {
    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

// Initialize on module load
if (typeof window !== 'undefined') {
    applyTheme(getInitialTheme());
}

export const DarkModeToggle = () => {
    const [isDark, setIsDark] = useState(getInitialTheme);

    useEffect(() => {
        // Update document class and localStorage when state changes
        applyTheme(isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggleDarkMode = () => {
        setIsDark(!isDark);
    };

    return (
        <button
            onClick={toggleDarkMode}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 text-slate-500 hover:text-crimson-violet-600 dark:text-slate-400 dark:hover:text-crimson-violet-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            aria-label="Toggle dark mode"
        >
            {isDark ? (
                <Sun size={20} className="transition-transform duration-200 rotate-0 hover:rotate-12" />
            ) : (
                <Moon size={20} className="transition-transform duration-200 rotate-0 hover:-rotate-12" />
            )}
        </button>
    );
};

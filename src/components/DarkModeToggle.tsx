import { Moon, Sun } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

export const DarkModeToggle = () => {
    const { config, updateDarkMode } = useConfig();

    const toggleDarkMode = async () => {
        console.log('[DarkMode] Toggle clicked. Current:', config.darkMode, '-> New:', !config.darkMode);
        await updateDarkMode(!config.darkMode);
    };

    return (
        <button
            onClick={toggleDarkMode}
            title={config.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 text-slate-500 hover:text-crimson-violet-600 dark:text-slate-400 dark:hover:text-crimson-violet-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            aria-label="Toggle dark mode"
        >
            {config.darkMode ? (
                <Sun size={20} className="transition-transform duration-200 rotate-0 hover:rotate-12" />
            ) : (
                <Moon size={20} className="transition-transform duration-200 rotate-0 hover:-rotate-12" />
            )}
        </button>
    );
};

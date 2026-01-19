import { GitBranch } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

export const ConnectionLinesToggle = () => {
    const { config, updateShowPrerequisiteLines } = useConfig();

    const toggleLines = async () => {
        console.log('[ConnectionLines] Toggle clicked. Current:', config.showPrerequisiteLines, '-> New:', !config.showPrerequisiteLines);
        await updateShowPrerequisiteLines(!config.showPrerequisiteLines);
    };

    return (
        <button
            onClick={toggleLines}
            title={config.showPrerequisiteLines ? 'Hide Prerequisite Lines' : 'Show Prerequisite Lines'}
            className="p-2 text-slate-500 hover:text-crimson-violet-600 dark:text-slate-400 dark:hover:text-crimson-violet-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            aria-label="Toggle prerequisite connection lines"
        >
            <GitBranch
                size={20}
                className={`transition-all duration-200 ${
                    config.showPrerequisiteLines
                        ? 'text-crimson-violet-600 dark:text-crimson-violet-400 rotate-0'
                        : 'rotate-0'
                }`}
            />
        </button>
    );
};

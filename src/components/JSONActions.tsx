import { Download, Upload, RotateCcw } from 'lucide-react';
import { useSubjects } from '../contexts/SubjectContext';
import { useRef } from 'react';

export const JSONActions = () => {
    const { exportData, importData, resetData } = useSubjects();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                importData(json);
                // Reset file input
                if (fileInputRef.current) fileInputRef.current.value = '';
            } catch (err) {
                alert('Failed to parse JSON file.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={exportData}
                title="Export Data"
                className="p-2 text-slate-500 hover:text-crimson-violet-600 dark:text-slate-400 dark:hover:text-crimson-violet-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
                <Download size={18} />
            </button>
            <button
                onClick={handleImportClick}
                title="Import Data"
                className="p-2 text-slate-500 hover:text-crimson-violet-600 dark:text-slate-400 dark:hover:text-crimson-violet-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
                <Upload size={18} />
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    className="hidden"
                />
            </button>
            <button
                onClick={resetData}
                title="Reset to Defaults"
                className="p-2 text-slate-500 hover:text-deep-crimson-600 dark:text-slate-400 dark:hover:text-deep-crimson-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
                <RotateCcw size={18} />
            </button>
        </div>
    );
};

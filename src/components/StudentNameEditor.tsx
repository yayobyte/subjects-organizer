import { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

export const StudentNameEditor = () => {
    const { config, updateStudentName } = useConfig();
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(config.studentName);

    const handleSave = async () => {
        if (editValue.trim() && editValue !== config.studentName) {
            await updateStudentName(editValue.trim());
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditValue(config.studentName);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    if (isEditing) {
        return (
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleSave}
                    autoFocus
                    className="px-2 py-1 text-sm rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-crimson-violet-500"
                    placeholder="Student name"
                />
                <button
                    onClick={handleSave}
                    className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                    title="Save"
                >
                    <Check size={16} />
                </button>
                <button
                    onClick={handleCancel}
                    className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    title="Cancel"
                >
                    <X size={16} />
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-crimson-violet-600 dark:hover:text-crimson-violet-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group"
            title="Click to edit student name"
        >
            <span className="font-medium truncate max-w-24 sm:max-w-none">{config.studentName}</span>
            <Edit2 size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
    );
};

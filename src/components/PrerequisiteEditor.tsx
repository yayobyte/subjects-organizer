import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, Search } from 'lucide-react';
import { useSubjects } from '../contexts/SubjectContext';
import type { Subject } from '../types';

interface PrerequisiteEditorProps {
    subject: Subject;
}

export const PrerequisiteEditor = ({ subject }: PrerequisiteEditorProps) => {
    const { subjects, updatePrerequisites } = useSubjects();
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPrereqs, setSelectedPrereqs] = useState<string[]>(subject.prerequisites || []);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    // Get current semester number
    const currentSemesterNum = parseInt(subject.semester.replace('Semestre ', ''));

    // Filter subjects from current or previous semesters (excluding the current subject)
    const availableSubjects = subjects.filter(s => {
        const subjectSemesterNum = parseInt(s.semester.replace('Semestre ', ''));
        return (
            s.id !== subject.id && // Not the current subject
            subjectSemesterNum <= currentSemesterNum && // Current or previous semester
            !selectedPrereqs.includes(s.id) // Not already selected
        );
    });

    // Filter by search term
    const filteredSubjects = availableSubjects.filter(s => {
        const searchLower = searchTerm.toLowerCase();
        return (
            s.id.toLowerCase().includes(searchLower) ||
            s.name.toLowerCase().includes(searchLower)
        );
    });

    // Update dropdown position when opening
    useEffect(() => {
        if (isAdding && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + 4, // No window.scrollY needed for fixed positioning
                left: rect.left
            });
        }
    }, [isAdding]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                setIsAdding(false);
                setSearchTerm('');
            }
        };

        if (isAdding) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isAdding]);

    const handleAddPrerequisite = (prereqId: string) => {
        const newPrereqs = [...selectedPrereqs, prereqId];
        setSelectedPrereqs(newPrereqs);
        updatePrerequisites(subject.id, newPrereqs);
        setSearchTerm('');
        setIsAdding(false);
    };

    const handleRemovePrerequisite = (prereqId: string) => {
        const newPrereqs = selectedPrereqs.filter(id => id !== prereqId);
        setSelectedPrereqs(newPrereqs);
        updatePrerequisites(subject.id, newPrereqs);
    };

    const getSubjectById = (id: string) => subjects.find(s => s.id === id);

    return (
        <div className="mt-2 space-y-1">
            {/* Display existing prerequisites */}
            {selectedPrereqs.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {selectedPrereqs.map(prereqId => {
                        const prereq = getSubjectById(prereqId);
                        return (
                            <div
                                key={prereqId}
                                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                            >
                                <span className="font-mono">{prereqId}</span>
                                {prereq && (
                                    <span className="text-blue-600 dark:text-blue-400 max-w-[120px] truncate">
                                        {prereq.name}
                                    </span>
                                )}
                                <button
                                    onClick={() => handleRemovePrerequisite(prereqId)}
                                    className="ml-1 text-blue-600 dark:text-blue-400 hover:text-red-600 dark:hover:text-red-400"
                                    title="Remove prerequisite"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add prerequisite button/dropdown */}
            <div>
                <button
                    ref={buttonRef}
                    onClick={() => setIsAdding(true)}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs text-slate-500 dark:text-slate-400 hover:text-crimson-violet-600 dark:hover:text-crimson-violet-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                    title="Add prerequisite"
                >
                    <Plus size={12} />
                    <span>Add prerequisite</span>
                </button>

                {/* Portal dropdown - renders outside of normal DOM hierarchy */}
                {isAdding && createPortal(
                    <div
                        ref={searchRef}
                        className="fixed w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl"
                        style={{
                            top: `${dropdownPosition.top}px`,
                            left: `${dropdownPosition.left}px`,
                            zIndex: 9999
                        }}
                    >
                        {/* Search input */}
                        <div className="p-2 border-b border-slate-200 dark:border-slate-700">
                            <div className="relative">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by code or name..."
                                    autoFocus
                                    className="w-full pl-8 pr-2 py-1.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-crimson-violet-500 text-slate-900 dark:text-slate-100"
                                />
                            </div>
                        </div>

                        {/* Subject list */}
                        <div className="max-h-64 overflow-y-auto">
                            {filteredSubjects.length === 0 ? (
                                <div className="p-4 text-sm text-center text-slate-500 dark:text-slate-400">
                                    {searchTerm ? 'No subjects found' : 'No available prerequisites'}
                                </div>
                            ) : (
                                <div className="py-1">
                                    {filteredSubjects.map(s => (
                                        <button
                                            key={s.id}
                                            onClick={() => handleAddPrerequisite(s.id)}
                                            className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            <div className="flex items-start gap-2">
                                                <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300 min-w-[60px]">
                                                    {s.id}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm text-slate-900 dark:text-slate-100 truncate">
                                                        {s.name}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        {s.semester}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                            Shows subjects from {subject.semester} and earlier
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        </div>
    );
};

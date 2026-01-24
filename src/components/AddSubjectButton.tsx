import { useState } from 'react';
import { Plus, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubjects } from '../contexts/SubjectContext';
import type { Subject } from '../types';
import { cn } from '../lib/utils';

interface AddSubjectButtonProps {
    semester: string;
}

export const AddSubjectButton = ({ semester }: AddSubjectButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
    });
    const { addSubject, subjects } = useSubjects();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const id = formData.id.trim();
        const name = formData.name.trim();

        if (!id || !name) {
            return;
        }

        // Check if ID already exists
        const exists = subjects.some(s => s.id.toLowerCase() === id.toLowerCase());
        if (exists) {
            alert(`Subject with ID "${id}" already exists. Please use a unique course code.`);
            return;
        }

        // Extract credits from last digit of ID
        const lastChar = id.slice(-1);
        const credits = /^\d$/.test(lastChar) ? parseInt(lastChar) : 0;

        const newSubject: Subject = {
            id,
            name,
            semester,
            credits,
            status: 'missing',
            prerequisites: []
        };

        addSubject(newSubject);

        setFormData({ id: '', name: '' });
        setIsOpen(false);
    };

    const handleCancel = () => {
        setFormData({ id: '', name: '' });
        setIsOpen(false);
    };

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {!isOpen ? (
                    <motion.button
                        key="add-button"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        onClick={() => setIsOpen(true)}
                        className="w-full h-24 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl
                                   hover:border-crimson-violet-400 dark:hover:border-crimson-violet-500
                                   hover:bg-crimson-violet-50/50 dark:hover:bg-crimson-violet-950/20
                                   transition-all duration-200 flex items-center justify-center gap-2
                                   text-slate-500 dark:text-slate-400 hover:text-crimson-violet-600 dark:hover:text-crimson-violet-400
                                   group cursor-pointer"
                    >
                        <Plus size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Add Subject</span>
                    </motion.button>
                ) : (
                    <motion.form
                        key="add-form"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onSubmit={handleSubmit}
                        className="w-full bg-white dark:bg-slate-800 border-2 border-crimson-violet-400 dark:border-crimson-violet-500
                                   rounded-xl p-4 shadow-lg"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-crimson-violet-600 dark:text-crimson-violet-400">
                                <BookOpen size={18} />
                                <h3 className="font-semibold text-sm">New Subject</h3>
                            </div>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label htmlFor="subject-id" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Course Code
                                </label>
                                <input
                                    id="subject-id"
                                    type="text"
                                    value={formData.id}
                                    onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                                    placeholder="e.g., IS105 (last digit = credits)"
                                    className={cn(
                                        "w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600",
                                        "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100",
                                        "placeholder:text-slate-400 dark:placeholder:text-slate-500",
                                        "focus:outline-none focus:ring-2 focus:ring-crimson-violet-500 focus:border-transparent",
                                        "transition-all"
                                    )}
                                    autoFocus
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="subject-name" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Subject Name
                                </label>
                                <input
                                    id="subject-name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="e.g., Introduction to Programming"
                                    className={cn(
                                        "w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600",
                                        "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100",
                                        "placeholder:text-slate-400 dark:placeholder:text-slate-500",
                                        "focus:outline-none focus:ring-2 focus:ring-crimson-violet-500 focus:border-transparent",
                                        "transition-all"
                                    )}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-crimson-violet-500 to-deep-crimson-600
                                         text-white font-medium py-2 px-4 rounded-lg
                                         hover:from-crimson-violet-600 hover:to-deep-crimson-700
                                         transition-all duration-200 text-sm
                                         focus:outline-none focus:ring-2 focus:ring-crimson-violet-500 focus:ring-offset-2
                                         dark:focus:ring-offset-slate-800"
                            >
                                Add Subject
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400
                                         hover:text-slate-800 dark:hover:text-slate-200
                                         transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
};

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Circle, BookOpen, Star, AlertCircle, GripVertical, Edit2 } from 'lucide-react';
import type { Subject } from '../types';
import { useSubjects } from '../contexts/SubjectContext';
import { cn } from '../lib/utils';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface SubjectCardProps {
    subject: Subject;
}

export const SubjectCard = ({ subject }: SubjectCardProps) => {
    const { toggleSubjectStatus, subjects, updateSubjectGrade, updateSubjectCredits, updateSubjectName } = useSubjects();
    const [isEditingGrade, setIsEditingGrade] = useState(false);
    const [gradeValue, setGradeValue] = useState(subject.grade?.toString() || '');
    const [isEditingCredits, setIsEditingCredits] = useState(false);
    const [creditsValue, setCreditsValue] = useState(subject.credits.toString());
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameValue, setNameValue] = useState(subject.name);

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: subject.id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 50 : undefined,
    };

    // Check prerequisites
    const missingPrereqs = (subject.prerequisites || [])
        .map(pId => subjects.find(s => s.id === pId))
        .filter(p => p && p.status !== 'completed');

    const isLocked = missingPrereqs.length > 0;
    const isCompleted = subject.status === 'completed';

    const handleCheckboxClick = () => {
        if (!isLocked || isCompleted) {
            toggleSubjectStatus(subject.id);
        }
    };

    const handleGradeSubmit = () => {
        if (gradeValue.trim()) {
            // Try to parse as number, otherwise save as string
            const numGrade = parseFloat(gradeValue);
            updateSubjectGrade(subject.id, isNaN(numGrade) ? gradeValue.trim() : numGrade);
        }
        setIsEditingGrade(false);
    };

    const handleGradeKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleGradeSubmit();
        } else if (e.key === 'Escape') {
            setGradeValue(subject.grade?.toString() || '');
            setIsEditingGrade(false);
        }
    };

    const handleCreditsSubmit = () => {
        const credits = parseInt(creditsValue);
        if (!isNaN(credits) && credits >= 0 && credits <= 12) {
            updateSubjectCredits(subject.id, credits);
        } else {
            setCreditsValue(subject.credits.toString());
        }
        setIsEditingCredits(false);
    };

    const handleCreditsKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCreditsSubmit();
        } else if (e.key === 'Escape') {
            setCreditsValue(subject.credits.toString());
            setIsEditingCredits(false);
        }
    };

    const handleNameSubmit = () => {
        if (nameValue.trim()) {
            updateSubjectName(subject.id, nameValue.trim());
        } else {
            setNameValue(subject.name);
        }
        setIsEditingName(false);
    };

    const handleNameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleNameSubmit();
        } else if (e.key === 'Escape') {
            setNameValue(subject.name);
            setIsEditingName(false);
        }
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 w-full h-32 flex flex-col",
                isDragging ? "shadow-2xl ring-2 ring-crimson-violet-500/50 border-crimson-violet-500/50 scale-[1.02] z-50 bg-white" : "hover:shadow-lg",
                // Styles based on status
                isCompleted
                    ? "bg-white/80 dark:bg-slate-800/80 border-emerald-200 dark:border-emerald-800/30 hover:shadow-emerald-500/10"
                    : isLocked
                        ? "bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-80"
                        : "bg-white/60 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 hover:border-crimson-violet-300 hover:bg-white hover:shadow-crimson-violet-500/10"
            )}
        >
            <button
                {...listeners}
                {...attributes}
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 cursor-grab active:cursor-grabbing text-slate-400 dark:text-slate-500 p-2 hover:text-crimson-violet-500 dark:hover:text-crimson-violet-400 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
                <GripVertical size={20} />
            </button>

            <div className="flex justify-between items-start gap-4">
                {/* Status Toggle */}
                <button
                    type="button"
                    onClick={handleCheckboxClick}
                    disabled={isLocked && !isCompleted}
                    className={cn(
                        "mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200",
                        isCompleted
                            ? "bg-emerald-500 text-white cursor-pointer hover:bg-emerald-600"
                            : isLocked
                                ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                                : "bg-slate-100 dark:bg-slate-700 text-slate-300 group-hover:border-crimson-violet-400 border border-transparent cursor-pointer hover:bg-crimson-violet-100 dark:hover:bg-slate-600"
                    )}
                >
                    {isCompleted ? <Check size={14} strokeWidth={3} /> : <Circle size={14} />}
                </button>

                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        {isEditingName ? (
                            <input
                                type="text"
                                value={nameValue}
                                onChange={(e) => setNameValue(e.target.value)}
                                onBlur={handleNameSubmit}
                                onKeyDown={handleNameKeyDown}
                                autoFocus
                                className={cn(
                                    "font-medium text-sm transition-colors flex-1 mr-2",
                                    "bg-white dark:bg-slate-800 border border-crimson-violet-400 dark:border-crimson-violet-500 rounded px-1",
                                    "focus:outline-none focus:ring-1 focus:ring-crimson-violet-400",
                                    isCompleted ? "text-slate-700 dark:text-slate-200" : "text-slate-900 dark:text-white"
                                )}
                            />
                        ) : (
                            <h4
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditingName(true);
                                }}
                                className={cn(
                                    "font-medium text-sm transition-colors cursor-pointer hover:text-crimson-violet-600 dark:hover:text-crimson-violet-400 flex-1 group",
                                    isCompleted ? "text-slate-700 dark:text-slate-200" : "text-slate-900 dark:text-white"
                                )}
                            >
                                {subject.name}
                                <Edit2 size={10} className="inline-block ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h4>
                        )}
                        <span className="text-xs font-mono text-slate-400 dark:text-slate-500 flex-shrink-0 ml-2">
                            {subject.id}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {isEditingCredits ? (
                            <input
                                type="number"
                                min="0"
                                max="12"
                                value={creditsValue}
                                onChange={(e) => setCreditsValue(e.target.value)}
                                onBlur={handleCreditsSubmit}
                                onKeyDown={handleCreditsKeyDown}
                                autoFocus
                                className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full border border-slate-300 dark:border-slate-600 w-16 focus:outline-none focus:ring-1 focus:ring-crimson-violet-400"
                            />
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditingCredits(true);
                                }}
                                className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 flex items-center gap-1 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer group"
                            >
                                <BookOpen size={10} />
                                {subject.credits} Cr
                                <Edit2 size={8} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        )}

                        {isEditingGrade ? (
                            <input
                                type="text"
                                value={gradeValue}
                                onChange={(e) => setGradeValue(e.target.value)}
                                onBlur={handleGradeSubmit}
                                onKeyDown={handleGradeKeyDown}
                                placeholder="Grade"
                                autoFocus
                                className={cn(
                                    "text-xs px-2 py-0.5 rounded-full border w-16 focus:outline-none focus:ring-1",
                                    isCompleted
                                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30 focus:ring-emerald-400"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600 focus:ring-crimson-violet-400"
                                )}
                            />
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditingGrade(true);
                                }}
                                className={cn(
                                    "text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 transition-colors cursor-pointer group",
                                    isCompleted
                                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                                )}
                            >
                                <Star size={10} />
                                {subject.grade || 'Add grade'}
                                <Edit2 size={8} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        )}

                        {isLocked && !isCompleted && (
                            <div className="flex -space-x-1">
                                {/* Simple dot indicators for missing prereqs */}
                                <span className="text-xs text-amber-500 flex items-center gap-1" title={`Missing: ${missingPrereqs.map(p => p?.name).join(', ')}`}>
                                    <AlertCircle size={12} />
                                    Locked
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Connector Line (Decorative) */}
            {!isCompleted && !isLocked && (
                <div className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-transparent via-crimson-violet-400/0 to-transparent group-hover:via-crimson-violet-400/50 transition-all duration-500" />
            )}
        </motion.div>
    );
};

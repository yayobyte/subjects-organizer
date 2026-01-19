import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, Circle, BookOpen, Star, AlertCircle, GripVertical, Edit2, Trash2 } from 'lucide-react';
import type { Subject } from '../types';
import { useSubjects } from '../contexts/SubjectContext';
import { cn } from '../lib/utils';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ConfirmDialog } from './ConfirmDialog';
import { PrerequisiteEditor } from './PrerequisiteEditor';

interface SubjectCardProps {
    subject: Subject;
}

export const SubjectCard = ({ subject }: SubjectCardProps) => {
    const { toggleSubjectStatus, subjects, updateSubjectGrade, updateSubjectCredits, updateSubjectName, deleteSubject } = useSubjects();
    const [isEditingGrade, setIsEditingGrade] = useState(false);
    const [gradeValue, setGradeValue] = useState(subject.grade?.toString() || '');
    const [isEditingCredits, setIsEditingCredits] = useState(false);
    const [creditsValue, setCreditsValue] = useState(subject.credits.toString());
    const [showCustomCredits, setShowCustomCredits] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameValue, setNameValue] = useState(subject.name);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const creditsPopoverRef = useRef<HTMLDivElement>(null);

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
    const isInProgress = subject.status === 'in-progress';
    const isReady = subject.status === 'missing' && !isLocked; // prerequisites met
    const isLockedMissing = subject.status === 'missing' && isLocked; // prerequisites not met

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
        setShowCustomCredits(false);
    };

    const handleCreditsKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCreditsSubmit();
        } else if (e.key === 'Escape') {
            setCreditsValue(subject.credits.toString());
            setIsEditingCredits(false);
            setShowCustomCredits(false);
        }
    };

    const handleQuickCreditsSelect = (credits: number) => {
        updateSubjectCredits(subject.id, credits);
        setIsEditingCredits(false);
        setShowCustomCredits(false);
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

    const handleDelete = () => {
        deleteSubject(subject.id);
    };

    // Close credits popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isEditingCredits && creditsPopoverRef.current && !creditsPopoverRef.current.contains(event.target as Node)) {
                setIsEditingCredits(false);
                setShowCustomCredits(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isEditingCredits]);

    return (
        <>
            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Delete Subject"
                message={`Are you sure you want to delete "${subject.name}" (${subject.id})? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
            />

        <motion.div
            ref={setNodeRef}
            style={{
                ...style,
                position: 'relative',
                zIndex: isDragging ? 50 : 'auto',
            }}
            className={cn(
                "group p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 w-full min-h-32 flex flex-col",
                isDragging ? "shadow-2xl ring-2 ring-crimson-violet-500/50 border-crimson-violet-500/50 scale-[1.02] bg-white" : "hover:shadow-lg",
                // Color-coded status backgrounds
                isCompleted
                    ? "bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/50 hover:shadow-emerald-500/20"
                    : isInProgress
                        ? "bg-sky-50/90 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800/50 hover:shadow-sky-500/20"
                        : isReady
                            ? "bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/50 hover:shadow-amber-500/20"
                            : isLockedMissing
                                ? "bg-red-50/90 dark:bg-red-950/40 border-red-300 dark:border-red-800/50 hover:shadow-red-500/20"
                                : "bg-slate-50/90 dark:bg-slate-900/40 border-slate-300 dark:border-slate-700/50"
            )}
        >
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
                            : isInProgress
                                ? "bg-sky-500 text-white cursor-pointer hover:bg-sky-600"
                                : isLockedMissing
                                    ? "bg-red-200 dark:bg-red-900 text-red-600 dark:text-red-300 cursor-not-allowed"
                                    : isReady
                                        ? "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300 cursor-pointer hover:bg-amber-200 dark:hover:bg-amber-800"
                                        : "bg-slate-100 dark:bg-slate-700 text-slate-300 cursor-pointer hover:bg-slate-200"
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

                    {/* Row 2: Credits and Grade badges */}
                    <div className="flex items-center gap-2 mt-2 relative">
                        {/* Credits Badge */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditingCredits(!isEditingCredits);
                                setShowCustomCredits(false);
                            }}
                            className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 flex items-center gap-1 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer group"
                        >
                            <BookOpen size={10} />
                            {subject.credits} Cr
                            <Edit2 size={8} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>

                        {/* Credits Popover */}
                        {isEditingCredits && (
                            <div
                                ref={creditsPopoverRef}
                                className="absolute bottom-full left-0 mb-1 z-50"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-2">
                                    {!showCustomCredits ? (
                                        <div className="flex flex-col gap-1">
                                            <div className="flex gap-1">
                                                {/* Quick select buttons 0-6 */}
                                                {[0, 1, 2, 3, 4, 5, 6].map(num => (
                                                    <button
                                                        key={num}
                                                        onClick={() => handleQuickCreditsSelect(num)}
                                                        className={cn(
                                                            "text-xs font-medium px-2.5 py-1.5 rounded border transition-all min-w-[32px]",
                                                            subject.credits === num
                                                                ? "bg-crimson-violet-500 text-white border-crimson-violet-600 shadow-sm"
                                                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-crimson-violet-400"
                                                        )}
                                                    >
                                                        {num}
                                                    </button>
                                                ))}
                                            </div>
                                            {/* More button for 7-12 */}
                                            <button
                                                onClick={() => {
                                                    setShowCustomCredits(true);
                                                    setCreditsValue(subject.credits > 6 ? subject.credits.toString() : '7');
                                                }}
                                                className="text-xs font-medium px-2 py-1 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-crimson-violet-400 transition-all"
                                                title="Enter custom value (7-12)"
                                            >
                                                More (7-12) •••
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-1">
                                            {/* Custom input for 7-12 */}
                                            <input
                                                type="number"
                                                min="7"
                                                max="12"
                                                value={creditsValue}
                                                onChange={(e) => setCreditsValue(e.target.value)}
                                                onBlur={handleCreditsSubmit}
                                                onKeyDown={handleCreditsKeyDown}
                                                autoFocus
                                                placeholder="7-12"
                                                className="text-xs bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1.5 rounded border border-crimson-violet-400 dark:border-crimson-violet-500 w-full focus:outline-none focus:ring-1 focus:ring-crimson-violet-400"
                                            />
                                            <button
                                                onClick={() => setShowCustomCredits(false)}
                                                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-1"
                                            >
                                                ← Back
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
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
                                        : isInProgress
                                            ? "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/30 focus:ring-sky-400"
                                            : isReady
                                                ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/30 focus:ring-amber-400"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600 focus:ring-slate-400"
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
                                        : isInProgress
                                            ? "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-800/30 hover:bg-sky-100 dark:hover:bg-sky-900/30"
                                            : isReady
                                                ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/30 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                                )}
                            >
                                <Star size={10} />
                                {subject.grade || 'Add grade'}
                                <Edit2 size={8} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        )}
                    </div>

                    {/* Row 3: Locked Badge + Action Buttons */}
                    <div className="flex items-center justify-between gap-2 mt-1">
                        {isLockedMissing && (
                            <span className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1" title={`Missing: ${missingPrereqs.map(p => p?.name).join(', ')}`}>
                                <AlertCircle size={12} />
                                Locked
                            </span>
                        )}
                        {!isLockedMissing && (
                            <div></div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteDialog(true);
                                }}
                                className="opacity-0 group-hover:opacity-100 cursor-pointer text-slate-400 dark:text-slate-500 p-1.5 hover:text-red-500 dark:hover:text-red-400 transition-all hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                title="Delete subject"
                            >
                                <Trash2 size={14} />
                            </button>
                            <button
                                {...listeners}
                                {...attributes}
                                type="button"
                                className="opacity-50 group-hover:opacity-100 cursor-grab active:cursor-grabbing text-slate-400 dark:text-slate-500 p-1.5 hover:text-crimson-violet-500 dark:hover:text-crimson-violet-400 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                                title="Drag to move"
                            >
                                <GripVertical size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Row 4: Prerequisites */}
                    <PrerequisiteEditor subject={subject} />
                </div>
            </div>

            {/* Connector Line (Decorative) - shows on ready subjects */}
            {isReady && (
                <div className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400/0 to-transparent group-hover:via-amber-400/50 transition-all duration-500" />
            )}
        </motion.div>
        </>
    );
};

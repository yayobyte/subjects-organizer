import { motion } from 'framer-motion';
import { Check, Circle, BookOpen, Star, AlertCircle, GripVertical } from 'lucide-react';
import type { Subject } from '../types';
import { useSubjects } from '../contexts/SubjectContext';
import { cn } from '../lib/utils';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface SubjectCardProps {
    subject: Subject;
}

export const SubjectCard = ({ subject }: SubjectCardProps) => {
    const { toggleSubjectStatus, subjects } = useSubjects();
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


    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative p-4 rounded-xl border backdrop-blur-sm transition-all duration-300",
                isDragging ? "shadow-2xl ring-2 ring-crimson-violet-500/50 border-crimson-violet-500/50 scale-[1.02] z-50 bg-white" : "hover:shadow-lg",
                // Styles based on status
                isCompleted
                    ? "bg-white/80 dark:bg-slate-800/80 border-emerald-200 dark:border-emerald-800/30 hover:shadow-emerald-500/10"
                    : isLocked
                        ? "bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-80"
                        : "bg-white/60 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 hover:border-crimson-violet-300 hover:bg-white hover:shadow-crimson-violet-500/10"
            )}
        >
            <div
                {...listeners}
                {...attributes}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing text-slate-400 dark:text-slate-500 p-1 hover:text-crimson-violet-500 dark:hover:text-crimson-violet-400 transition-colors"
            >
                <GripVertical size={16} />
            </div>

            <div className="flex justify-between items-start gap-4">
                {/* Status Toggle */}
                <button
                    onClick={() => toggleSubjectStatus(subject.id)}
                    disabled={isLocked && !isCompleted}
                    className={cn(
                        "mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200",
                        isCompleted
                            ? "bg-emerald-500 text-white"
                            : isLocked
                                ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                                : "bg-slate-100 dark:bg-slate-700 text-slate-300 group-hover:border-crimson-violet-400 border border-transparent"
                    )}
                >
                    {isCompleted ? <Check size={14} strokeWidth={3} /> : <Circle size={14} />}
                </button>

                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h4 className={cn(
                            "font-medium text-sm transition-colors",
                            isCompleted ? "text-slate-700 dark:text-slate-200" : "text-slate-900 dark:text-white"
                        )}>
                            {subject.name}
                        </h4>
                        <span className="text-xs font-mono text-slate-400 dark:text-slate-500 flex-shrink-0 ml-2">
                            {subject.id}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                            <BookOpen size={10} />
                            {subject.credits} Cr
                        </span>

                        {isCompleted && subject.grade && (
                            <span className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800/30 flex items-center gap-1">
                                <Star size={10} />
                                {subject.grade}
                            </span>
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

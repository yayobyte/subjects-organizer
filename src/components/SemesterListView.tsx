import { useMemo } from 'react';
import { useSubjects } from '../contexts/SubjectContext';
import { SubjectCard } from './SubjectCard';
import { getSortedSemesters } from '../data';
import { StatsOverview } from './StatsDashboard';
import { PrerequisiteLines } from './PrerequisiteLines';
import { motion } from 'framer-motion';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { AddSubjectButton } from './AddSubjectButton';

export const SemesterListView = () => {
    const { subjects, studentName, reorderSubjectsInSemester } = useSubjects();

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(TouchSensor)
    );

    const semesters = useMemo(() => getSortedSemesters(), []);

    const groupedSubjects = useMemo(() => {
        const groups: Record<string, typeof subjects> = {};
        semesters.forEach(sem => {
            groups[sem] = subjects
                .filter(s => s.semester === sem)
                .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
        });
        return groups;
    }, [subjects, semesters]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const draggedSubjectId = active.id as string;
        const currentSubject = subjects.find(s => s.id === draggedSubjectId);
        if (!currentSubject) return;

        // Only handle within-semester reorder
        const targetSubject = subjects.find(s => s.id === over.id);

        if (targetSubject && currentSubject.semester === targetSubject.semester && active.id !== over.id) {
            const semesterSubjects = subjects
                .filter(s => s.semester === currentSubject.semester)
                .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

            const oldIndex = semesterSubjects.findIndex(s => s.id === active.id);
            const newIndex = semesterSubjects.findIndex(s => s.id === over.id);

            if (oldIndex !== newIndex) {
                const reordered = arrayMove(semesterSubjects, oldIndex, newIndex);
                reorderSubjectsInSemester(currentSubject.semester, reordered.map(s => s.id));
            }
        }
    };

    return (
        <div className="pb-20">
            <header className="mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-crimson-violet-500 to-deep-crimson-500">{studentName.split(' ')[0]}</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Here is your academic roadmap. Drag subjects to reorder within semesters.
                    </p>
                </div>
            </header>

            <div className="mb-8">
                <StatsOverview />
            </div>

            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <div className="relative semester-scroll-container flex gap-6 overflow-x-auto pb-4">
                    <PrerequisiteLines />
                    {semesters.map((semester, index) => {
                        const semesterSubjects = groupedSubjects[semester] || [];
                        const isCompleted = semesterSubjects.length > 0 && semesterSubjects.every(s => s.status === 'completed');

                        return (
                            <motion.section
                                key={semester}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex-shrink-0 w-80"
                                style={{ overflow: 'visible' }}
                            >
                                <div className="flex flex-col items-center gap-2 mb-4">
                                    <h2 className={`text-lg font-semibold tracking-tight ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                        {semester}
                                    </h2>
                                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        {semesterSubjects.reduce((acc, s) => acc + s.credits, 0)} Credits
                                    </span>
                                </div>

                                <SortableContext
                                    items={semesterSubjects.map(s => s.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="flex flex-col gap-4 min-h-[200px] p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800" style={{ overflow: 'visible' }}>
                                        {semesterSubjects.map(subject => (
                                            <SubjectCard key={subject.id} subject={subject} />
                                        ))}
                                        {semesterSubjects.length === 0 && (
                                            <div className="flex-1 py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 text-sm">
                                                No subjects yet
                                            </div>
                                        )}
                                    </div>
                                </SortableContext>
                                <AddSubjectButton semester={semester} />
                            </motion.section>
                        );
                    })}
                </div>
            </DndContext>
        </div>

    );
};

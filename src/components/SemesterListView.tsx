import { useMemo } from 'react';
import { useSubjects } from '../contexts/SubjectContext';
import { SubjectCard } from './SubjectCard';
import { getSortedSemesters } from '../data';
import { StatsOverview } from './StatsDashboard';
import { motion } from 'framer-motion';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { DroppableSemester } from './DroppableSemester';

export const SemesterListView = () => {
    const { subjects, studentName, moveSubjectToSemester } = useSubjects();

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(TouchSensor)
    );

    const semesters = useMemo(() => getSortedSemesters(subjects), [subjects]);

    const groupedSubjects = useMemo(() => {
        const groups: Record<string, typeof subjects> = {};
        semesters.forEach(sem => {
            groups[sem] = subjects.filter(s => s.semester === sem);
        });
        return groups;
    }, [subjects, semesters]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        // active.id is the subject ID, over.id is the semester name
        const subjectId = active.id as string;
        const targetSemester = over.id as string;

        // Find the current semester of the subject
        const currentSubject = subjects.find(s => s.id === subjectId);
        if (!currentSubject) return;

        // Only move if dropping into a different semester
        if (currentSubject.semester !== targetSemester) {
            moveSubjectToSemester(subjectId, targetSemester);
        }
    };

    return (
        <div className="pb-20">
            <header className="mb-8 flex justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-crimson-violet-500 to-deep-crimson-500">{studentName.split(' ')[0]}</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Here is your academic roadmap. Drag subjects to reorder semesters.
                    </p>
                </div>
            </header>

            <StatsOverview />

            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <div className="space-y-8">
                    {semesters.map((semester, index) => {
                        const semesterSubjects = groupedSubjects[semester] || [];
                        const isCompleted = semesterSubjects.length > 0 && semesterSubjects.every(s => s.status === 'completed');

                        return (
                            <motion.section
                                key={semester}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="relative"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <h2 className={`text-lg font-semibold tracking-tight ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                        {semester}
                                    </h2>
                                    <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800" />
                                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        {semesterSubjects.reduce((acc, s) => acc + s.credits, 0)} Credits
                                    </span>
                                </div>

                                <DroppableSemester id={semester}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 -m-4">
                                        {semesterSubjects.map(subject => (
                                            <SubjectCard key={subject.id} subject={subject} />
                                        ))}
                                        {semesterSubjects.length === 0 && (
                                            <div className="col-span-full py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 text-sm">
                                                Drop subjects here
                                            </div>
                                        )}
                                    </div>
                                </DroppableSemester>
                            </motion.section>
                        );
                    })}
                </div>
            </DndContext>
        </div>

    );
};

import { useMemo, useState } from 'react';
import { useSubjects } from '../contexts/SubjectContext';
import { getSortedSemesters } from '../data';
import type { Subject } from '../types';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

// Constants for layout
const NODE_WIDTH = 180;
const NODE_HEIGHT = 80;
const COLUMN_WIDTH = NODE_WIDTH + 60;
const ROW_HEIGHT = NODE_HEIGHT + 40;
const X_GAP = 60;

interface NodePosition {
    x: number;
    y: number;
    semester: string;
}

export const CurriculumGraph = () => {
    const { subjects, toggleSubjectStatus } = useSubjects();
    const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);

    const semesters = useMemo(() => getSortedSemesters(subjects), [subjects]);

    // 1. Calculate Positions
    // We'll organize by columns (semesters). Y position dynamic based on index in semester.
    const nodePositions = useMemo(() => {
        const positions: Record<string, NodePosition> = {};
        const semesterCounts: Record<string, number> = {};

        // First assign basic grid positions
        semesters.forEach((sem, colIndex) => {
            const semesterSubjects = subjects.filter(s => s.semester === sem);
            semesterSubjects.forEach((subject, rowIndex) => {
                positions[subject.id] = {
                    x: colIndex * COLUMN_WIDTH + 50,
                    y: rowIndex * ROW_HEIGHT + 100,
                    semester: sem
                };
            });
            semesterCounts[sem] = semesterSubjects.length;
        });

        // Center vertically relative to the tallest semester? 
        // For now, top-aligned is cleaner for reading flow.
        return positions;
    }, [subjects, semesters]);

    // 2. Identify connections to highlight
    const highlightedConnections = useMemo(() => {
        if (!hoveredSubject) return new Set<string>(); // Set of "source-target" strings

        // Reverse BFS to find all ancestors (prerequisites chain)
        const ancestors = new Set<string>();
        const queue = [hoveredSubject];
        const connections = new Set<string>();

        ancestors.add(hoveredSubject);

        while (queue.length > 0) {
            const currentId = queue.shift()!;
            const subject = subjects.find(s => s.id === currentId);
            if (subject && subject.prerequisites) {
                subject.prerequisites.forEach(pId => {
                    connections.add(`${pId}-${currentId}`); // Prereq -> Current
                    if (!ancestors.has(pId)) {
                        ancestors.add(pId);
                        queue.push(pId);
                    }
                });
            }
        }

        // Also find immediate children (dependents) for "what unlocks?"
        // (Optional, maybe just ancestors for "Prereqs" focus)
        // Let's stick to highlighting the PATH TO the subject (Prerequisites) which is the user request.

        return connections;

    }, [hoveredSubject, subjects]);


    // Helper to get color for connection
    const getConnectionColor = (source: string, target: string) => {
        const isHighlighted = highlightedConnections.has(`${source}-${target}`);
        if (isHighlighted) return "stroke-crimson-violet-500 dark:stroke-crimson-violet-400";

        // If not highlighted, show faint line if unlocked?
        // Default: faint grey
        return "stroke-slate-200 dark:stroke-slate-800";
    };

    const getConnectionWidth = (source: string, target: string) => {
        return highlightedConnections.has(`${source}-${target}`) ? 3 : 1;
    };

    const getConnectionOpacity = (source: string, target: string) => {
        if (!hoveredSubject) return 0.5; // Default state
        return highlightedConnections.has(`${source}-${target}`) ? 1 : 0.1;
    };


    return (
        <div className="relative w-full h-full overflow-auto bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm min-h-[600px] cursor-grab active:cursor-grabbing">
            <div
                className="relative min-w-[max-content] min-h-[max-content] p-20"
                style={{
                    width: semesters.length * (COLUMN_WIDTH + X_GAP) + 100,
                    height: Math.max(...Object.values(nodePositions).map(p => p.y)) + ROW_HEIGHT + 100
                }}
            >
                {/* SVG Layer for Connections */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" className="fill-slate-300 dark:fill-slate-700" />
                        </marker>
                        <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" className="fill-crimson-violet-500" />
                        </marker>
                    </defs>
                    {subjects.map(sub => (
                        sub.prerequisites?.map(pId => {
                            const source = nodePositions[pId];
                            const target = nodePositions[sub.id];
                            if (!source || !target) return null;

                            // Calculate control points for smooth bezier
                            const startX = source.x + COLUMN_WIDTH; // Right side of source
                            const startY = source.y + 50; // Middle (approx card height/2)
                            const endX = target.x;
                            const endY = target.y + 50;

                            const midX = (startX + endX) / 2;

                            const isHighlighted = highlightedConnections.has(`${pId}-${sub.id}`);

                            return (
                                <path
                                    key={`${pId}-${sub.id}`}
                                    d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                                    fill="none"
                                    className={cn(
                                        "transition-all duration-300 ease-in-out",
                                        getConnectionColor(pId, sub.id)
                                    )}
                                    strokeWidth={getConnectionWidth(pId, sub.id)}
                                    strokeOpacity={getConnectionOpacity(pId, sub.id)}
                                    markerEnd={isHighlighted ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                                />
                            );
                        })
                    ))}
                </svg>

                {/* Node Layer */}
                {subjects.map(subject => {
                    const pos = nodePositions[subject.id];
                    if (!pos) return null;

                    // Use ancestor/descendant logic for dimming properly? 
                    // Simplified: If hovering, dim everything NOT in the highlight path (or the subject itself).
                    // Actually, keep it simple: Dim everything not involved.

                    const isRelevant = !hoveredSubject || hoveredSubject === subject.id || highlightedConnections.has(`${subject.id}-${subjects.find(s => s.id === hoveredSubject)?.id}`);

                    const isDimmed = !!(hoveredSubject && !isRelevant);

                    return (
                        <div
                            key={subject.id}
                            className="absolute"
                            style={{
                                left: pos.x,
                                top: pos.y,
                                width: COLUMN_WIDTH,
                                height: 100 // Approximation
                            }}
                            onMouseEnter={() => setHoveredSubject(subject.id)}
                            onMouseLeave={() => setHoveredSubject(null)}
                        >
                            <GraphNode subject={subject} toggleStatus={toggleSubjectStatus} isDimmed={isDimmed} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const GraphNode = ({ subject, toggleStatus, isDimmed }: { subject: Subject, toggleStatus: any, isDimmed: boolean }) => {
    const isCompleted = subject.status === 'completed';
    return (
        <motion.div
            layout // Smooth layout changes
            className={cn(
                "p-3 rounded-lg border shadow-sm backdrop-blur-md transition-all duration-300",
                isCompleted
                    ? "bg-white dark:bg-slate-800 border-emerald-500/50 shadow-emerald-500/10"
                    : "bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700",
                isDimmed ? "opacity-20 grayscale" : "opacity-100 scale-100 z-10"
            )}
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{subject.id}</span>
                <button
                    onClick={(e) => { e.stopPropagation(); toggleStatus(subject.id); }}
                    className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-slate-400'}`}
                >
                    {isCompleted && <Check size={10} />}
                </button>
            </div>
            <h5 className="text-sm font-medium leading-tight text-slate-800 dark:text-slate-100 mb-1 line-clamp-2">
                {subject.name}
            </h5>
            <div className="flex items-center gap-2">
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
                    {subject.credits} Cr
                </span>
            </div>
        </motion.div>
    )
}

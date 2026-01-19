import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubjects } from '../contexts/SubjectContext';
import { useConfig } from '../contexts/ConfigContext';

interface Point {
    x: number;
    y: number;
}

interface Connection {
    from: Point;
    to: Point;
    status: 'completed' | 'in-progress' | 'missing' | 'current';
    subjectId: string;
    prereqId: string;
}

export const PrerequisiteLines = () => {
    const { subjects } = useSubjects();
    const { config } = useConfig();
    const [connections, setConnections] = useState<Connection[]>([]);
    const [, setContainerRect] = useState<DOMRect | null>(null);

    // Calculate connections between subjects and their prerequisites
    const calculateConnections = useCallback((): Connection[] => {
        const newConnections: Connection[] = [];

        // Get the scroll container bounds
        const container = document.querySelector('.semester-scroll-container');
        if (!container) return [];

        const containerBounds = container.getBoundingClientRect();
        setContainerRect(containerBounds);

        subjects.forEach(subject => {
            if (!subject.prerequisites || subject.prerequisites.length === 0) return;

            subject.prerequisites.forEach(prereqId => {
                const prereqCard = document.querySelector(`[data-subject-id="${prereqId}"]`);
                const subjectCard = document.querySelector(`[data-subject-id="${subject.id}"]`);

                if (prereqCard && subjectCard) {
                    const prereqRect = prereqCard.getBoundingClientRect();
                    const subjectRect = subjectCard.getBoundingClientRect();

                    // Calculate positions relative to container
                    const from: Point = {
                        x: prereqRect.right - containerBounds.left + container.scrollLeft,
                        y: prereqRect.top + prereqRect.height / 2 - containerBounds.top
                    };

                    const to: Point = {
                        x: subjectRect.left - containerBounds.left + container.scrollLeft,
                        y: subjectRect.top + subjectRect.height / 2 - containerBounds.top
                    };

                    // Determine prerequisite status
                    const prereqSubject = subjects.find(s => s.id === prereqId);
                    const status = prereqSubject?.status || 'missing';

                    newConnections.push({
                        from,
                        to,
                        status,
                        subjectId: subject.id,
                        prereqId
                    });
                }
            });
        });

        return newConnections;
    }, [subjects]);

    // Create curved path using bezier curves
    const createCurvePath = (from: Point, to: Point): string => {
        const controlPointOffset = Math.abs(to.x - from.x) * 0.5;

        return `
            M ${from.x} ${from.y}
            C ${from.x + controlPointOffset} ${from.y},
              ${to.x - controlPointOffset} ${to.y},
              ${to.x} ${to.y}
        `;
    };

    // Get color based on prerequisite status
    const getLineColor = (status: 'completed' | 'in-progress' | 'missing' | 'current'): string => {
        switch (status) {
            case 'completed':
                return 'stroke-emerald-500 dark:stroke-emerald-400';
            case 'in-progress':
            case 'current':
                return 'stroke-dark-teal-500 dark:stroke-dark-teal-400';
            case 'missing':
                return 'stroke-deep-crimson-500 dark:stroke-deep-crimson-400';
        }
    };

    // Debounced recalculation on scroll/resize
    useEffect(() => {
        if (!config.showPrerequisiteLines) return;

        let timeoutId: number;

        const handleUpdate = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                requestAnimationFrame(() => {
                    const newConnections = calculateConnections();
                    setConnections(newConnections);
                });
            }, 100);
        };

        // Initial calculation
        handleUpdate();

        // Listen to scroll on the container
        const container = document.querySelector('.semester-scroll-container');
        if (container) {
            container.addEventListener('scroll', handleUpdate);
        }

        // Listen to window resize
        window.addEventListener('resize', handleUpdate);

        return () => {
            clearTimeout(timeoutId);
            if (container) {
                container.removeEventListener('scroll', handleUpdate);
            }
            window.removeEventListener('resize', handleUpdate);
        };
    }, [config.showPrerequisiteLines, subjects, calculateConnections]);

    // Recalculate when subjects change
    useEffect(() => {
        if (config.showPrerequisiteLines) {
            const timeoutId = setTimeout(() => {
                const newConnections = calculateConnections();
                setConnections(newConnections);
            }, 100);

            return () => clearTimeout(timeoutId);
        }
    }, [subjects, config.showPrerequisiteLines, calculateConnections]);

    if (!config.showPrerequisiteLines || connections.length === 0) {
        return null;
    }

    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
                zIndex: 1,
                overflow: 'visible'
            }}
        >
            <defs>
                {/* Arrow markers for line endings */}
                <marker
                    id="arrow-completed"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <path d="M0,0 L0,6 L9,3 z" className="fill-emerald-500 dark:fill-emerald-400" />
                </marker>
                <marker
                    id="arrow-in-progress"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <path d="M0,0 L0,6 L9,3 z" className="fill-dark-teal-500 dark:fill-dark-teal-400" />
                </marker>
                <marker
                    id="arrow-missing"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <path d="M0,0 L0,6 L9,3 z" className="fill-deep-crimson-500 dark:fill-deep-crimson-400" />
                </marker>
            </defs>

            <AnimatePresence>
                {connections.map((connection, index) => {
                    const pathData = createCurvePath(connection.from, connection.to);
                    const isDashed = connection.status === 'missing';
                    const markerEnd = `url(#arrow-${connection.status})`;

                    return (
                        <motion.path
                            key={`${connection.subjectId}-${connection.prereqId}-${index}`}
                            d={pathData}
                            className={getLineColor(connection.status)}
                            strokeWidth={2}
                            strokeDasharray={isDashed ? '5,5' : '0'}
                            fill="none"
                            opacity={0.6}
                            markerEnd={markerEnd}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.6 }}
                            exit={{ pathLength: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                        />
                    );
                })}
            </AnimatePresence>
        </svg>
    );
};

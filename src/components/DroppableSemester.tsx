import { useDroppable } from '@dnd-kit/core';
import { type ReactNode } from 'react';
import { cn } from '../lib/utils';

interface DroppableSemesterProps {
    id: string;
    children: ReactNode;
    className?: string;
}

export const DroppableSemester = ({ id, children, className }: DroppableSemesterProps) => {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "transition-all duration-200 rounded-2xl",
                isOver ? "bg-crimson-violet-500/10 ring-2 ring-crimson-violet-500/50" : "",
                className
            )}
        >
            {children}
        </div>
    );
};

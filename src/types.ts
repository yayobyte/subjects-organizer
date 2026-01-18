export type SubjectStatus = 'completed' | 'missing' | 'in-progress' | 'current';

export interface Subject {
    id: string; // Course Code
    name: string;
    semester: string;
    credits: number;
    status: SubjectStatus;
    grade?: number | string; // Some are numeric, some "Aprobada"
    prerequisites?: string[]; // array of Subject IDs
}

export interface StudentData {
    studentName: string;
    subjects: Subject[];
}

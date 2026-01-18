import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Subject, StudentData, SubjectStatus } from '../types';
import { HYDRATED_DATA } from '../data';

interface SubjectContextType {
    studentName: string;
    subjects: Subject[];
    toggleSubjectStatus: (id: string) => void;
    updateSubjectStatus: (id: string, status: SubjectStatus) => void;
    togglePrerequisiteCheck: (id: string) => void;
    getSubject: (id: string) => Subject | undefined;
    moveSubjectToSemester: (subjectId: string, targetSemester: string) => void;
    exportData: () => void;
    importData: (jsonData: StudentData) => void;
    resetData: () => void;
}

const SubjectContext = createContext<SubjectContextType | undefined>(undefined);

export const useSubjects = () => {
    const context = useContext(SubjectContext);
    if (!context) {
        throw new Error('useSubjects must be used within a SubjectProvider');
    }
    return context;
};

export const SubjectProvider = ({ children }: { children: ReactNode }) => {
    // Initialize state from localStorage or use default data
    const [data, setData] = useState<StudentData>(() => {
        const saved = localStorage.getItem('curriculum-tracker-data');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse saved data", e);
            }
        }
        return HYDRATED_DATA;
    });

    // Save to localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem('curriculum-tracker-data', JSON.stringify(data));
    }, [data]);

    const updateSubjectStatus = (id: string, status: SubjectStatus) => {
        setData(prev => ({
            ...prev,
            subjects: prev.subjects.map(s => s.id === id ? { ...s, status } : s)
        }));
    };

    const toggleSubjectStatus = (id: string) => {
        const subject = data.subjects.find(s => s.id === id);
        if (!subject) return;

        const nextStatus: Record<SubjectStatus, SubjectStatus> = {
            'missing': 'in-progress',
            'in-progress': 'completed',
            'completed': 'missing',
            'current': 'completed'
        };

        updateSubjectStatus(id, nextStatus[subject.status] || 'missing');
    };

    const moveSubjectToSemester = (subjectId: string, targetSemester: string) => {
        setData(prev => ({
            ...prev,
            subjects: prev.subjects.map(s =>
                s.id === subjectId ? { ...s, semester: targetSemester } : s
            )
        }));
    };

    const exportData = () => {
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'curriculum-data.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const importData = (jsonData: StudentData) => {
        // Simple validation 
        if (jsonData && jsonData.subjects && Array.isArray(jsonData.subjects)) {
            setData(jsonData);
        } else {
            alert('Invalid JSON format. Please ensure it follows the StudentData interface.');
        }
    };

    const resetData = () => {
        if (window.confirm('Are you sure you want to reset all data to defaults?')) {
            setData(HYDRATED_DATA);
            localStorage.removeItem('curriculum-tracker-data');
        }
    };

    const togglePrerequisiteCheck = (_id: string) => {
        // Future feature: simulate passing a prerequisite
    };

    const getSubject = (id: string) => data.subjects.find(s => s.id === id);

    return (
        <SubjectContext.Provider value={{
            studentName: data.studentName,
            subjects: data.subjects,
            toggleSubjectStatus,
            updateSubjectStatus,
            togglePrerequisiteCheck,
            getSubject,
            moveSubjectToSemester,
            exportData,
            importData,
            resetData
        }}>
            {children}
        </SubjectContext.Provider>
    );
};

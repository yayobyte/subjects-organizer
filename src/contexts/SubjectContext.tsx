import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Subject, StudentData, SubjectStatus } from '../types';
import { getStorageAdapter } from '../lib/storage';

interface SubjectContextType {
    studentName: string;
    subjects: Subject[];
    toggleSubjectStatus: (id: string) => void;
    updateSubjectStatus: (id: string, status: SubjectStatus) => void;
    updateSubjectGrade: (id: string, grade: number | string) => void;
    updateSubjectCredits: (id: string, credits: number) => void;
    updateSubjectName: (id: string, name: string) => void;
    updatePrerequisites: (id: string, prerequisites: string[]) => void;
    deleteSubject: (id: string) => void;
    togglePrerequisiteCheck: (id: string) => void;
    getSubject: (id: string) => Subject | undefined;
    reorderSubjectsInSemester: (semester: string, orderedSubjectIds: string[]) => void;
    addSubject: (subject: Subject) => void;
    exportData: () => void;
    importData: (jsonData: StudentData) => void;
    resetData: () => void;
    isLoading: boolean;
    hoveredSubjectId: string | null;
    setHoveredSubjectId: (id: string | null) => void;
}

const SubjectContext = createContext<SubjectContextType | undefined>(undefined);

export const useSubjects = () => {
    const context = useContext(SubjectContext);
    if (!context) {
        throw new Error('useSubjects must be used within a SubjectProvider');
    }
    return context;
};

// Default empty state while loading
const EMPTY_DATA: StudentData = {
    studentName: '',
    subjects: []
};

export const SubjectProvider = ({ children }: { children: ReactNode }) => {
    const [data, setData] = useState<StudentData>(EMPTY_DATA);
    const [isLoading, setIsLoading] = useState(true);
    const [hasSuccessfullyLoaded, setHasSuccessfullyLoaded] = useState(false);
    const storage = getStorageAdapter();

    // Load data on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const loaded = await storage.load();
                if (loaded) {
                    setData(loaded);
                    setHasSuccessfullyLoaded(true);
                } else {
                    console.warn('No data found in storage or fetch failed');
                    // We don't set hasSuccessfullyLoaded to true here to prevent 
                    // overwriting the DB with empty data if the fetch failed.
                }
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // Save data whenever it changes (debounced to avoid excessive saves)
    useEffect(() => {
        // --- PREVENT AUTO-DELETION ---
        // 1. Don't save if still loading.
        // 2. Don't save if we haven't successfully pulled the baseline from the server yet.
        // 3. Don't save if the curriculum is empty (this is almost always an error state 
        //    unless the user explicitly deleted every single card one by one).
        if (isLoading || !hasSuccessfullyLoaded || data.subjects.length === 0) {
            return;
        }

        const saveData = async () => {
            try {
                await storage.save(data);
            } catch (error) {
                console.error('Failed to save data:', error);
            }
        };

        // Debounce saves
        const timeoutId = setTimeout(saveData, 1000);
        return () => clearTimeout(timeoutId);
    }, [data, isLoading, hasSuccessfullyLoaded]);

    const updateSubjectStatus = (id: string, status: SubjectStatus) => {
        setData(prev => ({
            ...prev,
            subjects: prev.subjects.map(s => s.id === id ? { ...s, status } : s)
        }));
    };

    const updateSubjectGrade = (id: string, grade: number | string) => {
        setData(prev => ({
            ...prev,
            subjects: prev.subjects.map(s => s.id === id ? { ...s, grade } : s)
        }));
    };

    const updateSubjectCredits = (id: string, credits: number) => {
        setData(prev => ({
            ...prev,
            subjects: prev.subjects.map(s => s.id === id ? { ...s, credits } : s)
        }));
    };

    const updateSubjectName = (id: string, name: string) => {
        setData(prev => ({
            ...prev,
            subjects: prev.subjects.map(s => s.id === id ? { ...s, name } : s)
        }));
    };

    const updatePrerequisites = (id: string, prerequisites: string[]) => {
        setData(prev => ({
            ...prev,
            subjects: prev.subjects.map(s => s.id === id ? { ...s, prerequisites } : s)
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

    const reorderSubjectsInSemester = (semester: string, orderedSubjectIds: string[]) => {
        setData(prev => ({
            ...prev,
            subjects: prev.subjects.map(subject => {
                if (subject.semester === semester) {
                    const newIndex = orderedSubjectIds.indexOf(subject.id);
                    return {
                        ...subject,
                        orderIndex: newIndex >= 0 ? newIndex : subject.orderIndex ?? 0
                    };
                }
                return subject;
            })
        }));
    };

    const addSubject = (subject: Subject) => {
        setData(prev => ({
            ...prev,
            subjects: [...prev.subjects, subject]
        }));
    };

    const deleteSubject = (id: string) => {
        setData(prev => ({
            ...prev,
            subjects: prev.subjects.filter(s => s.id !== id)
        }));
    };

    const exportData = () => {
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'curriculum.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        console.info('📥 Downloaded curriculum.json');
    };

    const importData = (jsonData: StudentData) => {
        // Simple validation 
        if (jsonData && jsonData.subjects && Array.isArray(jsonData.subjects)) {
            setData(jsonData);
            console.info('✅ Data imported successfully');
        } else {
            alert('Invalid JSON format. Please ensure it follows the StudentData interface.');
        }
    };

    const resetData = async () => {
        if (window.confirm('Are you sure you want to reset all data? This will reload from curriculum.json.')) {
            try {
                await storage.reset();
                // Reload from storage
                const loaded = await storage.load();
                if (loaded) {
                    setData(loaded);
                    console.info('✅ Data reset successfully');
                }
            } catch (error) {
                console.error('Failed to reset data:', error);
            }
        }
    };

    const togglePrerequisiteCheck = (_id: string) => {
        // Future feature: simulate passing a prerequisite
    };

    const getSubject = (id: string) => data.subjects.find(s => s.id === id);

    const [hoveredSubjectId, setHoveredSubjectId] = useState<string | null>(null);

    return (
        <SubjectContext.Provider value={{
            studentName: data.studentName,
            subjects: data.subjects,
            toggleSubjectStatus,
            updateSubjectStatus,
            updateSubjectGrade,
            updateSubjectCredits,
            updateSubjectName,
            updatePrerequisites,
            deleteSubject,
            togglePrerequisiteCheck,
            getSubject,
            reorderSubjectsInSemester,
            addSubject,
            exportData,
            importData,
            resetData,
            isLoading,
            hoveredSubjectId,
            setHoveredSubjectId
        }}>
            {children}
        </SubjectContext.Provider>
    );
};

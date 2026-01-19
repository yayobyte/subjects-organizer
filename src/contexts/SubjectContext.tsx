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
    togglePrerequisiteCheck: (id: string) => void;
    getSubject: (id: string) => Subject | undefined;
    moveSubjectToSemester: (subjectId: string, targetSemester: string) => void;
    addSubject: (subject: Subject) => void;
    exportData: () => void;
    importData: (jsonData: StudentData) => void;
    resetData: () => void;
    isLoading: boolean;
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
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const storage = getStorageAdapter();

    // Load data on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const loaded = await storage.load();
                if (loaded) {
                    setData(loaded);
                } else {
                    console.warn('No data found in storage, using empty state');
                }
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setIsLoading(false);
                // We use a timeout to ensure any state updates from loading are processed
                // before we allow saving again.
                setTimeout(() => setIsFirstLoad(false), 1000);
            }
        };

        loadData();
    }, []);

    // Save data whenever it changes (debounced to avoid excessive saves)
    useEffect(() => {
        // Don't save if still loading, if it's the empty state, or if it's the very first load
        if (isLoading || isFirstLoad || data === EMPTY_DATA) return;

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
    }, [data, isLoading, isFirstLoad]);

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

    const addSubject = (subject: Subject) => {
        setData(prev => ({
            ...prev,
            subjects: [...prev.subjects, subject]
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

    return (
        <SubjectContext.Provider value={{
            studentName: data.studentName,
            subjects: data.subjects,
            toggleSubjectStatus,
            updateSubjectStatus,
            updateSubjectGrade,
            updateSubjectCredits,
            togglePrerequisiteCheck,
            getSubject,
            moveSubjectToSemester,
            addSubject,
            exportData,
            importData,
            resetData,
            isLoading
        }}>
            {children}
        </SubjectContext.Provider>
    );
};

import type { StudentData } from '../types';
import { supabase } from './supabase';
import defaultData from '../../server/data/curriculum.json';

/**
 * Storage interface for curriculum data
 */
export interface IDataStorage {
    load(): Promise<StudentData | null>;
    save(data: StudentData): Promise<void>;
    reset(): Promise<void>;
}

/**
 * Supabase Frontend adapter: Connects directly to Supabase with user context for RLS
 */
export class SupabaseStorageAdapter implements IDataStorage {
    async load(): Promise<StudentData | null> {
        try {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData.user) {
                console.error('User not authenticated');
                return null;
            }

            const { data, error } = await supabase
                .from('subjects')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;

            // Transform database format to frontend format
            const transformedSubjects = (data || []).map(subject => ({
                id: subject.id,
                name: subject.name,
                credits: subject.credits,
                semester: subject.semester,
                grade: subject.grade,
                status: subject.status,
                prerequisites: subject.prerequisites || []
            }));

            // If the user is brand new and has no subjects, fall back to the default curriculum.
            // The frontend SubjectContext will automatically sync this back to Supabase.
            if (transformedSubjects.length === 0) {
                console.info('No subjects found for user. Falling back to default curriculum data.');
                return defaultData as unknown as StudentData;
            }

            return {
                subjects: transformedSubjects,
                studentName: '' // Will be populated by ConfigContext
            };

        } catch (error) {
            console.error('Failed to load from Supabase:', error);
            return null;
        }
    }

    async save(data: StudentData): Promise<void> {
        try {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData.user) {
                throw new Error('User not authenticated');
            }

            const userId = userData.user.id;

            // Prepare subjects for database
            const subjectsToSync = data.subjects.map((subject, index) => ({
                id: subject.id,
                user_id: userId,
                name: subject.name,
                credits: subject.credits,
                semester: subject.semester,
                grade: subject.grade ?? null,
                status: subject.status,
                completed: subject.status === 'completed',
                order_index: subject.orderIndex ?? index,
                prerequisites: subject.prerequisites || []
            }));

            // Delete subjects not in the current list
            const currentIds = subjectsToSync.map(s => s.id);
            if (currentIds.length > 0) {
                const { error: deleteError } = await supabase
                    .from('subjects')
                    .delete()
                    .not('id', 'in', `(${currentIds.join(',')})`);

                if (deleteError) throw deleteError;
            } else {
                // If empty, delete all for this user
                const { error: deleteError } = await supabase
                    .from('subjects')
                    .delete()
                    .eq('user_id', userId);
                if (deleteError) throw deleteError;
            }

            // Upsert current subjects
            if (subjectsToSync.length > 0) {
                const { error: upsertError } = await supabase
                    .from('subjects')
                    .upsert(subjectsToSync, { onConflict: 'id' });

                if (upsertError) throw upsertError;
            }

            console.info('✅ Data saved to Supabase');
        } catch (error) {
            console.error('Failed to save to Supabase:', error);
            throw error;
        }
    }

    async reset(): Promise<void> {
        try {
            const { error } = await supabase
                .from('subjects')
                .delete()
                .neq('id', ''); // Delete all subjects for this user (RLS will scope it)

            if (error) throw error;
            console.info('✅ Data reset to initial state');
        } catch (error) {
            console.error('Failed to reset via Supabase:', error);
            throw error;
        }
    }
}

/**
 * Returns the storage adapter
 */
export function getStorageAdapter(): IDataStorage {
    return new SupabaseStorageAdapter();
}

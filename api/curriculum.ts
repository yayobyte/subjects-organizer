import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

interface Subject {
    id: string;
    name: string;
    credits: number;
    semester: string;
    grade?: number;
    status?: string;
    completed?: boolean;
    orderIndex?: number;
    prerequisites?: string[];
}

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            // Get all subjects
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
                status: subject.status || (subject.completed ? 'completed' : 'missing'),
                prerequisites: subject.prerequisites || []
            }));

            return res.status(200).json({
                subjects: transformedSubjects,
                studentName: '' // Will be fetched from config
            });

        } else if (req.method === 'POST') {
            const { subjects } = req.body as { subjects: Subject[] };

            if (!subjects || !Array.isArray(subjects)) {
                return res.status(400).json({ error: 'Invalid data format' });
            }

            // --- SAFETY GUARD ---
            // If the incoming list is empty, we DON'T want to wipe the database automatically.
            // This usually happens during a synchronization error or initial load failure.
            if (subjects.length === 0) {
                // Check if we actually have data in the DB first
                const { count } = await supabase
                    .from('subjects')
                    .select('*', { count: 'exact', head: true });

                if (count && count > 0) {
                    console.warn('Refusing to auto-wipe database with empty subject list. Potential sync error.');
                    return res.status(200).json({
                        success: true,
                        message: 'Sync skipped: Database contains data but incoming list was empty. Integrity preserved.'
                    });
                }
            }

            // Remove duplicate IDs from the input array
            const seenIds = new Set<string>();
            const uniqueSubjects = subjects.filter(s => {
                if (!s.id || seenIds.has(s.id)) return false;
                seenIds.add(s.id);
                return true;
            });

            // Prepare subjects for database
            const subjectsToSync = uniqueSubjects.map((subject, index) => ({
                id: subject.id,
                name: subject.name,
                credits: subject.credits,
                semester: subject.semester,
                grade: subject.grade ?? null,
                status: subject.status || (subject.completed ? 'completed' : 'missing'),
                completed: subject.status === 'completed' || subject.completed === true,
                order_index: subject.orderIndex ?? index,
                prerequisites: subject.prerequisites || []
            }));

            // Targeted Delete: Remove subjects that are no longer in our list
            const incomingIds = subjectsToSync.map(s => s.id);
            if (incomingIds.length > 0) {
                const { error: deleteError } = await supabase
                    .from('subjects')
                    .delete()
                    .not('id', 'in', `(${incomingIds.join(',')})`);

                if (deleteError) {
                    console.error('Targeted delete error:', deleteError);
                    throw deleteError;
                }
            } else {
                // If we got here and the list is empty, it means either the DB was already empty
                // or the guard above was bypassed. We only delete everything if we are absolutely sure.
                await supabase.from('subjects').delete().neq('id', '');
            }

            // Upsert: Insert new ones and update existing ones
            if (subjectsToSync.length > 0) {
                const { error: upsertError } = await supabase
                    .from('subjects')
                    .upsert(subjectsToSync, { onConflict: 'id' });

                if (upsertError) {
                    console.error('Upsert error details:', upsertError);
                    throw upsertError;
                }
            }

            return res.status(200).json({
                success: true,
                message: 'Curriculum synchronized successfully'
            });

        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }

    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({
            error: 'Database operation failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

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

            // Delete all existing subjects
            const { error: deleteError } = await supabase
                .from('subjects')
                .delete()
                .neq('id', ''); // Delete all rows

            if (deleteError) {
                console.error('Delete error:', deleteError);
                throw deleteError;
            }

            // Remove duplicate IDs from the input array to prevent unique constraint violations
            const seenIds = new Set<string>();
            const uniqueSubjects = subjects.filter(s => {
                if (seenIds.has(s.id)) {
                    console.warn(`Filtering out duplicate subject ID: ${s.id}`);
                    return false;
                }
                seenIds.add(s.id);
                return true;
            });

            // Insert unique subjects
            const subjectsToInsert = uniqueSubjects.map((subject, index) => ({
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

            if (subjectsToInsert.length > 0) {
                const { error: insertError } = await supabase
                    .from('subjects')
                    .insert(subjectsToInsert);

                if (insertError) {
                    console.error('Insert error details:', insertError);
                    throw insertError;
                }
            }

            return res.status(200).json({
                success: true,
                message: 'Curriculum saved successfully'
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

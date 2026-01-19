import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

interface Subject {
    id: string;
    name: string;
    credits: number;
    semester: string;
    grade?: number;
    completed: boolean;
    orderIndex: number;
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

            return res.status(200).json({
                subjects: data || [],
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

            if (deleteError) throw deleteError;

            // Insert all subjects
            const subjectsToInsert = subjects.map(subject => ({
                id: subject.id,
                name: subject.name,
                credits: subject.credits,
                semester: subject.semester,
                grade: subject.grade ?? null,
                completed: subject.completed,
                order_index: subject.orderIndex
            }));

            const { error: insertError } = await supabase
                .from('subjects')
                .insert(subjectsToInsert);

            if (insertError) throw insertError;

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

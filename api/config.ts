import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

interface Config {
    darkMode: boolean;
    studentName: string;
    showPrerequisiteLines: boolean;
}

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            // Get configuration
            const { data, error } = await supabase
                .from('config')
                .select('dark_mode, student_name, show_prerequisite_lines')
                .eq('id', 1)
                .single();

            if (error) {
                // If config doesn't exist, return defaults
                if (error.code === 'PGRST116') {
                    return res.status(200).json({
                        darkMode: false,
                        studentName: 'Cristian Gutierrez Gonzalez',
                        showPrerequisiteLines: false
                    });
                }
                throw error;
            }

            return res.status(200).json({
                darkMode: data.dark_mode,
                studentName: data.student_name,
                showPrerequisiteLines: data.show_prerequisite_lines || false
            });

        } else if (req.method === 'POST') {
            const { darkMode, studentName, showPrerequisiteLines } = req.body as Config;

            // Validate
            if (typeof darkMode !== 'boolean' || typeof studentName !== 'string') {
                return res.status(400).json({ error: 'Invalid config format' });
            }

            // Upsert configuration
            const { error } = await supabase
                .from('config')
                .upsert({
                    id: 1,
                    dark_mode: darkMode,
                    student_name: studentName,
                    show_prerequisite_lines: showPrerequisiteLines !== undefined ? showPrerequisiteLines : false
                }, {
                    onConflict: 'id'
                });

            if (error) throw error;

            return res.status(200).json({
                success: true,
                message: 'Configuration saved successfully'
            });

        } else if (req.method === 'PATCH') {
            // Get current config
            const { data: currentData, error: fetchError } = await supabase
                .from('config')
                .select('dark_mode, student_name, show_prerequisite_lines')
                .eq('id', 1)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                throw fetchError;
            }

            const currentConfig = currentData || {
                dark_mode: false,
                student_name: 'Cristian Gutierrez Gonzalez',
                show_prerequisite_lines: false
            };

            const updates = req.body as Partial<Config>;

            // Merge with updates
            const newConfig = {
                darkMode: updates.darkMode !== undefined ? updates.darkMode : currentConfig.dark_mode,
                studentName: updates.studentName !== undefined ? updates.studentName : currentConfig.student_name,
                showPrerequisiteLines: updates.showPrerequisiteLines !== undefined ? updates.showPrerequisiteLines : (currentConfig.show_prerequisite_lines || false)
            };

            // Validate
            if (typeof newConfig.darkMode !== 'boolean' || typeof newConfig.studentName !== 'string' || typeof newConfig.showPrerequisiteLines !== 'boolean') {
                return res.status(400).json({ error: 'Invalid config format' });
            }

            // Update configuration
            const { error } = await supabase
                .from('config')
                .upsert({
                    id: 1,
                    dark_mode: newConfig.darkMode,
                    student_name: newConfig.studentName,
                    show_prerequisite_lines: newConfig.showPrerequisiteLines
                }, {
                    onConflict: 'id'
                });

            if (error) throw error;

            return res.status(200).json({
                success: true,
                config: newConfig
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

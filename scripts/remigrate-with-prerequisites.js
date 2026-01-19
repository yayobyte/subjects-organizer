#!/usr/bin/env node

/**
 * Re-migration script to update data with prerequisites and status
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
try {
    const envFile = await fs.readFile(path.join(__dirname, '..', '.env'), 'utf-8');
    envFile.split('\n').forEach(line => {
        const [key, ...values] = line.split('=');
        if (key && values.length) {
            process.env[key.trim()] = values.join('=').trim();
        }
    });
} catch (error) {
    // Use environment variables
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Error: Missing environment variables');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function remigrate() {
    console.log('🚀 Re-migrating data with prerequisites and status...\n');

    try {
        // Check if we have a curriculum.json file
        let curriculumPath = path.join(__dirname, '..', 'server', 'data', 'curriculum.json');

        // Check if file exists
        try {
            await fs.access(curriculumPath);
        } catch {
            console.error('❌ curriculum.json not found. Please provide the file.');
            process.exit(1);
        }

        console.log('📖 Reading curriculum.json...');
        const curriculumData = JSON.parse(await fs.readFile(curriculumPath, 'utf-8'));

        console.log(`   Found ${curriculumData.subjects.length} subjects\n`);

        // Transform subjects
        const subjects = curriculumData.subjects.map((subject, index) => {
            // Map status
            let status = 'missing';
            if (subject.status === 'completed') status = 'completed';
            else if (subject.status === 'in-progress') status = 'in-progress';
            else if (subject.status === 'current') status = 'current';

            // Parse grade
            let grade = null;
            if (subject.grade !== undefined && subject.grade !== null) {
                if (typeof subject.grade === 'number') {
                    grade = subject.grade;
                } else if (typeof subject.grade === 'string' && subject.grade !== 'Aprobada') {
                    grade = parseFloat(subject.grade);
                }
            }

            return {
                id: subject.id,
                name: subject.name,
                credits: subject.credits,
                semester: subject.semester,
                grade: grade,
                status: status,
                completed: status === 'completed',
                order_index: index,
                prerequisites: subject.prerequisites || []
            };
        });

        // Delete all existing subjects
        console.log('🗑️  Clearing existing data...');
        const { error: deleteError } = await supabase
            .from('subjects')
            .delete()
            .neq('id', '');

        if (deleteError) throw deleteError;

        // Insert in batches
        const BATCH_SIZE = 100;
        console.log('📚 Inserting subjects with prerequisites...');

        for (let i = 0; i < subjects.length; i += BATCH_SIZE) {
            const batch = subjects.slice(i, i + BATCH_SIZE);
            console.log(`   Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} subjects`);

            const { error: insertError } = await supabase
                .from('subjects')
                .insert(batch);

            if (insertError) {
                console.error('❌ Insert error:', insertError);
                throw insertError;
            }
        }

        console.log(`✅ Successfully migrated ${subjects.length} subjects\n`);

        // Verify
        console.log('🔍 Verifying...');
        const { data: verifyData, error: verifyError } = await supabase
            .from('subjects')
            .select('id, status, prerequisites')
            .limit(5);

        if (verifyError) throw verifyError;

        console.log('First 5 subjects:');
        verifyData.forEach(s => {
            console.log(`  - ${s.id}: status=${s.status}, prerequisites=${JSON.stringify(s.prerequisites)}`);
        });

        console.log('\n✅ Migration completed successfully!');

    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    }
}

remigrate();

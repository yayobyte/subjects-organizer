#!/usr/bin/env node

/**
 * Migration script to transfer data from local JSON files to Supabase
 *
 * Usage:
 *   SUPABASE_URL=your-url SUPABASE_ANON_KEY=your-key node scripts/migrate-to-supabase.js
 *
 * Or create a .env file with:
 *   SUPABASE_URL=your-supabase-url
 *   SUPABASE_ANON_KEY=your-anon-key
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file if it exists
try {
    const envFile = await fs.readFile(path.join(__dirname, '..', '.env'), 'utf-8');
    envFile.split('\n').forEach(line => {
        const [key, ...values] = line.split('=');
        if (key && values.length) {
            process.env[key.trim()] = values.join('=').trim();
        }
    });
} catch (error) {
    // .env file doesn't exist, use environment variables
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Error: Missing environment variables');
    console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY');
    console.error('\nExample:');
    console.error('  SUPABASE_URL=https://xxx.supabase.co SUPABASE_ANON_KEY=your-key node scripts/migrate-to-supabase.js');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function migrateData() {
    console.log('🚀 Starting migration to Supabase...\n');

    try {
        // Read JSON files
        const curriculumPath = path.join(__dirname, '..', 'server', 'data', 'curriculum.json');
        const configPath = path.join(__dirname, '..', 'server', 'data', 'config.json');

        console.log('📖 Reading local JSON files...');
        const curriculumData = JSON.parse(await fs.readFile(curriculumPath, 'utf-8'));
        const configData = JSON.parse(await fs.readFile(configPath, 'utf-8'));

        console.log(`   Found ${curriculumData.subjects.length} subjects`);
        console.log(`   Student: ${curriculumData.studentName || configData.studentName}\n`);

        // Migrate config
        console.log('⚙️  Migrating configuration...');
        const { error: configError } = await supabase
            .from('config')
            .upsert({
                id: 1,
                dark_mode: configData.darkMode || false,
                student_name: configData.studentName || curriculumData.studentName || 'Student'
            }, {
                onConflict: 'id'
            });

        if (configError) {
            console.error('❌ Config migration failed:', configError);
            throw configError;
        }
        console.log('✅ Configuration migrated successfully\n');

        // Migrate subjects
        console.log('📚 Migrating subjects...');

        // Transform subjects from JSON format to database format
        const subjects = curriculumData.subjects.map((subject, index) => {
            // Map status to completed boolean
            let completed = false;
            if (subject.status === 'completed') {
                completed = true;
            }

            // Parse grade - handle both numbers and strings like "Aprobada"
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
                completed: completed,
                order_index: index
            };
        });

        // Delete existing subjects first
        console.log('   Clearing existing subjects...');
        const { error: deleteError } = await supabase
            .from('subjects')
            .delete()
            .neq('id', ''); // Delete all rows

        if (deleteError) {
            console.error('❌ Failed to clear existing subjects:', deleteError);
            throw deleteError;
        }

        // Insert subjects in batches (Supabase has limits)
        const BATCH_SIZE = 100;
        for (let i = 0; i < subjects.length; i += BATCH_SIZE) {
            const batch = subjects.slice(i, i + BATCH_SIZE);
            console.log(`   Inserting subjects ${i + 1}-${Math.min(i + BATCH_SIZE, subjects.length)}...`);

            const { error: insertError } = await supabase
                .from('subjects')
                .insert(batch);

            if (insertError) {
                console.error('❌ Subject migration failed:', insertError);
                throw insertError;
            }
        }

        console.log(`✅ Successfully migrated ${subjects.length} subjects\n`);

        // Verify migration
        console.log('🔍 Verifying migration...');
        const { data: verifySubjects, error: verifyError } = await supabase
            .from('subjects')
            .select('id', { count: 'exact' });

        if (verifyError) {
            console.error('❌ Verification failed:', verifyError);
            throw verifyError;
        }

        console.log(`   ✓ Found ${verifySubjects.length} subjects in database`);

        const { data: verifyConfig } = await supabase
            .from('config')
            .select('student_name')
            .eq('id', 1)
            .single();

        console.log(`   ✓ Config student name: ${verifyConfig?.student_name}\n`);

        console.log('✅ Migration completed successfully!');
        console.log('\n📝 Summary:');
        console.log(`   - Subjects migrated: ${subjects.length}`);
        console.log(`   - Configuration: ${verifyConfig?.student_name}`);
        console.log(`   - Dark mode: ${configData.darkMode ? 'enabled' : 'disabled'}`);

    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
migrateData();

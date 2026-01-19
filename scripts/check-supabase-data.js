#!/usr/bin/env node

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
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkData() {
    console.log('🔍 Checking Supabase data...\n');

    try {
        // Get subjects
        const { data: subjects, error: subjectsError } = await supabase
            .from('subjects')
            .select('*')
            .order('order_index', { ascending: true });

        if (subjectsError) throw subjectsError;

        console.log(`📚 Found ${subjects.length} subjects in database\n`);

        // Show first 5 subjects
        console.log('First 5 subjects:');
        subjects.slice(0, 5).forEach(s => {
            console.log(`  - ${s.id}: ${s.name}`);
            console.log(`    Credits: ${s.credits}, Semester: ${s.semester}`);
            console.log(`    Grade: ${s.grade}, Completed: ${s.completed}`);
            console.log(`    Order: ${s.order_index}\n`);
        });

        // Check for completed subjects
        const completedCount = subjects.filter(s => s.completed === true).length;
        console.log(`✅ Completed subjects: ${completedCount}`);

        // Check for subjects with grades
        const withGrades = subjects.filter(s => s.grade !== null).length;
        console.log(`📊 Subjects with grades: ${withGrades}\n`);

        // Get config
        const { data: config, error: configError } = await supabase
            .from('config')
            .select('*')
            .eq('id', 1)
            .single();

        if (configError) throw configError;

        console.log('⚙️  Configuration:');
        console.log(`  Student: ${config.student_name}`);
        console.log(`  Dark Mode: ${config.dark_mode}\n`);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkData();

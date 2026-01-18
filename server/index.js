import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data', 'curriculum.json');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data file exists
async function ensureDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        console.warn('curriculum.json not found, creating default file...');
        const defaultData = {
            studentName: '',
            subjects: []
        };
        await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
        await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2));
    }
}

// GET /api/curriculum - Load curriculum data
app.get('/api/curriculum', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading curriculum:', error);
        res.status(500).json({ error: 'Failed to load curriculum data' });
    }
});

// POST /api/curriculum - Save curriculum data
app.post('/api/curriculum', async (req, res) => {
    try {
        const data = req.body;

        // Basic validation
        if (!data.subjects || !Array.isArray(data.subjects)) {
            return res.status(400).json({ error: 'Invalid data format' });
        }

        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
        res.json({ success: true, message: 'Curriculum saved successfully' });
    } catch (error) {
        console.error('Error saving curriculum:', error);
        res.status(500).json({ error: 'Failed to save curriculum data' });
    }
});

// POST /api/curriculum/reset - Reset to default data
app.post('/api/curriculum/reset', async (req, res) => {
    try {
        // For reset, we'll reload from a backup or use the initial file
        // You can customize this logic as needed
        const backupFile = path.join(__dirname, 'data', 'curriculum.backup.json');

        try {
            // Try to restore from backup
            const backupData = await fs.readFile(backupFile, 'utf-8');
            await fs.writeFile(DATA_FILE, backupData);
            res.json({ success: true, message: 'Curriculum reset from backup' });
        } catch {
            // If no backup, just return current state
            res.json({ success: true, message: 'No backup available, keeping current state' });
        }
    } catch (error) {
        console.error('Error resetting curriculum:', error);
        res.status(500).json({ error: 'Failed to reset curriculum data' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
await ensureDataFile();

app.listen(PORT, () => {
    console.log(`🚀 Backend API running on http://localhost:${PORT}`);
    console.log(`📁 Data file: ${DATA_FILE}`);
});

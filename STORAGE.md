# Data Storage System

## Overview

The curriculum tracker now uses a **storage abstraction layer** that allows you to easily switch between different data persistence backends.

## Storage Backends

### 1. JSON File Storage (Default)
- **Location**: `/public/data/curriculum.json`
- **How it works**:
  - Reads curriculum data from the JSON file on app load
  - Saves changes by downloading a new JSON file
  - You manually replace the file in `/public/data/` to persist changes

### 2. LocalStorage
- **Location**: Browser's localStorage
- **How it works**:
  - Automatically saves all changes to browser storage
  - Data persists across page refreshes
  - Data is browser-specific (not shared across devices)

### 3. Hybrid Storage
- **Location**: LocalStorage + JSON file
- **How it works**:
  - Loads from localStorage first (faster)
  - Falls back to JSON file if no localStorage data exists
  - Saves to localStorage for quick updates
  - Can export to JSON file manually

## Switching Storage Backends

### Option 1: Environment Variable
Create a `.env` file in the project root:

```bash
# Use 'file', 'localStorage', or 'hybrid'
VITE_STORAGE_TYPE=file
```

### Option 2: Code Configuration
Edit `src/lib/storage.ts` and change the default in `getStorageAdapter()`:

```typescript
export function getStorageAdapter(): IDataStorage {
    const storageType = import.meta.env.VITE_STORAGE_TYPE || 'file'; // Change 'file' to your preference
    // ...
}
```

## Using JSON File Storage

### Initial Setup
1. The default curriculum data is in `/public/data/curriculum.json`
2. This file is loaded when the app starts

### Making Changes Persistent
1. Make your changes in the app (drag subjects, toggle statuses, etc.)
2. Click the **Export** button (download icon) in the navbar
3. Save the downloaded `curriculum.json` file
4. Replace `/public/data/curriculum.json` with the downloaded file
5. Refresh the app to see your changes

### Workflow
```bash
# 1. Make changes in the app
# 2. Export data
Click Export button → saves curriculum.json

# 3. Replace the file
mv ~/Downloads/curriculum.json public/data/curriculum.json

# 4. Refresh browser
# Your changes are now the new default!
```

## Generating the Initial JSON File

If you need to regenerate the JSON file from the TypeScript data:

```bash
npm run generate-json
```

This creates `/public/data/curriculum.json` from the data in `src/data.ts`.

## File Structure

```
assignments/
├── public/
│   └── data/
│       └── curriculum.json          # Your curriculum data
├── src/
│   ├── lib/
│   │   └── storage.ts               # Storage abstraction layer
│   ├── data.ts                      # Prerequisites map only
│   └── contexts/
│       └── SubjectContext.tsx       # Uses storage adapter
└── scripts/
    └── generate-json.ts             # Script to generate JSON
```

## Data Format

The `curriculum.json` file follows this structure:

```json
{
  "studentName": "Your Name",
  "subjects": [
    {
      "id": "CS101",
      "name": "Introduction to Computer Science",
      "semester": "Semestre 1",
      "credits": 3,
      "status": "completed",
      "grade": 4.0,
      "prerequisites": []
    }
    // ... more subjects
  ]
}
```

## Benefits of JSON File Storage

✅ **Portable**: Take your data anywhere  
✅ **Version Control**: Track changes with git  
✅ **Backup**: Easy to backup and restore  
✅ **Shareable**: Share with others  
✅ **Editable**: Can edit directly in a text editor  

## Tips

- **Backup regularly**: Export your data frequently
- **Version control**: Commit `curriculum.json` to git
- **Multiple profiles**: Create different JSON files for different scenarios
- **Validation**: The app validates imported JSON to prevent errors

## Troubleshooting

**Q: My changes aren't persisting**  
A: Make sure you've replaced `/public/data/curriculum.json` with your exported file and refreshed the browser.

**Q: I get "No data found" error**  
A: Ensure `/public/data/curriculum.json` exists and is valid JSON.

**Q: Can I use a database?**  
A: Yes! Create a new adapter in `src/lib/storage.ts` that implements the `IDataStorage` interface.

## Advanced: Creating Custom Storage Adapters

To create your own storage backend:

1. Implement the `IDataStorage` interface:
```typescript
export class MyCustomAdapter implements IDataStorage {
    async load(): Promise<StudentData | null> {
        // Your load logic
    }
    
    async save(data: StudentData): Promise<void> {
        // Your save logic
    }
    
    async reset(): Promise<void> {
        // Your reset logic
    }
}
```

2. Add it to `getStorageAdapter()` in `storage.ts`

3. Set `VITE_STORAGE_TYPE` to your adapter name

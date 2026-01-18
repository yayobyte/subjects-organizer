import type { StudentData } from '../types';

/**
 * Storage interface for curriculum data
 * Allows swapping between different storage backends (localStorage, files, API, etc.)
 */
export interface IDataStorage {
    load(): Promise<StudentData | null>;
    save(data: StudentData): Promise<void>;
    reset(): Promise<void>;
}

/**
 * LocalStorage implementation (browser-based)
 */
export class LocalStorageAdapter implements IDataStorage {
    private readonly key = 'curriculum-tracker-data';

    async load(): Promise<StudentData | null> {
        try {
            const saved = localStorage.getItem(this.key);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
        }
        return null;
    }

    async save(data: StudentData): Promise<void> {
        try {
            localStorage.setItem(this.key, JSON.stringify(data, null, 2));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }

    async reset(): Promise<void> {
        localStorage.removeItem(this.key);
    }
}

/**
 * JSON File implementation (uses public folder for read, downloads for write)
 * Reads from /data/curriculum.json
 * Writes by downloading a new file
 */
export class JSONFileAdapter implements IDataStorage {
    private readonly dataUrl = '/data/curriculum.json';

    async load(): Promise<StudentData | null> {
        try {
            const response = await fetch(this.dataUrl);
            if (!response.ok) {
                console.warn('No curriculum.json found, will use defaults');
                return null;
            }
            return await response.json();
        } catch (e) {
            console.error('Failed to load from JSON file:', e);
            return null;
        }
    }

    async save(data: StudentData): Promise<void> {
        // For file-based storage, we download the file
        // User needs to manually replace /public/data/curriculum.json
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'curriculum.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        console.info('📥 Downloaded curriculum.json - Replace /public/data/curriculum.json with this file to persist changes');
    }

    async reset(): Promise<void> {
        // For file-based, reset means reloading from the original file
        console.info('Reset: Reload the page to load from curriculum.json');
    }
}

/**
 * Hybrid adapter: Uses localStorage for quick saves, but can sync with JSON file
 */
export class HybridStorageAdapter implements IDataStorage {
    private localStorage = new LocalStorageAdapter();
    private fileStorage = new JSONFileAdapter();

    async load(): Promise<StudentData | null> {
        // Try localStorage first (faster)
        const localData = await this.localStorage.load();
        if (localData) {
            return localData;
        }

        // Fall back to JSON file
        return await this.fileStorage.load();
    }

    async save(data: StudentData): Promise<void> {
        // Save to both
        await this.localStorage.save(data);
        // Note: File save triggers download, so we skip it during normal saves
        // Only use exportToFile() explicitly
    }

    async reset(): Promise<void> {
        await this.localStorage.reset();
    }

    async exportToFile(data: StudentData): Promise<void> {
        await this.fileStorage.save(data);
    }
}

/**
 * API Backend adapter: Connects to Express backend for file-based persistence
 */
export class APIStorageAdapter implements IDataStorage {
    private readonly baseUrl = import.meta.env.VITE_API_URL || '/api';

    async load(): Promise<StudentData | null> {
        try {
            const response = await fetch(`${this.baseUrl}/curriculum`);
            if (!response.ok) {
                console.error('Failed to load from API:', response.statusText);
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to load from API:', error);
            return null;
        }
    }

    async save(data: StudentData): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/curriculum`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Failed to save: ${response.statusText}`);
            }

            console.info('✅ Data saved to curriculum.json');
        } catch (error) {
            console.error('Failed to save to API:', error);
            throw error;
        }
    }

    async reset(): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/curriculum/reset`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error(`Failed to reset: ${response.statusText}`);
            }

            console.info('✅ Data reset to initial state');
        } catch (error) {
            console.error('Failed to reset via API:', error);
            throw error;
        }
    }
}

/**
 * Factory to get the configured storage adapter
 */
export function getStorageAdapter(): IDataStorage {
    // Change this to switch storage backends
    const storageType = import.meta.env.VITE_STORAGE_TYPE || 'api';

    switch (storageType) {
        case 'localStorage':
            return new LocalStorageAdapter();
        case 'file':
            return new JSONFileAdapter();
        case 'hybrid':
            return new HybridStorageAdapter();
        case 'api':
            return new APIStorageAdapter();
        default:
            return new APIStorageAdapter(); // Default to API backend
    }
}

import type { StudentData } from '../types';

/**
 * Storage interface for curriculum data
 */
export interface IDataStorage {
    load(): Promise<StudentData | null>;
    save(data: StudentData): Promise<void>;
    reset(): Promise<void>;
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
 * Returns the storage adapter (API only)
 */
export function getStorageAdapter(): IDataStorage {
    return new APIStorageAdapter();
}

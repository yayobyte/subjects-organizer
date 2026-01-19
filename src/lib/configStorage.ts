/**
 * Configuration Storage Adapter
 * Handles saving/loading user preferences from backend API
 */

export interface Config {
    darkMode: boolean;
    studentName: string;
}

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export class ConfigStorageAdapter {
    /**
     * Load configuration from backend
     */
    async load(): Promise<Config> {
        try {
            const response = await fetch(`${API_BASE}/config`);
            if (!response.ok) {
                throw new Error(`Failed to load config: ${response.statusText}`);
            }
            const config = await response.json();
            console.log('[ConfigStorage] Loaded config:', config);
            return config;
        } catch (error) {
            console.error('[ConfigStorage] Error loading config:', error);
            // Return defaults on error
            return {
                darkMode: false,
                studentName: 'Student'
            };
        }
    }

    /**
     * Save entire configuration to backend
     */
    async save(config: Config): Promise<void> {
        try {
            const response = await fetch(`${API_BASE}/config`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config),
            });

            if (!response.ok) {
                throw new Error(`Failed to save config: ${response.statusText}`);
            }

            console.log('[ConfigStorage] Saved config:', config);
        } catch (error) {
            console.error('[ConfigStorage] Error saving config:', error);
            throw error;
        }
    }

    /**
     * Update specific config fields (partial update)
     */
    async update(updates: Partial<Config>): Promise<Config> {
        try {
            const response = await fetch(`${API_BASE}/config`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                throw new Error(`Failed to update config: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('[ConfigStorage] Updated config:', result.config);
            return result.config;
        } catch (error) {
            console.error('[ConfigStorage] Error updating config:', error);
            throw error;
        }
    }

    /**
     * Reset configuration to defaults
     */
    async reset(): Promise<void> {
        try {
            const response = await fetch(`${API_BASE}/config/reset`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error(`Failed to reset config: ${response.statusText}`);
            }

            console.log('[ConfigStorage] Config reset to defaults');
        } catch (error) {
            console.error('[ConfigStorage] Error resetting config:', error);
            throw error;
        }
    }
}

export const configStorage = new ConfigStorageAdapter();

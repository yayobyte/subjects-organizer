import { supabase } from './supabase';

export interface UserConfig {
    darkMode: boolean;
    studentName: string;
    showPrerequisiteLines: boolean;
}

export interface IConfigStorage {
    load(): Promise<UserConfig | null>;
    save(config: UserConfig): Promise<void>;
    update(updates: Partial<UserConfig>): Promise<UserConfig>;
}

export class SupabaseConfigStorageAdapter implements IConfigStorage {
    async load(): Promise<UserConfig | null> {
        try {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData.user) {
                console.error('User not authenticated');
                return null;
            }

            const { data, error } = await supabase
                .from('config')
                .select('dark_mode, student_name, show_prerequisite_lines')
                .eq('user_id', userData.user.id)
                .maybeSingle();

            if (error) throw error;

            // If config doesn't exist for this user, return defaults
            if (!data) {
                return {
                    darkMode: false,
                    studentName: 'Cristian Gutierrez Gonzalez',
                    showPrerequisiteLines: false
                };
            }

            return {
                darkMode: data.dark_mode,
                studentName: data.student_name,
                showPrerequisiteLines: data.show_prerequisite_lines || false
            };
        } catch (error) {
            console.error('Failed to load config from Supabase:', error);
            // Return defaults on error to avoid breaking the app
            return {
                darkMode: false,
                studentName: 'Cristian Gutierrez Gonzalez',
                showPrerequisiteLines: false
            };
        }
    }

    async save(config: UserConfig): Promise<void> {
        try {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData.user) {
                throw new Error('User not authenticated');
            }

            const { error } = await supabase
                .from('config')
                .upsert({
                    user_id: userData.user.id,
                    dark_mode: config.darkMode,
                    student_name: config.studentName,
                    show_prerequisite_lines: config.showPrerequisiteLines !== undefined ? config.showPrerequisiteLines : false
                }, {
                    onConflict: 'user_id'
                });

            if (error) throw error;
        } catch (error) {
            console.error('Failed to save config to Supabase:', error);
            throw error;
        }
    }

    async update(updates: Partial<UserConfig>): Promise<UserConfig> {
        try {
            const currentConfig = await this.load();
            const configTemplate = currentConfig || {
                darkMode: false,
                studentName: 'Cristian Gutierrez Gonzalez',
                showPrerequisiteLines: false
            };

            const newConfig = {
                ...configTemplate,
                ...updates
            };

            await this.save(newConfig);
            return newConfig;
        } catch (error) {
            console.error('Failed to update config in Supabase:', error);
            throw error;
        }
    }
}

export function getConfigStorageAdapter(): IConfigStorage {
    return new SupabaseConfigStorageAdapter();
}

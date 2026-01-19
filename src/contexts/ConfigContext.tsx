import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { configStorage, type Config } from '../lib/configStorage';

interface ConfigContextType {
    config: Config;
    isLoading: boolean;
    updateDarkMode: (darkMode: boolean) => Promise<void>;
    updateStudentName: (name: string) => Promise<void>;
    resetConfig: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfig must be used within ConfigProvider');
    }
    return context;
};

interface ConfigProviderProps {
    children: ReactNode;
}

export const ConfigProvider = ({ children }: ConfigProviderProps) => {
    const [config, setConfig] = useState<Config>({
        darkMode: false,
        studentName: 'Student'
    });
    const [isLoading, setIsLoading] = useState(true);

    // Load config on mount
    useEffect(() => {
        const loadConfig = async () => {
            try {
                console.log('[ConfigContext] Loading configuration...');
                const loadedConfig = await configStorage.load();
                setConfig(loadedConfig);
                
                // Apply dark mode immediately
                applyDarkMode(loadedConfig.darkMode);
            } catch (error) {
                console.error('[ConfigContext] Failed to load config:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadConfig();
    }, []);

    const applyDarkMode = (isDark: boolean) => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const updateDarkMode = async (darkMode: boolean) => {
        try {
            console.log('[ConfigContext] Updating dark mode to:', darkMode);
            
            // Optimistically update UI
            setConfig(prev => ({ ...prev, darkMode }));
            applyDarkMode(darkMode);

            // Save to backend
            const updatedConfig = await configStorage.update({ darkMode });
            setConfig(updatedConfig);
        } catch (error) {
            console.error('[ConfigContext] Failed to update dark mode:', error);
            // Revert on error
            setConfig(prev => ({ ...prev, darkMode: !darkMode }));
            applyDarkMode(!darkMode);
        }
    };

    const updateStudentName = async (studentName: string) => {
        try {
            console.log('[ConfigContext] Updating student name to:', studentName);
            
            // Optimistically update UI
            setConfig(prev => ({ ...prev, studentName }));

            // Save to backend
            const updatedConfig = await configStorage.update({ studentName });
            setConfig(updatedConfig);
        } catch (error) {
            console.error('[ConfigContext] Failed to update student name:', error);
            // Revert on error
            setConfig(prev => ({ ...prev, studentName: config.studentName }));
        }
    };

    const resetConfig = async () => {
        try {
            console.log('[ConfigContext] Resetting configuration...');
            await configStorage.reset();
            
            // Reload config
            const loadedConfig = await configStorage.load();
            setConfig(loadedConfig);
            applyDarkMode(loadedConfig.darkMode);
        } catch (error) {
            console.error('[ConfigContext] Failed to reset config:', error);
        }
    };

    const value: ConfigContextType = {
        config,
        isLoading,
        updateDarkMode,
        updateStudentName,
        resetConfig,
    };

    return (
        <ConfigContext.Provider value={value}>
            {children}
        </ConfigContext.Provider>
    );
};

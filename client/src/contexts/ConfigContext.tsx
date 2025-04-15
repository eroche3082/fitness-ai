import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  FitnessConfig, 
  defaultConfig, 
  getConfig, 
  updateConfig, 
  subscribeToConfigChanges 
} from '../services/fitnessConfigService';
import { useAuth } from '../App';

interface ConfigContextType {
  config: FitnessConfig;
  isLoading: boolean;
  error: string | null;
  updateAppConfig: (newConfig: Partial<FitnessConfig>) => Promise<void>;
  applyConfig: (config: FitnessConfig) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const [config, setConfig] = useState<FitnessConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userRole } = useAuth();

  useEffect(() => {
    // Cargar la configuración inicial
    const loadConfig = async () => {
      try {
        setIsLoading(true);
        const initialConfig = await getConfig();
        setConfig(initialConfig);
        setError(null);
      } catch (err) {
        console.error('Error loading config:', err);
        setError('Failed to load configuration');
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();

    // Suscribirse a cambios en la configuración
    const unsubscribe = subscribeToConfigChanges((newConfig) => {
      setConfig(newConfig);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Función para actualizar la configuración
  const updateAppConfig = async (newConfig: Partial<FitnessConfig>) => {
    try {
      if (!userRole || (userRole !== 'admin' && userRole !== 'manager')) {
        throw new Error('No tienes permiso para modificar la configuración');
      }

      await updateConfig(newConfig, 'current-user-id', userRole);
      // No actualizamos el estado aquí porque el listener se encargará de eso
    } catch (err: any) {
      console.error('Error updating config:', err);
      setError(err.message || 'Failed to update configuration');
      throw err;
    }
  };

  // Función para aplicar la configuración sin guardarla en Firestore
  // Útil para previsualizar cambios antes de guardar
  const applyConfig = (configToApply: FitnessConfig) => {
    setConfig(configToApply);
  };

  const value = {
    config,
    isLoading,
    error,
    updateAppConfig,
    applyConfig
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FitnessConfig, getConfig, setConfig, subscribeToConfig } from '../services/fitnessConfigService';

interface ConfigContextType {
  config: FitnessConfig | null;
  isLoading: boolean;
  error: Error | null;
  updateConfig: (newConfig: Partial<FitnessConfig>) => Promise<void>;
  reloadConfig: () => Promise<void>;
}

// Crear contexto con valores por defecto
const ConfigContext = createContext<ConfigContextType>({
  config: null,
  isLoading: true,
  error: null,
  updateConfig: async () => {},
  reloadConfig: async () => {},
});

// Hook personalizado para usar el contexto
export const useConfig = () => useContext(ConfigContext);

// Proveedor del contexto
export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setLocalConfig] = useState<FitnessConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Cargar configuración inicial
  const loadConfig = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedConfig = await getConfig();
      setLocalConfig(loadedConfig);
    } catch (err) {
      console.error('Error al cargar la configuración:', err);
      setError(err instanceof Error ? err : new Error('Error desconocido al cargar la configuración'));
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar la configuración
  const updateConfig = async (newConfig: Partial<FitnessConfig>) => {
    if (!config) return;
    
    try {
      const updatedConfig = { ...config, ...newConfig };
      await setConfig(updatedConfig);
      setLocalConfig(updatedConfig);
    } catch (err) {
      console.error('Error al actualizar la configuración:', err);
      setError(err instanceof Error ? err : new Error('Error desconocido al actualizar la configuración'));
      throw err;
    }
  };

  // Efecto para cargar la configuración inicial y suscribirse a cambios
  useEffect(() => {
    loadConfig();
    
    // Suscribirse a los cambios en la configuración
    const unsubscribe = subscribeToConfig((updatedConfig) => {
      setLocalConfig(updatedConfig);
    });
    
    // Limpiar suscripción al desmontar
    return () => {
      unsubscribe();
    };
  }, []);

  // Contexto provider
  return (
    <ConfigContext.Provider 
      value={{ 
        config, 
        isLoading, 
        error, 
        updateConfig,
        reloadConfig: loadConfig
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
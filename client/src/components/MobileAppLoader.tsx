import { useState, useEffect } from "react";
import { Activity } from "lucide-react";

/**
 * Componente de carga para simular la experiencia de una aplicación nativa
 * Muestra un splash screen con animación al cargar la aplicación
 */
const MobileAppLoader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular tiempo de carga de la app - puede ser reemplazado por verificación real de carga
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="app-loading">
      <div className="flex flex-col items-center justify-center">
        <Activity className="text-green-500 h-16 w-16 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-6">Fitness AI</h1>
        <div className="app-loading-spinner mb-4"></div>
        <p className="text-gray-400 text-sm">Cargando tu experiencia personalizada...</p>
      </div>
    </div>
  );
};

export default MobileAppLoader;
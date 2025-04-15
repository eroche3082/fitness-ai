import React, { useState, useEffect } from 'react';
import { useAuth } from '../../App';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Database,
  Server,
  HardDrive,
  Cpu,
  Globe,
  Key,
  Maximize,
  Minimize,
  Clock,
  BarChart
} from 'lucide-react';

// Tipos
type SystemStatus = 'operational' | 'degraded' | 'outage' | 'maintenance';

interface SystemComponent {
  id: string;
  name: string;
  status: SystemStatus;
  lastChecked: string;
  uptime: number;
  responseTime?: number;
  details?: string;
}

interface StatusHistory {
  date: string;
  status: SystemStatus;
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  apiCalls: number;
  activeUsers: number;
  errorRate: number;
}

// Datos de muestra
const sampleComponents: SystemComponent[] = [
  {
    id: 'api',
    name: 'API Core',
    status: 'operational',
    lastChecked: new Date().toISOString(),
    uptime: 99.98,
    responseTime: 124,
    details: 'Todos los endpoints están respondiendo normalmente'
  },
  {
    id: 'database',
    name: 'Base de Datos',
    status: 'operational',
    lastChecked: new Date().toISOString(),
    uptime: 99.95,
    responseTime: 45,
    details: 'Conexiones estables, sin problemas de rendimiento'
  },
  {
    id: 'auth',
    name: 'Sistema de Autenticación',
    status: 'operational',
    lastChecked: new Date().toISOString(),
    uptime: 99.99,
    responseTime: 230,
    details: 'Funcionando correctamente con tiempos de respuesta normales'
  },
  {
    id: 'ai',
    name: 'Motor de IA',
    status: 'degraded',
    lastChecked: new Date().toISOString(),
    uptime: 98.75,
    responseTime: 840,
    details: 'Tiempos de respuesta elevados en algunas solicitudes'
  },
  {
    id: 'storage',
    name: 'Almacenamiento',
    status: 'operational',
    lastChecked: new Date().toISOString(),
    uptime: 99.92,
    responseTime: 78,
    details: 'Funcionando sin incidencias'
  },
  {
    id: 'fitness-trackers',
    name: 'Integraciones Fitness',
    status: 'degraded',
    lastChecked: new Date().toISOString(),
    uptime: 97.50,
    responseTime: 560,
    details: 'Problemas con la sincronización de Fitbit debido a falta de credenciales API'
  }
];

// Historial de estado de ejemplo para un componente
const sampleHistory: StatusHistory[] = [
  { date: '2025-04-14T10:00:00', status: 'operational' },
  { date: '2025-04-14T08:00:00', status: 'operational' },
  { date: '2025-04-14T06:00:00', status: 'operational' },
  { date: '2025-04-14T04:00:00', status: 'operational' },
  { date: '2025-04-14T02:00:00', status: 'operational' },
  { date: '2025-04-14T00:00:00', status: 'operational' },
  { date: '2025-04-13T22:00:00', status: 'degraded' },
  { date: '2025-04-13T20:00:00', status: 'degraded' },
  { date: '2025-04-13T18:00:00', status: 'operational' },
  { date: '2025-04-13T16:00:00', status: 'operational' },
  { date: '2025-04-13T14:00:00', status: 'operational' },
  { date: '2025-04-13T12:00:00', status: 'operational' }
];

// Métricas de sistema de ejemplo
const sampleMetrics: SystemMetrics = {
  cpuUsage: 32,
  memoryUsage: 45,
  diskUsage: 28,
  apiCalls: 14328,
  activeUsers: 287,
  errorRate: 0.42
};

export default function SystemIntegrityPage() {
  const { userRole } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [components, setComponents] = useState<SystemComponent[]>(sampleComponents);
  const [selectedComponent, setSelectedComponent] = useState<SystemComponent | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>(sampleHistory);
  const [metrics, setMetrics] = useState<SystemMetrics>(sampleMetrics);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Función para registrar actividad administrativa
  const logAdminActivity = (activity: string) => {
    console.log(`[ADMIN LOG] ${new Date().toISOString()}: ${activity}`);
  };

  // Verificar permisos
  useEffect(() => {
    if (userRole !== 'manager' && userRole !== 'admin') {
      toast({
        title: "Acceso denegado",
        description: "No tienes permisos para acceder a esta página",
        variant: "destructive"
      });
      setLocation('/');
    }
  }, [userRole, setLocation, toast]);

  const handleComponentSelect = (component: SystemComponent) => {
    setSelectedComponent(component);
    // En un sistema real, aquí cargaríamos el historial específico para este componente
    logAdminActivity(`Viewed system component status: ${component.name}`);
  };

  const refreshSystemStatus = () => {
    setIsRefreshing(true);
    logAdminActivity('Initiated system integrity check');
    
    // Simulación de refresco (en producción, sería una llamada API)
    setTimeout(() => {
      // Actualizar la hora de última comprobación para todos los componentes
      const updatedComponents = components.map(component => ({
        ...component,
        lastChecked: new Date().toISOString()
      }));
      
      setComponents(updatedComponents);
      setIsRefreshing(false);
      
      toast({
        title: "Verificación completada",
        description: "Se ha actualizado el estado de todos los componentes del sistema",
        variant: "default"
      });
    }, 2500);
  };

  const getStatusColorClass = (status: SystemStatus) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'outage':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'maintenance':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const getStatusIcon = (status: SystemStatus, size: number = 5) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className={`h-${size} w-${size} text-green-500`} />;
      case 'degraded':
        return <AlertTriangle className={`h-${size} w-${size} text-yellow-500`} />;
      case 'outage':
        return <XCircle className={`h-${size} w-${size} text-red-500`} />;
      case 'maintenance':
        return <RefreshCw className={`h-${size} w-${size} text-blue-500`} />;
    }
  };

  const getStatusLabel = (status: SystemStatus) => {
    switch (status) {
      case 'operational':
        return 'Operativo';
      case 'degraded':
        return 'Rendimiento degradado';
      case 'outage':
        return 'Fuera de servicio';
      case 'maintenance':
        return 'En mantenimiento';
    }
  };

  const getComponentIcon = (id: string, size: number = 5) => {
    switch (id) {
      case 'api':
        return <Globe className={`h-${size} w-${size}`} />;
      case 'database':
        return <Database className={`h-${size} w-${size}`} />;
      case 'auth':
        return <Key className={`h-${size} w-${size}`} />;
      case 'ai':
        return <Cpu className={`h-${size} w-${size}`} />;
      case 'storage':
        return <HardDrive className={`h-${size} w-${size}`} />;
      case 'fitness-trackers':
        return <BarChart className={`h-${size} w-${size}`} />;
      default:
        return <Server className={`h-${size} w-${size}`} />;
    }
  };

  const getSystemOverallStatus = (): SystemStatus => {
    if (components.some(c => c.status === 'outage')) {
      return 'outage';
    } else if (components.some(c => c.status === 'degraded')) {
      return 'degraded';
    } else if (components.some(c => c.status === 'maintenance')) {
      return 'maintenance';
    } else {
      return 'operational';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatUptime = (percentage: number) => {
    return percentage.toFixed(2) + '%';
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-green-500">Integridad del Sistema</h1>
            <p className="text-gray-400 mt-1">
              Monitorea y verifica el estado de los componentes de la plataforma
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              variant="outline" 
              className="ml-2 border-green-500 text-green-500 hover:bg-green-900"
              onClick={refreshSystemStatus}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Verificando...' : 'Actualizar estado'}
            </Button>
          </div>
        </div>

        {/* Panel de estado general */}
        <Card className="bg-gray-900 border-gray-800 shadow-md mb-8">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <ShieldCheck className="h-6 w-6 text-green-500 mr-2" />
                <div>
                  <CardTitle className="text-white">Estado general del sistema</CardTitle>
                  <CardDescription className="text-gray-400">
                    Última actualización: {formatDate(new Date().toISOString())}
                  </CardDescription>
                </div>
              </div>
              <Badge 
                className={`px-3 py-1 ${getStatusColorClass(getSystemOverallStatus())}`}
              >
                {getStatusLabel(getSystemOverallStatus())}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-gray-400 text-sm">CPU</h3>
                  <Badge variant="outline" className="text-gray-400 border-gray-600">
                    {metrics.cpuUsage}%
                  </Badge>
                </div>
                <Progress 
                  value={metrics.cpuUsage} 
                  className="h-2 bg-gray-700" 
                  indicatorClassName={metrics.cpuUsage > 80 ? 'bg-red-500' : 'bg-green-500'} 
                />
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-gray-400 text-sm">Memoria</h3>
                  <Badge variant="outline" className="text-gray-400 border-gray-600">
                    {metrics.memoryUsage}%
                  </Badge>
                </div>
                <Progress 
                  value={metrics.memoryUsage} 
                  className="h-2 bg-gray-700" 
                  indicatorClassName={metrics.memoryUsage > 80 ? 'bg-red-500' : 'bg-green-500'} 
                />
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-gray-400 text-sm">Almacenamiento</h3>
                  <Badge variant="outline" className="text-gray-400 border-gray-600">
                    {metrics.diskUsage}%
                  </Badge>
                </div>
                <Progress 
                  value={metrics.diskUsage} 
                  className="h-2 bg-gray-700" 
                  indicatorClassName={metrics.diskUsage > 80 ? 'bg-red-500' : 'bg-green-500'} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-white">{metrics.apiCalls.toLocaleString()}</span>
                <span className="text-gray-400 text-sm mt-1">Llamadas API</span>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-white">{metrics.activeUsers}</span>
                <span className="text-gray-400 text-sm mt-1">Usuarios activos</span>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-white">{metrics.errorRate}%</span>
                <span className="text-gray-400 text-sm mt-1">Tasa de error</span>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-white">
                  {formatUptime(components.reduce((acc, curr) => acc + curr.uptime, 0) / components.length)}
                </span>
                <span className="text-gray-400 text-sm mt-1">Uptime medio</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de componentes */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-white">Componentes del Sistema</h2>
            <div className="space-y-4">
              {components.map((component) => (
                <Card 
                  key={component.id} 
                  className={`bg-gray-900 border-gray-800 hover:border-green-500 transition-colors cursor-pointer ${
                    selectedComponent?.id === component.id ? 'border-green-500' : ''
                  }`}
                  onClick={() => handleComponentSelect(component)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-md bg-gray-800 mr-3 text-${
                          component.status === 'operational' ? 'green' : 
                          component.status === 'degraded' ? 'yellow' : 
                          component.status === 'outage' ? 'red' : 'blue'
                        }-500`}>
                          {getComponentIcon(component.id)}
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{component.name}</h3>
                          <p className="text-sm text-gray-400">Uptime: {formatUptime(component.uptime)}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge className={`mb-1 ${getStatusColorClass(component.status)}`}>
                          {getStatusLabel(component.status)}
                        </Badge>
                        {component.responseTime && (
                          <span className={`text-xs ${
                            component.responseTime < 200 ? 'text-green-400' : 
                            component.responseTime < 500 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {component.responseTime} ms
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Detalles del componente */}
          <div className="lg:col-span-2">
            {selectedComponent ? (
              <Card className="bg-gray-900 border-gray-800 shadow-md">
                <CardHeader className="bg-gray-950 border-b border-gray-800">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-gray-800 mr-4 text-gray-300">
                        {getComponentIcon(selectedComponent.id, 6)}
                      </div>
                      <div>
                        <CardTitle className="text-white">{selectedComponent.name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          Última verificación: {formatDate(selectedComponent.lastChecked)}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge 
                      className={`px-3 py-1 ${getStatusColorClass(selectedComponent.status)}`}
                    >
                      {getStatusLabel(selectedComponent.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <Tabs defaultValue="overview">
                    <TabsList className="bg-gray-800">
                      <TabsTrigger value="overview">Vista general</TabsTrigger>
                      <TabsTrigger value="history">Historial</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="pt-6">
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Detalles</h3>
                        <div className="bg-gray-800 p-4 rounded-md text-white">
                          {selectedComponent.details || 'No hay detalles adicionales disponibles.'}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-800 p-4 rounded-md">
                          <div className="text-sm text-gray-400 mb-1">Uptime</div>
                          <div className="text-2xl font-bold text-white">{formatUptime(selectedComponent.uptime)}</div>
                        </div>
                        
                        {selectedComponent.responseTime && (
                          <div className="bg-gray-800 p-4 rounded-md">
                            <div className="text-sm text-gray-400 mb-1">Tiempo de respuesta</div>
                            <div className="text-2xl font-bold text-white">{selectedComponent.responseTime} ms</div>
                          </div>
                        )}
                        
                        <div className="bg-gray-800 p-4 rounded-md">
                          <div className="text-sm text-gray-400 mb-1">Estado</div>
                          <div className="flex items-center">
                            {getStatusIcon(selectedComponent.status, 5)}
                            <span className="ml-2 text-white">
                              {getStatusLabel(selectedComponent.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Acciones disponibles</h3>
                        <div className="space-y-2">
                          <Button 
                            variant="outline" 
                            className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-800"
                            onClick={() => {
                              logAdminActivity(`Requested detailed diagnostics for: ${selectedComponent.name}`);
                              toast({
                                title: "Diagnóstico solicitado",
                                description: `Se ha iniciado un diagnóstico detallado para ${selectedComponent.name}`,
                                variant: "default"
                              });
                            }}
                          >
                            <Maximize className="mr-2 h-4 w-4" />
                            Ejecutar diagnóstico detallado
                          </Button>
                          
                          {/* Las acciones de reinicio están deshabilitadas para Admin Manager */}
                          <Button 
                            variant="outline" 
                            className="w-full justify-start border-gray-700 text-gray-500 hover:bg-transparent cursor-not-allowed"
                            disabled={true}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reiniciar componente
                            <span className="ml-auto text-xs bg-gray-800 px-1 rounded">
                              Restringido
                            </span>
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="history" className="pt-6">
                      <h3 className="text-sm font-medium text-gray-400 mb-4">Historial de estado (últimas 24 horas)</h3>
                      <div className="space-y-3">
                        {statusHistory.map((history, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded-md">
                            <div className="flex items-center">
                              {getStatusIcon(history.status, 4)}
                              <span className="ml-2 text-white">
                                {getStatusLabel(history.status)}
                              </span>
                            </div>
                            <div className="text-sm text-gray-400">
                              <Clock className="inline-block h-3 w-3 mr-1" />
                              {formatDate(history.date)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="bg-gray-950 border-t border-gray-800">
                  <div className="w-full flex justify-between items-center text-sm text-gray-400">
                    <div>ID: {selectedComponent.id}</div>
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-gray-400 hover:text-white"
                        onClick={() => {
                          logAdminActivity(`Generated report for component: ${selectedComponent.name}`);
                          toast({
                            title: "Reporte generado",
                            description: `El reporte para ${selectedComponent.name} ha sido enviado a los administradores`,
                            variant: "default"
                          });
                        }}
                      >
                        Generar reporte
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ) : (
              <Card className="bg-gray-900 border-gray-800 shadow-md">
                <CardContent className="p-12 text-center">
                  <ShieldCheck className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Verificación de Integridad del Sistema</h3>
                  <p className="text-gray-400 mb-6">
                    Selecciona un componente para ver los detalles de su estado y opciones de diagnóstico
                  </p>
                  <p className="text-gray-500 text-sm">
                    Como Admin Manager, puedes monitorear el estado del sistema y ejecutar diagnósticos,
                    pero no puedes reiniciar servicios ni modificar configuraciones críticas.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
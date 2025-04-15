import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { 
  AlertTriangle, 
  BarChart4, 
  CreditCard, 
  Database, 
  Globe, 
  Layers, 
  LogOut, 
  Settings, 
  Shield, 
  Users 
} from 'lucide-react';

// Componente para el sidebar
const Sidebar = ({ activeTab, setActiveTab }: { 
  activeTab: string, 
  setActiveTab: (tab: string) => void 
}) => {
  const [, navigate] = useLocation();
  
  const handleLogout = () => {
    // Lógica de logout
    fetch('/api/superadmin/logout', {
      method: 'POST',
    }).then(() => {
      navigate('/superadmin');
    });
  };
  
  return (
    <div className="w-64 bg-black border-r border-green-900 h-screen p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <Shield className="h-6 w-6 text-green-500" />
        <h1 className="text-xl font-bold text-green-500">Super Admin</h1>
      </div>
      
      <div className="flex flex-col gap-1 flex-grow">
        <Button
          variant={activeTab === 'analytics' ? 'default' : 'ghost'}
          className={activeTab === 'analytics' ? 'bg-green-500 text-black' : 'text-gray-400 hover:text-white hover:bg-green-950'}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart4 className="mr-2 h-5 w-5" />
          Analytics
        </Button>
        
        <Button
          variant={activeTab === 'finances' ? 'default' : 'ghost'}
          className={activeTab === 'finances' ? 'bg-green-500 text-black' : 'text-gray-400 hover:text-white hover:bg-green-950'}
          onClick={() => setActiveTab('finances')}
        >
          <CreditCard className="mr-2 h-5 w-5" />
          Finanzas
        </Button>
        
        <Button
          variant={activeTab === 'config' ? 'default' : 'ghost'}
          className={activeTab === 'config' ? 'bg-green-500 text-black' : 'text-gray-400 hover:text-white hover:bg-green-950'}
          onClick={() => setActiveTab('config')}
        >
          <Settings className="mr-2 h-5 w-5" />
          Configuración
        </Button>
        
        <Button
          variant={activeTab === 'membership' ? 'default' : 'ghost'}
          className={activeTab === 'membership' ? 'bg-green-500 text-black' : 'text-gray-400 hover:text-white hover:bg-green-950'}
          onClick={() => setActiveTab('membership')}
        >
          <Users className="mr-2 h-5 w-5" />
          Membresías
        </Button>
        
        <Button
          variant={activeTab === 'agents' ? 'default' : 'ghost'}
          className={activeTab === 'agents' ? 'bg-green-500 text-black' : 'text-gray-400 hover:text-white hover:bg-green-950'}
          onClick={() => setActiveTab('agents')}
        >
          <Globe className="mr-2 h-5 w-5" />
          Agentes
        </Button>
        
        <Button
          variant={activeTab === 'clients' ? 'default' : 'ghost'}
          className={activeTab === 'clients' ? 'bg-green-500 text-black' : 'text-gray-400 hover:text-white hover:bg-green-950'}
          onClick={() => setActiveTab('clients')}
        >
          <Database className="mr-2 h-5 w-5" />
          Clientes
        </Button>
        
        <Button
          variant={activeTab === 'alerts' ? 'default' : 'ghost'}
          className={activeTab === 'alerts' ? 'bg-green-500 text-black' : 'text-gray-400 hover:text-white hover:bg-green-950'}
          onClick={() => setActiveTab('alerts')}
        >
          <AlertTriangle className="mr-2 h-5 w-5" />
          Alertas
        </Button>
      </div>
      
      <Button
        variant="outline"
        className="mt-auto border-red-500 text-red-500 hover:bg-red-950 hover:text-red-400"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-5 w-5" />
        Cerrar Sesión
      </Button>
    </div>
  );
};

// Componente para Analíticas
const AnalyticsPanel = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-black border-green-900">
        <CardHeader>
          <CardTitle className="text-lg text-green-500">Usuarios Activos</CardTitle>
          <CardDescription className="text-gray-400">Últimos 30 días</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-60 flex items-center justify-center">
            <p className="text-5xl font-bold text-white">1,245</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-black border-green-900">
        <CardHeader>
          <CardTitle className="text-lg text-green-500">Tasa de Crecimiento</CardTitle>
          <CardDescription className="text-gray-400">Comparación mensual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-60 flex items-center justify-center">
            <p className="text-5xl font-bold text-green-500">+18%</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-black border-green-900 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg text-green-500">Distribución por Plataforma</CardTitle>
          <CardDescription className="text-gray-400">Todos los usuarios activos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-60 flex items-center justify-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold text-white">45%</p>
                <p className="text-sm text-gray-400">Fitness AI</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold text-white">28%</p>
                <p className="text-sm text-gray-400">CryptoBot</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold text-white">15%</p>
                <p className="text-sm text-gray-400">Sports AI</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold text-white">12%</p>
                <p className="text-sm text-gray-400">Otros</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Componente para Finanzas
const FinancesPanel = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-black border-green-900">
        <CardHeader>
          <CardTitle className="text-lg text-green-500">Ingresos Totales</CardTitle>
          <CardDescription className="text-gray-400">Últimos 30 días</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <p className="text-3xl font-bold text-white">$28,695</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-black border-green-900">
        <CardHeader>
          <CardTitle className="text-lg text-green-500">Stripe</CardTitle>
          <CardDescription className="text-gray-400">Procesamiento de pagos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <p className="text-3xl font-bold text-white">$21,540</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-black border-green-900">
        <CardHeader>
          <CardTitle className="text-lg text-green-500">PayPal</CardTitle>
          <CardDescription className="text-gray-400">Procesamiento de pagos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <p className="text-3xl font-bold text-white">$7,155</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-black border-green-900 md:col-span-3">
        <CardHeader>
          <CardTitle className="text-lg text-green-500">Ingresos por Aplicación</CardTitle>
          <CardDescription className="text-gray-400">Desglose de ingresos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-60 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-400">Fitness AI</p>
              <div className="flex-1 mx-4">
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <p className="text-white font-semibold">$18,652</p>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-gray-400">CryptoBot</p>
              <div className="flex-1 mx-4">
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
              <p className="text-white font-semibold">$5,739</p>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-gray-400">Sports AI</p>
              <div className="flex-1 mx-4">
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
              <p className="text-white font-semibold">$2,870</p>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-gray-400">Otros</p>
              <div className="flex-1 mx-4">
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '5%' }}></div>
                </div>
              </div>
              <p className="text-white font-semibold">$1,434</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Dashboard principal
const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  
  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-green-500">
            Panel Super Admin
          </h1>
          <p className="text-gray-400">
            Bienvenida, Capitana. Gestiona todas las plataformas desde este panel centralizado.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="analytics" className="mt-0">
            <AnalyticsPanel />
          </TabsContent>
          
          <TabsContent value="finances" className="mt-0">
            <FinancesPanel />
          </TabsContent>
          
          <TabsContent value="config" className="mt-0">
            <div className="bg-green-950/30 rounded-lg p-6 border border-green-900">
              <h2 className="text-xl text-green-500 mb-4">Configuración del Sistema</h2>
              <p className="text-gray-400">
                Esta sección permitirá configurar aspectos globales de todas las plataformas.
                Próximamente disponible.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="membership" className="mt-0">
            <div className="bg-green-950/30 rounded-lg p-6 border border-green-900">
              <h2 className="text-xl text-green-500 mb-4">Panel de Membresías</h2>
              <p className="text-gray-400">
                Esta sección permitirá gestionar los planes de membresía de todas las plataformas.
                Próximamente disponible.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="agents" className="mt-0">
            <div className="bg-green-950/30 rounded-lg p-6 border border-green-900">
              <h2 className="text-xl text-green-500 mb-4">Configuración de Agentes</h2>
              <p className="text-gray-400">
                Esta sección permitirá gestionar todos los agentes desplegados.
                Próximamente disponible.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="clients" className="mt-0">
            <div className="bg-green-950/30 rounded-lg p-6 border border-green-900">
              <h2 className="text-xl text-green-500 mb-4">Base de Datos de Clientes</h2>
              <p className="text-gray-400">
                Esta sección mostrará la base de datos completa de clientes.
                Próximamente disponible.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="alerts" className="mt-0">
            <div className="bg-green-950/30 rounded-lg p-6 border border-green-900">
              <h2 className="text-xl text-green-500 mb-4">Centro de Alertas e Incidentes</h2>
              <p className="text-gray-400">
                Esta sección mostrará alertas y errores del sistema.
                Próximamente disponible.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
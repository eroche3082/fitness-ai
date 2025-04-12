import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";
import { RefreshCw, CheckCircle, AlertCircle, CloudOff } from "lucide-react";

interface ApiStatus {
  name: string;
  status: 'active' | 'inactive' | 'error';
  description: string;
  errorMessage?: string;
}

interface ApiStatusResponse {
  status: string;
  timestamp: string;
  apiKey: string;
  apis: ApiStatus[];
}

export default function ApiStatusPanel() {
  const [apiStatus, setApiStatus] = useState<ApiStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApiStatus = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRequest<ApiStatusResponse>('/api/api-status');
      setApiStatus(response);
    } catch (err) {
      setError('Error al obtener el estado de las APIs. Por favor, intenta de nuevo.');
      console.error('Error fetching API status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeApis = async () => {
    setIsInitializing(true);
    setError(null);
    try {
      await apiRequest('/api/initialize-apis', {
        method: 'POST'
      });
      // After initialization, fetch the updated status
      await fetchApiStatus();
    } catch (err) {
      setError('Error al inicializar las APIs. Por favor, intenta de nuevo.');
      console.error('Error initializing APIs:', err);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    fetchApiStatus();
  }, []);

  const testGemini = async () => {
    try {
      const response = await apiRequest('/api/test-gemini', {
        method: 'POST',
        body: JSON.stringify({
          prompt: "Dame un consejo de fitness en 30 palabras."
        })
      });
      
      alert(`Respuesta de Gemini: ${response.response}`);
    } catch (err) {
      alert('Error al probar Gemini API. Por favor, intenta de nuevo.');
      console.error('Error testing Gemini:', err);
    }
  };

  const apiGroups = {
    'AI y ML': ['Gemini AI', 'Vision AI', 'Vertex AI'],
    'Habla y Lenguaje': ['Speech-to-Text', 'Text-to-Speech', 'Translation', 'Natural Language'],
    'Datos y Almacenamiento': ['Firestore', 'Cloud Storage', 'BigQuery'],
    'Servicios de Ubicación': ['Maps', 'Geocoding', 'Places'],
    'Análisis de Media': ['Video Intelligence'],
    'Seguridad': ['DLP', 'Secret Manager', 'Identity'],
    'Otras APIs': ['Dialogflow', 'Monitoring', 'Cloud Functions']
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Activo</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactivo</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'inactive':
        return <CloudOff className="h-5 w-5 text-gray-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Estado de las APIs de Google Cloud</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchApiStatus} 
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </CardTitle>
        <CardDescription>
          Monitor del estado de las APIs necesarias para Fitness AI
        </CardDescription>
        {apiStatus && (
          <div className="text-sm text-muted-foreground">
            Última actualización: {new Date(apiStatus.timestamp).toLocaleString()}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {apiStatus?.apiKey === 'Not Configured' && (
          <Alert className="mb-4">
            <AlertTitle>API Key no configurada</AlertTitle>
            <AlertDescription>
              La clave de API de Google Cloud no está configurada. Algunas funciones pueden no estar disponibles.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="AI y ML">
          <TabsList className="mb-4 flex overflow-x-auto">
            {Object.keys(apiGroups).map(group => (
              <TabsTrigger key={group} value={group} className="whitespace-nowrap">
                {group}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(apiGroups).map(([group, apiNames]) => (
            <TabsContent key={group} value={group} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {apiStatus?.apis
                  .filter(api => apiNames.includes(api.name))
                  .map(api => (
                    <Card key={api.name} className="overflow-hidden">
                      <CardHeader className="flex flex-row items-center justify-between py-2">
                        <CardTitle className="text-sm font-medium">{api.name}</CardTitle>
                        {getStatusBadge(api.status)}
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="flex items-start space-x-2">
                          {getStatusIcon(api.status)}
                          <p className="text-xs text-muted-foreground">
                            {api.description}
                          </p>
                        </div>
                        {api.errorMessage && (
                          <p className="text-xs text-red-500 mt-1">{api.errorMessage}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2 sm:flex-row sm:justify-between">
        <Button
          onClick={initializeApis}
          disabled={isInitializing}
          className="w-full sm:w-auto"
        >
          {isInitializing ? 'Inicializando...' : 'Inicializar todas las APIs'}
        </Button>
        <Button
          variant="secondary"
          onClick={testGemini}
          className="w-full sm:w-auto"
        >
          Probar Gemini AI
        </Button>
      </CardFooter>
    </Card>
  );
}
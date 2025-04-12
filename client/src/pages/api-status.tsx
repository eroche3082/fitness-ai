import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ApiStatusPanel from "@/components/ApiStatusPanel";
import Header from "@/components/Header";

export default function ApiStatusPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard de APIs</h2>
            <p className="text-muted-foreground">
              Monitorea y gestiona todas las APIs utilizadas en Fitness AI
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            Plataforma versión 1.0
          </Badge>
        </div>

        <Tabs defaultValue="status" className="space-y-4">
          <TabsList>
            <TabsTrigger value="status">Estado</TabsTrigger>
            <TabsTrigger value="documentation">Documentación</TabsTrigger>
            <TabsTrigger value="configuration">Configuración</TabsTrigger>
          </TabsList>
          
          <TabsContent value="status" className="space-y-4">
            <ApiStatusPanel />
          </TabsContent>
          
          <TabsContent value="documentation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Documentación de APIs</CardTitle>
                <CardDescription>
                  Información detallada sobre las APIs utilizadas en Fitness AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Gemini AI</h3>
                  <p className="text-sm text-muted-foreground">
                    Gemini AI se utiliza para proporcionar recomendaciones personalizadas de entrenamiento,
                    análisis nutricional y responder preguntas relacionadas con fitness. La API está
                    configurada para utilizar el modelo Gemini 1.5 Flash para una respuesta rápida.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Vision AI</h3>
                  <p className="text-sm text-muted-foreground">
                    Vision AI analiza imágenes de posturas de ejercicios para proporcionar correcciones
                    de forma. Detecta la posición corporal y compara con posiciones ideales para cada ejercicio.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Speech-to-Text & Text-to-Speech</h3>
                  <p className="text-sm text-muted-foreground">
                    Estas APIs permiten la interacción por voz con el entrenador virtual. El usuario puede
                    dar comandos de voz durante el entrenamiento y recibir instrucciones habladas en respuesta.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Fitness API</h3>
                  <p className="text-sm text-muted-foreground">
                    La API de Fitness de Google permite acceder y sincronizar datos de actividad física
                    del usuario, incluyendo pasos, distancia recorrida, calorías quemadas y ritmo cardíaco.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="configuration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de APIs</CardTitle>
                <CardDescription>
                  Gestiona las credenciales y los ajustes de las APIs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  La configuración de las APIs se realiza a través de variables de entorno seguras.
                  Contacta con el administrador del sistema para actualizar las credenciales.
                </p>
                
                <div className="rounded-md bg-muted p-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Google API Key</span>
                      <Badge variant="outline">Configurado</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Firebase Configuration</span>
                      <Badge variant="outline">Pendiente</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">OAuth Credentials</span>
                      <Badge variant="outline">Pendiente</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
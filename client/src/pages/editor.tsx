import React, { useState, useEffect } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import PreviewPanel from '../components/editor/PreviewPanel';
import ImageUploader from '../components/editor/ImageUploader';
import ColorPicker from '../components/editor/ColorPicker';
import FontSelector from '../components/editor/FontSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, SaveIcon, CheckCircle, Smartphone, Tablet, Monitor, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

const EditorPage: React.FC = () => {
  const { config, isLoading, error, updateSiteConfig } = useConfig();
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [localConfig, setLocalConfig] = useState(config);
  const { toast } = useToast();

  // Actualizar la configuración local cuando se carga el config
  useEffect(() => {
    if (config) {
      setLocalConfig(config);
    }
  }, [config]);

  // Si no hay configuración todavía, mostrar pantalla de carga
  if (isLoading || !localConfig) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-green-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white">Cargando editor...</h2>
          <p className="text-gray-400">Obteniendo la configuración actual</p>
        </div>
      </div>
    );
  }

  // Si hay un error, mostrar mensaje
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-gray-900 rounded-lg">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h2 className="text-xl font-bold text-white mb-2">Error al cargar el editor</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-700"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  // Manejar cambios en los campos de configuración
  const handleConfigChange = (path: string, value: any) => {
    setLocalConfig((prevConfig) => {
      // Copia profunda del objeto para evitar modificaciones directas
      const newConfig = JSON.parse(JSON.stringify(prevConfig));
      
      // Dividir la ruta por puntos para acceder a propiedades anidadas
      const pathParts = path.split('.');
      let current = newConfig;
      
      // Navegar por el objeto hasta la penúltima parte de la ruta
      for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]];
      }
      
      // Actualizar la propiedad final con el nuevo valor
      current[pathParts[pathParts.length - 1]] = value;
      
      return newConfig;
    });
  };

  // Guardar la configuración
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      await updateSiteConfig(localConfig);
      setSaveSuccess(true);
      
      toast({
        title: "Configuración guardada",
        description: "Los cambios se han aplicado correctamente.",
        variant: "default",
      });
      
      // Reiniciar el estado de éxito después de 3 segundos
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error al guardar:', err);
      
      toast({
        title: "Error al guardar",
        description: "No se pudieron guardar los cambios. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header del editor */}
      <header className="border-b border-gray-800 bg-gray-900 py-4">
        <div className="container max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Editor Visual - Fitness AI</h1>
            <p className="text-gray-400 text-sm">Personaliza el aspecto y contenido de tu sitio</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Selector de dispositivo para la vista previa */}
            <div className="flex items-center border border-gray-700 rounded-md p-1 bg-gray-800">
              <Button
                size="sm"
                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                onClick={() => setPreviewMode('mobile')}
                className={previewMode === 'mobile' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                onClick={() => setPreviewMode('tablet')}
                className={previewMode === 'tablet' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                onClick={() => setPreviewMode('desktop')}
                className={previewMode === 'desktop' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                <Monitor className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Botón de guardar */}
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  ¡Guardado!
                </>
              ) : (
                <>
                  <SaveIcon className="h-4 w-4 mr-2" />
                  Guardar cambios
                </>
              )}
            </Button>
          </div>
        </div>
      </header>
      
      {/* Contenido principal */}
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Panel de configuración */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="appearance" className="w-full">
              <TabsList className="w-full bg-gray-900 border border-gray-800">
                <TabsTrigger value="appearance" className="data-[state=active]:bg-green-600">
                  Apariencia
                </TabsTrigger>
                <TabsTrigger value="content" className="data-[state=active]:bg-green-600">
                  Contenido
                </TabsTrigger>
                <TabsTrigger value="sections" className="data-[state=active]:bg-green-600">
                  Secciones
                </TabsTrigger>
              </TabsList>
              
              {/* Pestaña de apariencia */}
              <TabsContent value="appearance" className="space-y-4 mt-4">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle>Tema y colores</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="primary-color">Color principal</Label>
                      <ColorPicker
                        color={localConfig.primary_color}
                        onChange={(color) => handleConfigChange('primary_color', color)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <FontSelector
                        value={localConfig.font_family}
                        onChange={(font) => handleConfigChange('font_family', font)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="layout" className="mb-2 block">Tema</Label>
                      <Select
                        value={localConfig.layout}
                        onValueChange={(value) => handleConfigChange('layout', value)}
                      >
                        <SelectTrigger id="layout" className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Seleccionar tema" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="dark">Oscuro</SelectItem>
                          <SelectItem value="light">Claro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="button-shape" className="mb-2 block">Forma de botones</Label>
                      <Select
                        value={localConfig.button_shape}
                        onValueChange={(value) => handleConfigChange('button_shape', value)}
                      >
                        <SelectTrigger id="button-shape" className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Seleccionar forma" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="rounded">Redondeado</SelectItem>
                          <SelectItem value="squared">Cuadrado</SelectItem>
                          <SelectItem value="pill">Píldora</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle>Imágenes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImageUploader
                      currentImageUrl={localConfig.hero_image_url}
                      onImageUpload={(url) => handleConfigChange('hero_image_url', url)}
                      section="hero"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Pestaña de contenido */}
              <TabsContent value="content" className="space-y-4 mt-4">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle>Textos principales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="homepage-title">Título de la página</Label>
                      <Input
                        id="homepage-title"
                        value={localConfig.homepage_title}
                        onChange={(e) => handleConfigChange('homepage_title', e.target.value)}
                        className="mt-1 bg-gray-800 border-gray-700"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="homepage-subtitle">Subtítulo</Label>
                      <Textarea
                        id="homepage-subtitle"
                        value={localConfig.homepage_subtitle}
                        onChange={(e) => handleConfigChange('homepage_subtitle', e.target.value)}
                        className="mt-1 bg-gray-800 border-gray-700"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cta-text">Texto del botón principal</Label>
                      <Input
                        id="cta-text"
                        value={localConfig.cta_text}
                        onChange={(e) => handleConfigChange('cta_text', e.target.value)}
                        className="mt-1 bg-gray-800 border-gray-700"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle>Menú de navegación</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="header-menu" className="mb-2 block">
                        Items del menú
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-2 inline-block text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 border-gray-700">
                              <p>Separa cada item del menú con una coma</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="header-menu"
                        value={localConfig.header_menu.join(', ')}
                        onChange={(e) => {
                          const menuItems = e.target.value.split(',').map(item => item.trim());
                          handleConfigChange('header_menu', menuItems);
                        }}
                        className="bg-gray-800 border-gray-700"
                        placeholder="Inicio, Programas, Planes, ..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Pestaña de secciones */}
              <TabsContent value="sections" className="space-y-4 mt-4">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle>Visibilidad de secciones</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-features" className="cursor-pointer">
                        Mostrar sección de características
                      </Label>
                      <Switch
                        id="show-features"
                        checked={localConfig.visible_sections.features}
                        onCheckedChange={(checked) => handleConfigChange('visible_sections.features', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-pricing" className="cursor-pointer">
                        Mostrar sección de precios
                      </Label>
                      <Switch
                        id="show-pricing"
                        checked={localConfig.visible_sections.pricing}
                        onCheckedChange={(checked) => handleConfigChange('visible_sections.pricing', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-plans" className="cursor-pointer">
                        Mostrar sección de planes
                      </Label>
                      <Switch
                        id="show-plans"
                        checked={localConfig.visible_sections.plans}
                        onCheckedChange={(checked) => handleConfigChange('visible_sections.plans', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-chat" className="cursor-pointer">
                        Mostrar chatbot
                      </Label>
                      <Switch
                        id="show-chat"
                        checked={localConfig.visible_sections.chat}
                        onCheckedChange={(checked) => handleConfigChange('visible_sections.chat', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle>Metadatos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>
                        <strong>Última actualización:</strong>{' '}
                        {new Date(localConfig.last_updated.date).toLocaleString()}
                      </p>
                      <p>
                        <strong>Por:</strong> {localConfig.last_updated.by}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Panel de vista previa */}
          <div className="lg:col-span-3">
            <div className="sticky top-4">
              <h2 className="text-xl font-bold mb-4">Vista previa</h2>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                <PreviewPanel config={localConfig} previewMode={previewMode} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditorPage;
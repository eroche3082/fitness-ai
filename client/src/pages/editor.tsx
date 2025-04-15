import React, { useState, useEffect } from 'react';
import { useConfig } from '@/contexts/ConfigContext';
import PreviewPanel from '../components/editor/PreviewPanel';
import ImageUploader from '../components/editor/ImageUploader';
import ColorPicker from '../components/editor/ColorPicker';
import FontSelector from '../components/editor/FontSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Settings, Eye, Palette, Type, Layout, Shapes, Image, Globe, Menu, Check, Save, RefreshCw } from 'lucide-react';
import { useAuth } from '../App';

export default function EditorPage() {
  const { config, isLoading, error, updateConfig, reloadConfig } = useConfig();
  const { toast } = useToast();
  const { userRole, isAuthenticated } = useAuth();
  
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  
  // Verificar permisos del usuario
  const hasEditPermission = isAuthenticated && (userRole === 'admin' || userRole === 'manager');
  
  // Redirigir o mostrar error si no tiene permisos
  if (!hasEditPermission) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Card className="w-[450px] bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Acceso Restringido</CardTitle>
            <CardDescription className="text-gray-400">
              Necesitas permisos de administrador para acceder al editor visual.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-400">
              Este módulo está disponible solo para administradores y managers del sistema.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="default" onClick={() => window.location.href = '/'}>
              Volver al Inicio
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Mostrar estado de carga
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-green-500 animate-pulse text-lg">Cargando editor...</div>
      </div>
    );
  }
  
  // Mostrar error si ocurre
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Card className="w-[450px] bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-red-400">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No se pudo cargar la configuración: {error.message}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => reloadConfig()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reintentar
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Si no hay configuración, mostrar mensaje
  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-red-500">No se pudo cargar la configuración</div>
      </div>
    );
  }
  
  // Manejar guardado de configuración
  const handleSaveChanges = async () => {
    if (!config) return;
    
    setIsSaving(true);
    try {
      await updateConfig(config);
      toast({
        title: "Cambios guardados",
        description: "La configuración se ha actualizado correctamente.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: error instanceof Error ? error.message : "Ha ocurrido un error inesperado",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Actualizar un valor específico de la configuración
  const updateConfigValue = (key: string, value: any) => {
    if (!config) return;
    
    const newConfig = { ...config };
    newConfig[key as keyof typeof newConfig] = value;
    
    updateConfig(newConfig);
  };
  
  // Actualizar visibilidad de secciones
  const toggleSectionVisibility = (section: string) => {
    if (!config) return;
    
    const newVisibleSections = {
      ...config.visible_sections,
      [section]: !config.visible_sections[section as keyof typeof config.visible_sections]
    };
    
    updateConfig({
      ...config,
      visible_sections: newVisibleSections
    });
  };
  
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">
            Editor Visual <span className="text-green-500">Fitness AI</span>
          </h1>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={reloadConfig}
              className="border-gray-700 text-white bg-transparent hover:bg-gray-800"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Recargar
            </Button>
            
            <Button 
              variant="default" 
              size="sm"
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Panel de edición */}
          <div className="lg:col-span-5 space-y-6">
            <Tabs defaultValue="contenido" className="w-full">
              <TabsList className="w-full bg-gray-800">
                <TabsTrigger 
                  value="contenido" 
                  className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                >
                  <Type className="h-4 w-4 mr-2" />
                  Contenido
                </TabsTrigger>
                <TabsTrigger 
                  value="apariencia"
                  className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Apariencia
                </TabsTrigger>
                <TabsTrigger 
                  value="secciones"
                  className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                >
                  <Layout className="h-4 w-4 mr-2" />
                  Secciones
                </TabsTrigger>
                <TabsTrigger 
                  value="media"
                  className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                >
                  <Image className="h-4 w-4 mr-2" />
                  Media
                </TabsTrigger>
              </TabsList>
              
              {/* Tab de contenido */}
              <TabsContent value="contenido" className="p-4 bg-gray-900 rounded-md mt-3 border border-gray-800">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="homepage_title" className="text-white">Título Principal</Label>
                    <Input
                      id="homepage_title"
                      value={config.homepage_title}
                      onChange={(e) => updateConfigValue('homepage_title', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="homepage_subtitle" className="text-white">Subtítulo</Label>
                    <Textarea
                      id="homepage_subtitle"
                      value={config.homepage_subtitle}
                      onChange={(e) => updateConfigValue('homepage_subtitle', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cta_text" className="text-white">Texto de Botón CTA</Label>
                    <Input
                      id="cta_text"
                      value={config.cta_text}
                      onChange={(e) => updateConfigValue('cta_text', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="header_menu" className="text-white">Menú de Navegación</Label>
                    <div className="text-xs text-gray-400 mb-2">
                      Separar elementos por comas (p.ej.: Inicio,Planes,Contacto)
                    </div>
                    <Input
                      id="header_menu"
                      value={config.header_menu.join(',')}
                      onChange={(e) => updateConfigValue('header_menu', e.target.value.split(','))}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* Tab de apariencia */}
              <TabsContent value="apariencia" className="p-4 bg-gray-900 rounded-md mt-3 border border-gray-800">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white mb-2 block">Color Primario</Label>
                    <ColorPicker
                      color={config.primary_color}
                      onChange={(color) => updateConfigValue('primary_color', color)}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2 block">Fuente Principal</Label>
                    <FontSelector
                      value={config.font_family}
                      onChange={(font) => updateConfigValue('font_family', font)}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2 block">Forma de Botones</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {['rounded', 'pill', 'square'].map((shape) => (
                        <Button
                          key={shape}
                          type="button"
                          variant="outline"
                          className={`
                            border-gray-700 
                            ${config.button_shape === shape ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300'} 
                            ${shape === 'rounded' ? 'rounded-md' : shape === 'pill' ? 'rounded-full' : 'rounded-none'}
                          `}
                          onClick={() => updateConfigValue('button_shape', shape)}
                        >
                          <Shapes className="h-4 w-4 mr-2" />
                          {shape === 'rounded' ? 'Redondeado' : shape === 'pill' ? 'Píldora' : 'Cuadrado'}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2 block">Tema</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {['dark', 'light'].map((theme) => (
                        <Button
                          key={theme}
                          type="button"
                          variant="outline"
                          className={`
                            ${config.layout === theme ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300'}
                            border-gray-700
                          `}
                          onClick={() => updateConfigValue('layout', theme)}
                        >
                          {theme === 'dark' ? (
                            <>
                              <Settings className="h-4 w-4 mr-2" />
                              Oscuro
                            </>
                          ) : (
                            <>
                              <Globe className="h-4 w-4 mr-2" />
                              Claro
                            </>
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Tab de secciones */}
              <TabsContent value="secciones" className="p-4 bg-gray-900 rounded-md mt-3 border border-gray-800">
                <div className="space-y-4">
                  <Label className="text-white mb-2 block">Visibilidad de Secciones</Label>
                  
                  {Object.entries(config.visible_sections).map(([section, isVisible]) => (
                    <div key={section} className="flex items-center justify-between py-2 border-b border-gray-800">
                      <div className="flex items-center">
                        <Layout className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-white capitalize">
                          {section === 'hero' ? 'Banner Principal' : 
                          section === 'features' ? 'Características' :
                          section === 'pricing' ? 'Precios' :
                          section === 'plans' ? 'Planes' :
                          section === 'testimonials' ? 'Testimonios' : 
                          section === 'chat' ? 'Chat Widget' : 
                          section === 'footer' ? 'Pie de Página' : section}
                        </span>
                      </div>
                      <Switch
                        checked={isVisible}
                        onCheckedChange={() => toggleSectionVisibility(section)}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              {/* Tab de media */}
              <TabsContent value="media" className="p-4 bg-gray-900 rounded-md mt-3 border border-gray-800">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white mb-2 block">Imagen de Banner Principal</Label>
                    <ImageUploader
                      currentImageUrl={config.hero_image_url}
                      onImageSelected={(url) => updateConfigValue('hero_image_url', url)}
                      className="h-40"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2 block">Logo</Label>
                    <ImageUploader
                      currentImageUrl={config.logo_url}
                      onImageSelected={(url) => updateConfigValue('logo_url', url)}
                      className="h-24"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Información adicional */}
            <Card className="bg-gray-900 border-gray-800 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Settings className="h-4 w-4 mr-2 text-green-500" />
                  Información de la Configuración
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-gray-400">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Última actualización:</span>
                    <span>{new Date(config.last_updated).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Actualizado por:</span>
                    <span>{config.updated_by}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Panel de vista previa */}
          <div className="lg:col-span-7">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-medium text-white">Vista Previa</h2>
              
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                  className={`border-gray-700 ${previewMode === 'desktop' ? 'bg-gray-700 text-white' : 'bg-transparent text-gray-400'}`}
                >
                  <Globe className="h-4 w-4" />
                  <span className="sr-only">Desktop</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode('tablet')}
                  className={`border-gray-700 ${previewMode === 'tablet' ? 'bg-gray-700 text-white' : 'bg-transparent text-gray-400'}`}
                >
                  <Shapes className="h-4 w-4" />
                  <span className="sr-only">Tablet</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                  className={`border-gray-700 ${previewMode === 'mobile' ? 'bg-gray-700 text-white' : 'bg-transparent text-gray-400'}`}
                >
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Mobile</span>
                </Button>
              </div>
            </div>
            
            {/* Contenedor para la vista previa con diferentes tamaños según el modo */}
            <div className={`
              relative overflow-hidden rounded-lg border border-gray-800
              ${previewMode === 'desktop' ? 'w-full' : previewMode === 'tablet' ? 'max-w-[768px] mx-auto' : 'max-w-[375px] mx-auto'}
              h-[600px]
            `}>
              <PreviewPanel 
                config={config} 
                previewMode={previewMode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
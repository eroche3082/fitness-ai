import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../App';
import { useConfig } from '../contexts/ConfigContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Check, Save, Eye, EyeOff, RefreshCw, Globe, Layout, Palette, Type } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import PreviewPanel from '../components/editor/PreviewPanel';
import ImageUploader from '../components/editor/ImageUploader';
import ColorPicker from '../components/editor/ColorPicker';
import FontSelector from '../components/editor/FontSelector';

export default function EditorPage() {
  const { userRole } = useAuth();
  const [, setLocation] = useLocation();
  const { config, isLoading, error, updateAppConfig, applyConfig } = useConfig();
  const { toast } = useToast();
  
  // Estado local para edición
  const [editedConfig, setEditedConfig] = useState(config);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [activeTab, setActiveTab] = useState('general');
  const [showPreview, setShowPreview] = useState(true);

  // Actualizar el estado local cuando cambia la configuración
  useEffect(() => {
    setEditedConfig(config);
  }, [config]);

  // Verificar permisos
  useEffect(() => {
    if (userRole !== 'admin' && userRole !== 'manager') {
      toast({
        title: 'Acceso restringido',
        description: 'No tienes permisos para acceder al editor visual.',
        variant: 'destructive'
      });
      setLocation('/');
    }
  }, [userRole, setLocation, toast]);

  // Maneja cambios en campos de texto
  const handleTextChange = (field: keyof typeof editedConfig, value: string) => {
    setEditedConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Maneja cambios en la visibilidad de secciones
  const handleSectionToggle = (section: keyof typeof editedConfig.visible_sections) => {
    setEditedConfig(prev => ({
      ...prev,
      visible_sections: {
        ...prev.visible_sections,
        [section]: !prev.visible_sections[section]
      }
    }));
  };

  // Maneja cambios en menú de encabezado
  const handleMenuChange = (value: string) => {
    const menuItems = value.split(',').map(item => item.trim());
    setEditedConfig(prev => ({
      ...prev,
      header_menu: menuItems
    }));
  };

  // Maneja cambios de color
  const handleColorChange = (color: string) => {
    setEditedConfig(prev => ({
      ...prev,
      primary_color: color
    }));
  };

  // Maneja cambios de fuente
  const handleFontChange = (font: string) => {
    setEditedConfig(prev => ({
      ...prev,
      font_family: font
    }));
  };

  // Maneja cambios de layout
  const handleLayoutChange = (layout: 'dark' | 'light') => {
    setEditedConfig(prev => ({
      ...prev,
      layout
    }));
  };

  // Maneja cambios en la forma de los botones
  const handleButtonShapeChange = (shape: 'rounded' | 'square' | 'pill') => {
    setEditedConfig(prev => ({
      ...prev,
      button_shape: shape
    }));
  };

  // Actualiza la URL de la imagen del héroe
  const handleHeroImageChange = (url: string) => {
    setEditedConfig(prev => ({
      ...prev,
      hero_image_url: url
    }));
  };

  // Actualiza la URL del logo
  const handleLogoChange = (url: string) => {
    setEditedConfig(prev => ({
      ...prev,
      logo_url: url
    }));
  };

  // Guardar los cambios
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateAppConfig(editedConfig);
      
      toast({
        title: 'Cambios guardados',
        description: 'Los cambios han sido guardados y aplicados correctamente.',
        variant: 'default'
      });
    } catch (err: any) {
      toast({
        title: 'Error al guardar',
        description: err.message || 'No se pudieron guardar los cambios.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Aplicar cambios solo para previsualización
  const handlePreview = () => {
    applyConfig(editedConfig);
    
    toast({
      title: 'Modo de vista previa',
      description: 'Los cambios han sido aplicados solo para previsualización. No olvides guardar.',
      variant: 'default'
    });
  };

  // Cancelar cambios
  const handleCancel = () => {
    setEditedConfig(config);
    
    toast({
      title: 'Cambios descartados',
      description: 'Se ha restaurado la configuración original.',
      variant: 'default'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-green-500 mx-auto" />
          <p className="mt-4 text-white">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-green-500">
            Editor Visual de Fitness AI
          </h1>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="text-white border-gray-700"
            >
              {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showPreview ? 'Ocultar Vista Previa' : 'Mostrar Vista Previa'}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setLocation('/')}
              className="bg-gray-800 hover:bg-gray-700"
            >
              <Globe className="h-4 w-4 mr-2" />
              Ver Sitio
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de Edición */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Configuración del Sitio</CardTitle>
                <CardDescription>
                  Edita y personaliza la apariencia y contenido de Fitness AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs 
                  defaultValue="general" 
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="mb-6 grid grid-cols-4 bg-gray-800">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="appearance">Apariencia</TabsTrigger>
                    <TabsTrigger value="sections">Secciones</TabsTrigger>
                    <TabsTrigger value="media">Imágenes</TabsTrigger>
                  </TabsList>

                  {/* Pestaña General */}
                  <TabsContent value="general" className="space-y-6">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="homepageTitle">Título Principal</Label>
                        <Input
                          id="homepageTitle"
                          value={editedConfig.homepage_title}
                          onChange={(e) => handleTextChange('homepage_title', e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="homepageSubtitle">Subtítulo</Label>
                        <Textarea
                          id="homepageSubtitle"
                          value={editedConfig.homepage_subtitle}
                          onChange={(e) => handleTextChange('homepage_subtitle', e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white"
                          rows={2}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ctaText">Texto del Botón CTA</Label>
                        <Input
                          id="ctaText"
                          value={editedConfig.cta_text}
                          onChange={(e) => handleTextChange('cta_text', e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="headerMenu">Menú de Navegación (separado por comas)</Label>
                        <Input
                          id="headerMenu"
                          value={editedConfig.header_menu.join(', ')}
                          onChange={(e) => handleMenuChange(e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                        <p className="text-xs text-gray-400">
                          Los elementos del menú aparecerán en el orden indicado
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Pestaña Apariencia */}
                  <TabsContent value="appearance" className="space-y-6">
                    <div className="grid gap-6">
                      <div className="space-y-2">
                        <Label>Color Primario</Label>
                        <div className="mb-4">
                          <ColorPicker
                            color={editedConfig.primary_color}
                            onChange={handleColorChange}
                          />
                        </div>
                      </div>
                      
                      <Separator className="bg-gray-700" />
                      
                      <div className="space-y-2">
                        <Label>Fuente Principal</Label>
                        <FontSelector
                          value={editedConfig.font_family}
                          onChange={handleFontChange}
                        />
                      </div>
                      
                      <Separator className="bg-gray-700" />
                      
                      <div className="space-y-2">
                        <Label>Esquema de Colores</Label>
                        <div className="flex space-x-4">
                          <div 
                            className={`p-4 border cursor-pointer ${
                              editedConfig.layout === 'dark' 
                                ? 'border-green-500' 
                                : 'border-gray-700'
                            }`}
                            onClick={() => handleLayoutChange('dark')}
                          >
                            <div className="h-24 w-40 bg-black border border-gray-700 flex items-center justify-center">
                              <div className="text-white bg-gray-900 p-2 w-32 text-center">
                                <div className="text-green-500 text-sm">Oscuro</div>
                              </div>
                            </div>
                          </div>
                          
                          <div 
                            className={`p-4 border cursor-pointer ${
                              editedConfig.layout === 'light' 
                                ? 'border-green-500' 
                                : 'border-gray-700'
                            }`}
                            onClick={() => handleLayoutChange('light')}
                          >
                            <div className="h-24 w-40 bg-white border border-gray-300 flex items-center justify-center">
                              <div className="text-black bg-gray-100 p-2 w-32 text-center">
                                <div className="text-green-600 text-sm">Claro</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="bg-gray-700" />
                      
                      <div className="space-y-2">
                        <Label>Forma de Botones</Label>
                        <div className="flex space-x-4">
                          <div 
                            className={`p-2 border cursor-pointer ${
                              editedConfig.button_shape === 'square' 
                                ? 'border-green-500' 
                                : 'border-gray-700'
                            }`}
                            onClick={() => handleButtonShapeChange('square')}
                          >
                            <div className="h-10 w-24 bg-green-500 text-center flex items-center justify-center text-white text-sm">
                              Cuadrado
                            </div>
                          </div>
                          
                          <div 
                            className={`p-2 border cursor-pointer ${
                              editedConfig.button_shape === 'rounded' 
                                ? 'border-green-500' 
                                : 'border-gray-700'
                            }`}
                            onClick={() => handleButtonShapeChange('rounded')}
                          >
                            <div className="h-10 w-24 bg-green-500 rounded-md text-center flex items-center justify-center text-white text-sm">
                              Redondeado
                            </div>
                          </div>
                          
                          <div 
                            className={`p-2 border cursor-pointer ${
                              editedConfig.button_shape === 'pill' 
                                ? 'border-green-500' 
                                : 'border-gray-700'
                            }`}
                            onClick={() => handleButtonShapeChange('pill')}
                          >
                            <div className="h-10 w-24 bg-green-500 rounded-full text-center flex items-center justify-center text-white text-sm">
                              Píldora
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Pestaña Secciones */}
                  <TabsContent value="sections" className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Visibilidad de Secciones</h3>
                      <p className="text-sm text-gray-400">
                        Controla qué secciones son visibles en la página principal
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="chatSection" className="text-base">Chat/Asistente</Label>
                            <p className="text-xs text-gray-400">Mostrar el widget de chatbot en la página</p>
                          </div>
                          <Switch
                            id="chatSection"
                            checked={editedConfig.visible_sections.chat}
                            onCheckedChange={() => handleSectionToggle('chat')}
                            className="data-[state=checked]:bg-green-500"
                          />
                        </div>
                        
                        <Separator className="bg-gray-700" />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="featuresSection" className="text-base">Características</Label>
                            <p className="text-xs text-gray-400">Mostrar sección de características y beneficios</p>
                          </div>
                          <Switch
                            id="featuresSection"
                            checked={editedConfig.visible_sections.features}
                            onCheckedChange={() => handleSectionToggle('features')}
                            className="data-[state=checked]:bg-green-500"
                          />
                        </div>
                        
                        <Separator className="bg-gray-700" />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="pricingSection" className="text-base">Precios</Label>
                            <p className="text-xs text-gray-400">Mostrar sección de precios y comparativa</p>
                          </div>
                          <Switch
                            id="pricingSection"
                            checked={editedConfig.visible_sections.pricing}
                            onCheckedChange={() => handleSectionToggle('pricing')}
                            className="data-[state=checked]:bg-green-500"
                          />
                        </div>
                        
                        <Separator className="bg-gray-700" />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="plansSection" className="text-base">Planes</Label>
                            <p className="text-xs text-gray-400">Mostrar sección de planes de entrenamiento</p>
                          </div>
                          <Switch
                            id="plansSection"
                            checked={editedConfig.visible_sections.plans}
                            onCheckedChange={() => handleSectionToggle('plans')}
                            className="data-[state=checked]:bg-green-500"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Pestaña Imágenes */}
                  <TabsContent value="media" className="space-y-6">
                    <div className="grid gap-6">
                      <div className="space-y-2">
                        <Label>Imagen de Cabecera (Hero)</Label>
                        <ImageUploader
                          currentImageUrl={editedConfig.hero_image_url || ''}
                          onImageSelected={handleHeroImageChange}
                          className="h-40"
                        />
                      </div>
                      
                      <Separator className="bg-gray-700" />
                      
                      <div className="space-y-2">
                        <Label>Logo</Label>
                        <ImageUploader
                          currentImageUrl={editedConfig.logo_url || ''}
                          onImageSelected={handleLogoChange}
                          className="h-24"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-gray-800 pt-6">
                <Button 
                  variant="outline"
                  onClick={handleCancel}
                  className="border-gray-700 text-white"
                >
                  Cancelar
                </Button>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline"
                    onClick={handlePreview}
                    className="border-green-500 text-green-500"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Previsualizar
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-green-500 text-white hover:bg-green-600"
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
              </CardFooter>
            </Card>
          </div>
          
          {/* Panel de Vista Previa */}
          {showPreview && (
            <div className="lg:col-span-1">
              <Card className="bg-gray-900 border-gray-800 sticky top-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex justify-between items-center">
                    <span>Vista Previa</span>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className={`px-2 py-1 h-8 ${previewMode === 'desktop' ? 'bg-gray-700' : 'bg-transparent'}`}
                        onClick={() => setPreviewMode('desktop')}
                      >
                        <Palette className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className={`px-2 py-1 h-8 ${previewMode === 'tablet' ? 'bg-gray-700' : 'bg-transparent'}`}
                        onClick={() => setPreviewMode('tablet')}
                      >
                        <Layout className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className={`px-2 py-1 h-8 ${previewMode === 'mobile' ? 'bg-gray-700' : 'bg-transparent'}`}
                        onClick={() => setPreviewMode('mobile')}
                      >
                        <Type className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`
                    overflow-hidden rounded-md border border-gray-700
                    ${previewMode === 'desktop' ? 'w-full' : ''}
                    ${previewMode === 'tablet' ? 'w-[768px] max-w-full mx-auto' : ''}
                    ${previewMode === 'mobile' ? 'w-[320px] max-w-full mx-auto' : ''}
                  `}>
                    <PreviewPanel config={editedConfig} previewMode={previewMode} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-sm text-gray-400">
          <p>
            <span className="font-semibold">Nota:</span> Los cambios se aplicarán inmediatamente a todos los usuarios activos después de guardar.
          </p>
          {userRole === 'admin' && (
            <p className="mt-2">
              <span className="text-green-500">•</span> Como Super Administrador, puedes editar todas las propiedades del sitio.
            </p>
          )}
          {userRole === 'manager' && (
            <p className="mt-2">
              <span className="text-green-500">•</span> Como Admin Manager, puedes editar la mayoría de las propiedades visuales.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
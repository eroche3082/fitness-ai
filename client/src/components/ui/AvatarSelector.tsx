import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Upload, X, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Tipo de avatar
interface Avatar {
  id: string;
  name: string;
  imageUrl: string;
  generatedOn: string;
  userId: string | number;
}

// Opciones para generación personalizada
interface AvatarGenerationOptions {
  style: string;
}

interface AvatarSelectorProps {
  userId: string | number;
  onSelect?: (avatarUrl: string, avatarId: string) => void;
  allowGeneration?: boolean;
  className?: string;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  userId,
  onSelect,
  allowGeneration = true,
  className = '',
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
  const [generationOptions, setGenerationOptions] = useState<AvatarGenerationOptions>({
    style: 'fitness'
  });
  
  // Obtener la lista de avatares del usuario
  const { data: avatars, isLoading, error } = useQuery({
    queryKey: ['/api/avatars', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/avatars`);
      if (!response.ok) {
        throw new Error('Error al cargar avatares');
      }
      const data = await response.json();
      return data.avatars as Avatar[];
    }
  });
  
  // Mutación para establecer el avatar activo
  const setActiveAvatarMutation = useMutation({
    mutationFn: async ({ avatarId, avatarUrl }: { avatarId: string, avatarUrl: string }) => {
      const response = await apiRequest('POST', `/api/users/${userId}/avatar`, {
        avatarId,
        avatarUrl
      });
      
      if (!response.ok) {
        throw new Error('Error al establecer el avatar');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      toast({
        title: 'Avatar actualizado',
        description: 'Tu avatar ha sido actualizado correctamente',
      });
      
      // Notificar al componente padre si hay un callback
      if (selectedAvatarId && onSelect && avatars) {
        const selectedAvatar = avatars.find(avatar => avatar.id === selectedAvatarId);
        if (selectedAvatar) {
          onSelect(selectedAvatar.imageUrl, selectedAvatar.id);
        }
      }
    },
    onError: (error) => {
      toast({
        title: 'Error al actualizar avatar',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Mutación para generar un nuevo avatar
  const generateAvatarMutation = useMutation({
    mutationFn: async (options: AvatarGenerationOptions) => {
      const response = await apiRequest('POST', '/api/avatars/generate', {
        userId,
        style: options.style
      });
      
      if (!response.ok) {
        throw new Error('Error al generar el avatar');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/avatars', userId] });
      toast({
        title: 'Avatar generado',
        description: 'Tu nuevo avatar ha sido generado correctamente',
      });
      
      // Seleccionar automáticamente el nuevo avatar
      if (data.avatar && data.avatar.id) {
        handleSelectAvatar(data.avatar.id, data.avatar.imageUrl);
      }
    },
    onError: (error) => {
      toast({
        title: 'Error al generar avatar',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Mutación para eliminar un avatar
  const deleteAvatarMutation = useMutation({
    mutationFn: async (avatarId: string) => {
      const response = await apiRequest('DELETE', `/api/users/${userId}/avatars/${avatarId}`);
      
      if (!response.ok) {
        throw new Error('Error al eliminar el avatar');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/avatars', userId] });
      toast({
        title: 'Avatar eliminado',
        description: 'El avatar ha sido eliminado correctamente',
      });
      
      // Si el avatar eliminado era el seleccionado, deseleccionarlo
      if (selectedAvatarId === null) {
        setSelectedAvatarId(null);
      }
    },
    onError: (error) => {
      toast({
        title: 'Error al eliminar avatar',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Manejar la selección de un avatar
  const handleSelectAvatar = (avatarId: string, avatarUrl: string) => {
    setSelectedAvatarId(avatarId);
    setActiveAvatarMutation.mutate({ avatarId, avatarUrl });
  };
  
  // Manejar la generación de un nuevo avatar
  const handleGenerateAvatar = () => {
    generateAvatarMutation.mutate(generationOptions);
  };
  
  // Manejar la eliminación de un avatar
  const handleDeleteAvatar = (avatarId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteAvatarMutation.mutate(avatarId);
  };
  
  // Establecer el avatar por defecto si no hay ninguno seleccionado
  useEffect(() => {
    if (avatars && avatars.length > 0 && !selectedAvatarId) {
      const userWithProfile = queryClient.getQueryData<any>(['/api/user']);
      const activeAvatarId = userWithProfile?.profile?.activeAvatarId;
      
      if (activeAvatarId) {
        setSelectedAvatarId(activeAvatarId);
      } else {
        // Si no hay avatar activo, seleccionar el primero
        setSelectedAvatarId(avatars[0].id);
      }
    }
  }, [avatars, selectedAvatarId, queryClient]);
  
  // Renderizar estilos disponibles
  const renderStyleOptions = () => {
    const styles = ['fitness', 'casual', 'professional', 'athletic'];
    
    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {styles.map(style => (
          <Button
            key={style}
            variant={generationOptions.style === style ? 'default' : 'outline'}
            onClick={() => setGenerationOptions(prev => ({ ...prev, style }))}
            className="text-xs capitalize"
          >
            {style}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className={`w-full ${className}`}>
      <Tabs defaultValue="select" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="select" className="flex-1">Seleccionar Avatar</TabsTrigger>
          {allowGeneration && (
            <TabsTrigger value="generate" className="flex-1">Generar Nuevo</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="select" className="mt-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2">Cargando avatares...</span>
            </div>
          ) : error ? (
            <div className="text-center p-4 text-destructive">
              <p>Error al cargar los avatares</p>
              <Button 
                variant="outline" 
                onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/avatars', userId] })}
                className="mt-2"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            </div>
          ) : avatars && avatars.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {avatars.map((avatar) => (
                <div 
                  key={avatar.id}
                  onClick={() => handleSelectAvatar(avatar.id, avatar.imageUrl)}
                  className={`relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all hover:opacity-90 ${
                    selectedAvatarId === avatar.id ? 'border-primary scale-105' : 'border-transparent scale-100'
                  }`}
                >
                  <img 
                    src={avatar.imageUrl} 
                    alt={avatar.name} 
                    className="w-full aspect-square object-cover" 
                  />
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-1 text-xs truncate text-center">
                    {avatar.name}
                  </div>
                  
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-80 hover:opacity-100"
                    onClick={(e) => handleDeleteAvatar(avatar.id, e)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border rounded-lg">
              <p className="text-muted-foreground mb-4">No tienes avatares disponibles</p>
              {allowGeneration && (
                <Button variant="outline" onClick={() => handleGenerateAvatar()}>
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Generar avatar
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        {allowGeneration && (
          <TabsContent value="generate" className="mt-0">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Personalización</h3>
              {renderStyleOptions()}
              
              <div className="flex justify-center mt-4">
                <Button
                  onClick={handleGenerateAvatar}
                  disabled={generateAvatarMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {generateAvatarMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="w-4 h-4 mr-2" />
                      Generar Avatar
                    </>
                  )}
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-4 text-center">
                El avatar se generará según el estilo seleccionado. 
                Este proceso puede tomar unos segundos.
              </p>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default AvatarSelector;
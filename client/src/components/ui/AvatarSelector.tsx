import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { Loader } from 'lucide-react';

interface AvatarOption {
  id: string;
  name: string;
  imageUrl: string;
  generatedOn: string;
  userId: number;
}

interface AvatarSelectorProps {
  userId: number;
  currentAvatarUrl?: string | null;
  onSelectAvatar?: (avatar: AvatarOption) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  userId,
  currentAvatarUrl,
  onSelectAvatar,
  size = 'md'
}) => {
  const [avatars, setAvatars] = useState<AvatarOption[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const loadAvatars = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest(`/api/users/${userId}/avatars`);
      const avatarData = response.avatars || [];
      setAvatars(avatarData);
      
      // Si hay avatares, selecciona el avatar activo o el primero de la lista
      if (avatarData.length > 0) {
        const activeAvatar = avatarData.find((avatar: AvatarOption) => 
          avatar.imageUrl === currentAvatarUrl
        );
        setSelectedAvatar(activeAvatar || avatarData[0]);
      }
    } catch (error) {
      console.error('Error al cargar avatares:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los avatares',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAvatar = async (style: string) => {
    setIsGenerating(true);
    try {
      const data = await apiRequest(`/api/avatars/generate`, {
        method: 'POST',
        body: { userId, style }
      });
      
      if (data.success && data.avatar) {
        setAvatars(prev => [...prev, data.avatar]);
        setSelectedAvatar(data.avatar);
        toast({
          title: 'Avatar generado',
          description: `Se ha generado un nuevo avatar: ${data.avatar.name}`,
        });
      } else {
        throw new Error(data.message || 'Error al generar avatar');
      }
    } catch (error) {
      console.error('Error al generar avatar:', error);
      toast({
        title: 'Error',
        description: 'No se pudo generar el avatar',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const selectAvatar = async (avatar: AvatarOption) => {
    setSelectedAvatar(avatar);
    try {
      await apiRequest(`/api/users/${userId}/avatar`, {
        method: 'POST',
        body: {
          avatarId: avatar.id,
          avatarUrl: avatar.imageUrl
        }
      });
      
      if (onSelectAvatar) {
        onSelectAvatar(avatar);
      }
      
      toast({
        title: 'Avatar actualizado',
        description: 'Tu avatar ha sido actualizado correctamente',
      });
      
      // Invalidar cualquier consulta relacionada con el perfil del usuario
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
    } catch (error) {
      console.error('Error al actualizar avatar:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el avatar',
        variant: 'destructive',
      });
    }
  };

  const deleteAvatar = async (avatar: AvatarOption, e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se seleccione el avatar
    
    if (avatars.length <= 1) {
      toast({
        title: 'Error',
        description: 'Debes tener al menos un avatar',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await apiRequest(`/api/users/${userId}/avatars/${avatar.id}`, { 
        method: 'DELETE' 
      });
      
      setAvatars(prev => prev.filter(a => a.id !== avatar.id));
      
      // Si se eliminó el avatar seleccionado, seleccionar otro
      if (selectedAvatar && selectedAvatar.id === avatar.id) {
        const newSelected = avatars.find(a => a.id !== avatar.id);
        if (newSelected) {
          setSelectedAvatar(newSelected);
          selectAvatar(newSelected);
        }
      }
      
      toast({
        title: 'Avatar eliminado',
        description: 'El avatar ha sido eliminado correctamente',
      });
    } catch (error) {
      console.error('Error al eliminar avatar:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el avatar',
        variant: 'destructive',
      });
    }
  };

  // Cargar avatares al montar el componente
  useEffect(() => {
    if (userId) {
      loadAvatars();
    }
  }, [userId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Avatar className={`cursor-pointer ${sizeClasses[size]} bg-black border-2 border-green-500 hover:border-green-400 transition-all`}>
          <AvatarImage src={currentAvatarUrl || undefined} alt="Avatar" />
          <AvatarFallback className="bg-black text-green-500">
            {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : 'FIT'}
          </AvatarFallback>
        </Avatar>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Seleccionar Avatar</DialogTitle>
          <DialogDescription>
            Elige o genera un nuevo avatar para tu perfil
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="avatars">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="avatars">Mis avatares</TabsTrigger>
            <TabsTrigger value="generate">Generar nuevo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="avatars" className="pt-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader className="h-8 w-8 animate-spin text-green-500" />
              </div>
            ) : avatars.length === 0 ? (
              <div className="text-center h-48 flex flex-col justify-center items-center">
                <p className="text-muted-foreground mb-2">No tienes avatares</p>
                <Button variant="outline" onClick={() => generateAvatar('fitness')}>
                  Generar primer avatar
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {avatars.map(avatar => (
                  <Card 
                    key={avatar.id} 
                    className={`overflow-hidden cursor-pointer ${
                      selectedAvatar?.id === avatar.id ? 'ring-2 ring-green-500' : ''
                    }`}
                    onClick={() => selectAvatar(avatar)}
                  >
                    <CardContent className="p-2 relative">
                      <img 
                        src={avatar.imageUrl} 
                        alt={avatar.name} 
                        className="aspect-square object-cover object-center rounded-md"
                      />
                      {avatars.length > 1 && (
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-6 w-6 absolute top-1 right-1 rounded-full opacity-75 hover:opacity-100"
                          onClick={(e) => deleteAvatar(avatar, e)}
                        >
                          ×
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="generate" className="pt-2">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Genera un nuevo avatar eligiendo un estilo
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => generateAvatar('athletic')}
                  disabled={isGenerating}
                >
                  {isGenerating ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                  Atlético
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => generateAvatar('casual')}
                  disabled={isGenerating}
                >
                  {isGenerating ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                  Casual
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => generateAvatar('professional')}
                  disabled={isGenerating}
                >
                  {isGenerating ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                  Profesional
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => generateAvatar('neutral')}
                  disabled={isGenerating}
                >
                  {isGenerating ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                  Neutro
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button type="button" onClick={loadAvatars} variant="outline">
            Refrescar
          </Button>
          <Button type="button" disabled={!selectedAvatar}>
            Aplicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarSelector;
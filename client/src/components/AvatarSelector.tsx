import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { apiRequest } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';

// Definir tipos para avatars
interface AvatarOption {
  id: string;
  name: string;
  imageUrl: string;
  category: 'male' | 'female' | 'neutral' | 'custom';
}

// Avatars predeterminados
const defaultAvatars: AvatarOption[] = [
  { id: 'male-1', name: 'Athletic Male', imageUrl: '/avatars/male-athletic.png', category: 'male' },
  { id: 'male-2', name: 'Casual Male', imageUrl: '/avatars/male-casual.png', category: 'male' },
  { id: 'male-3', name: 'Professional Male', imageUrl: '/avatars/male-professional.png', category: 'male' },
  { id: 'female-1', name: 'Athletic Female', imageUrl: '/avatars/female-athletic.png', category: 'female' },
  { id: 'female-2', name: 'Casual Female', imageUrl: '/avatars/female-casual.png', category: 'female' },
  { id: 'female-3', name: 'Professional Female', imageUrl: '/avatars/female-professional.png', category: 'female' },
  { id: 'neutral-1', name: 'Neutral 1', imageUrl: '/avatars/neutral-1.png', category: 'neutral' },
  { id: 'neutral-2', name: 'Neutral 2', imageUrl: '/avatars/neutral-2.png', category: 'neutral' },
];

// Gestionar avatars generados (SmartBotics)
interface SmartBoticsAvatar {
  id: string;
  name: string;
  imageUrl: string;
  generatedOn: string;
}

interface AvatarSelectorProps {
  currentAvatarId?: string;
  onAvatarSelected: (avatarId: string, avatarUrl: string) => void;
  userId?: string;
}

export function AvatarSelector({ currentAvatarId, onAvatarSelected, userId }: AvatarSelectorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(currentAvatarId);
  const [customAvatars, setCustomAvatars] = useState<SmartBoticsAvatar[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('default');

  // Cargar avatars personalizados al inicio
  useEffect(() => {
    if (userId) {
      fetchCustomAvatars();
    }
  }, [userId]);

  const fetchCustomAvatars = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const response = await apiRequest('GET', `/api/users/${userId}/avatars`);
      const data = await response.json();
      
      if (data.avatars) {
        setCustomAvatars(data.avatars);
      }
    } catch (error) {
      console.error('Error fetching custom avatars:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarClick = (avatar: AvatarOption | SmartBoticsAvatar) => {
    setSelectedAvatar(avatar.id);
    onAvatarSelected(avatar.id, avatar.imageUrl);
  };

  const generateSmartBoticsAvatar = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para generar un avatar personalizado",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      toast({
        title: "Generando avatar",
        description: "Tu avatar SmartBotics está siendo generado...",
      });

      const response = await apiRequest('POST', '/api/avatars/generate', {
        userId,
        style: 'fitness',
      });

      if (!response.ok) {
        throw new Error('Error al generar el avatar');
      }

      const data = await response.json();
      
      if (data.avatar) {
        setCustomAvatars(prev => [...prev, data.avatar]);
        setSelectedAvatar(data.avatar.id);
        onAvatarSelected(data.avatar.id, data.avatar.imageUrl);
        setActiveTab('custom');
        
        toast({
          title: "Avatar generado",
          description: "Tu nuevo avatar SmartBotics ha sido creado correctamente",
        });
      }
    } catch (error) {
      console.error('Error generating avatar:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el avatar. Inténtalo de nuevo más tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-black border-green-500/20">
      <CardContent className="p-6">
        <Tabs defaultValue="default" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="default">Avatars Predeterminados</TabsTrigger>
            <TabsTrigger value="custom">SmartBotics Avatars</TabsTrigger>
          </TabsList>
          
          <TabsContent value="default" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {defaultAvatars.map((avatar) => (
                <div 
                  key={avatar.id}
                  className={`relative cursor-pointer rounded-lg p-2 transition-all hover:scale-105 ${
                    selectedAvatar === avatar.id ? 'ring-2 ring-green-500 bg-green-950/30' : 'bg-gray-950'
                  }`}
                  onClick={() => handleAvatarClick(avatar)}
                >
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src={avatar.imageUrl} alt={avatar.name} />
                    <AvatarFallback>{avatar.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <p className="text-center mt-2 text-sm text-gray-300">{avatar.name}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">SmartBotics Avatars</h3>
              <Button 
                onClick={generateSmartBoticsAvatar} 
                disabled={isLoading}
                variant="default"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? "Generando..." : "Generar Avatar"}
              </Button>
            </div>
            
            {customAvatars.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {customAvatars.map((avatar) => (
                  <div 
                    key={avatar.id}
                    className={`relative cursor-pointer rounded-lg p-2 transition-all hover:scale-105 ${
                      selectedAvatar === avatar.id ? 'ring-2 ring-green-500 bg-green-950/30' : 'bg-gray-950'
                    }`}
                    onClick={() => handleAvatarClick(avatar)}
                  >
                    <Avatar className="w-24 h-24 mx-auto">
                      <AvatarImage src={avatar.imageUrl} alt={avatar.name} />
                      <AvatarFallback>{avatar.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <p className="text-center mt-2 text-sm text-gray-300">{avatar.name}</p>
                    <p className="text-center text-xs text-gray-500">
                      {new Date(avatar.generatedOn).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-950 rounded-lg">
                <p className="text-gray-400">No tienes avatars personalizados</p>
                <p className="text-gray-500 text-sm mt-2">Genera tu primer avatar SmartBotics para personalizar tu experiencia</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default AvatarSelector;
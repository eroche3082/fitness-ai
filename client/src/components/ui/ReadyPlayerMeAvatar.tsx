import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

// Define tipos para los avatares de Ready Player Me
interface ReadyPlayerMeAvatar {
  id: string;
  name: string;
  imageUrl: string;
  modelUrl: string;
  userId: number;
  generatedOn: string;
  avatarType: 'readyplayerme';
}

interface ReadyPlayerMeAvatarProps {
  userId: number;
  isAdmin?: boolean;
  onAvatarCreated?: (avatar: ReadyPlayerMeAvatar) => void;
}

export function ReadyPlayerMeAvatar({ userId, isAdmin = false, onAvatarCreated }: ReadyPlayerMeAvatarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarName, setAvatarName] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const createRPMAvatar = async () => {
    if (!avatarUrl) {
      toast({
        title: 'Error',
        description: 'Por favor ingresa una URL de avatar válida',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Validar la URL para asegurarse de que sea de Ready Player Me
      if (!avatarUrl.includes('readyplayer.me') && !avatarUrl.includes('wolf3d.io')) {
        throw new Error('La URL debe ser de Ready Player Me (readyplayer.me o wolf3d.io)');
      }

      const data = await apiRequest('/api/avatars/rpm', {
        method: 'POST',
        body: {
          userId,
          name: avatarName || 'Avatar 3D',
          avatarUrl,
          avatarType: 'readyplayerme'
        }
      });

      if (data.success && data.avatar) {
        toast({
          title: 'Avatar creado',
          description: 'Avatar 3D importado correctamente',
        });

        if (onAvatarCreated) {
          onAvatarCreated(data.avatar);
        }

        setShowDialog(false);
        setAvatarUrl('');
        setAvatarName('');
      } else {
        throw new Error(data.message || 'Error al crear el avatar');
      }
    } catch (error) {
      console.error('Error al importar avatar:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error al importar el avatar de Ready Player Me',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant={isAdmin ? "outline" : "default"} className={isAdmin ? "w-full" : ""}>
          {isAdmin ? 'Importar Avatar 3D (RPM)' : 'Crear Avatar 3D'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importar Avatar 3D</DialogTitle>
          <DialogDescription>
            Añade un avatar 3D de Ready Player Me para usarlo en la plataforma.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre del avatar</Label>
            <Input
              id="name"
              value={avatarName}
              onChange={(e) => setAvatarName(e.target.value)}
              placeholder="Mi avatar 3D"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="avatarUrl">URL del avatar de Ready Player Me</Label>
            <Input
              id="avatarUrl"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://models.readyplayer.me/..."
              className="col-span-3"
            />
            <p className="text-sm text-muted-foreground">
              Necesitas crear un avatar en{' '}
              <a 
                href="https://readyplayer.me/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline text-primary"
              >
                ReadyPlayer.me
              </a>{' '}
              y copiar la URL del modelo 3D.
            </p>
          </div>
          
          {avatarUrl && (
            <div className="grid gap-2">
              <Label>Vista previa</Label>
              <div className="bg-muted rounded-md p-2 h-40 flex items-center justify-center">
                {avatarUrl.includes('readyplayer.me') || avatarUrl.includes('wolf3d.io') ? (
                  <img 
                    src={`${avatarUrl}.png?preview=true`} 
                    alt="Vista previa" 
                    className="max-h-full rounded-md"
                    onError={() => {
                      toast({
                        title: 'Error en la vista previa',
                        description: 'No se pudo cargar la vista previa. Verifica que la URL sea correcta.',
                        variant: 'destructive',
                      });
                    }}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground text-center">
                    La URL debe ser de Ready Player Me (readyplayer.me o wolf3d.io)
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setShowDialog(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={createRPMAvatar}
            disabled={isLoading || !avatarUrl}
          >
            {isLoading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : null}
            Importar Avatar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ReadyPlayerMeAvatar;
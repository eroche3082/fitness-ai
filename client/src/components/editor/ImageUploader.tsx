import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader, Upload, X } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseConfig';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  currentImageUrl: string;
  onImageSelected: (url: string) => void;
  className?: string;
}

export default function ImageUploader({ 
  currentImageUrl, 
  onImageSelected,
  className = 'h-32' 
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const { toast } = useToast();

  // Manejar subida de archivos
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Formato no soportado',
        description: 'Por favor, sube un archivo de imagen válido (jpg, png, gif, etc.)',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Generar un nombre único para el archivo
      const fileName = `editor_images/${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, fileName);
      
      // Subir el archivo
      await uploadBytes(storageRef, file);
      
      // Obtener la URL del archivo
      const downloadUrl = await getDownloadURL(storageRef);
      
      // Enviar la URL al componente padre
      onImageSelected(downloadUrl);
      
      toast({
        title: 'Imagen subida correctamente',
        description: 'La imagen se ha subido y aplicado con éxito.',
      });
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      toast({
        title: 'Error al subir la imagen',
        description: 'No se pudo subir la imagen. Por favor, intenta nuevamente.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Manejar URL externa
  const handleUrlSubmit = () => {
    if (!inputUrl) return;
    
    // Validación básica de URL
    if (!inputUrl.match(/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i)) {
      toast({
        title: 'URL no válida',
        description: 'Por favor, ingresa una URL válida de imagen (jpg, png, gif, webp).',
        variant: 'destructive'
      });
      return;
    }
    
    onImageSelected(inputUrl);
    setShowUrlInput(false);
    setInputUrl('');
    
    toast({
      title: 'Imagen configurada',
      description: 'La URL de la imagen se ha aplicado con éxito.',
    });
  };

  // Eliminar la imagen actual
  const handleRemoveImage = () => {
    onImageSelected('');
    toast({
      title: 'Imagen eliminada',
      description: 'La imagen ha sido eliminada.',
    });
  };

  return (
    <div>
      {/* Vista previa de la imagen actual */}
      {currentImageUrl ? (
        <div className={`relative ${className} overflow-hidden rounded-md mb-2`}>
          <img 
            src={currentImageUrl} 
            alt="Imagen actual" 
            className="w-full h-full object-cover"
          />
          <Button 
            variant="destructive" 
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className={`bg-gray-800 border border-dashed border-gray-600 rounded-md flex items-center justify-center ${className} mb-2`}>
          <p className="text-gray-400 text-sm">Vista previa de la imagen</p>
        </div>
      )}
      
      {/* Opciones de subida */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
            id="image-upload"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('image-upload')?.click()}
            disabled={isUploading}
            className="w-full bg-transparent border-gray-700 text-white hover:bg-gray-700"
          >
            {isUploading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Subir Imagen
              </>
            )}
          </Button>
        </div>
        
        {showUrlInput ? (
          <div className="col-span-2 mt-2 flex space-x-2">
            <Input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Pegar URL de imagen..."
              className="bg-gray-800 border-gray-700 text-white"
            />
            <Button 
              onClick={handleUrlSubmit}
              className="bg-green-500 text-white hover:bg-green-600 shrink-0"
            >
              Aplicar
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-700 text-white hover:bg-gray-700 shrink-0"
              onClick={() => setShowUrlInput(false)}
            >
              Cancelar
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setShowUrlInput(true)}
            className="w-full bg-transparent border-gray-700 text-white hover:bg-gray-700"
          >
            URL Externa
          </Button>
        )}
      </div>
    </div>
  );
}
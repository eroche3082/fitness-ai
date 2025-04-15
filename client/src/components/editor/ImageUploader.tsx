import React, { useState, useRef } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseConfig';
import { Button } from '@/components/ui/button';
import { UploadCloud, X, Check, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  currentImageUrl: string;
  onImageUpload: (url: string) => void;
  section: string; // Para saber a qué sección pertenece (hero, features, etc.)
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  onImageUpload,
  section,
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manejar la selección de archivo
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setUploadError('Solo se permiten archivos de imagen.');
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('La imagen no debe superar los 5MB.');
      return;
    }

    // Crear URL de vista previa
    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(localPreviewUrl);
    setUploadError(null);
    
    // Subir a Firebase Storage
    uploadImage(file);
  };

  // Subir imagen a Firebase Storage
  const uploadImage = async (file: File) => {
    setIsUploading(true);
    setUploadSuccess(false);
    
    try {
      // Crear referencia en Storage
      const storageRef = ref(storage, `editor_images/${section}_${Date.now()}_${file.name}`);
      
      // Subir archivo
      await uploadBytes(storageRef, file);
      
      // Obtener URL de descarga
      const downloadUrl = await getDownloadURL(storageRef);
      
      // Actualizar estado y notificar al componente padre
      setUploadSuccess(true);
      onImageUpload(downloadUrl);
      
      // Limpiar después de 3 segundos
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error al subir imagen:', error);
      setUploadError('Error al subir la imagen. Inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  // Abre el selector de archivos
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Eliminar imagen
  const removeImage = () => {
    setPreviewUrl(null);
    onImageUpload('');
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-white font-medium">Imagen para {section}</h3>
        
        {previewUrl && (
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={removeImage}
            className="h-8 px-2"
          >
            <X className="h-4 w-4 mr-1" /> Eliminar
          </Button>
        )}
      </div>
      
      {/* Vista previa de la imagen */}
      {previewUrl ? (
        <div className="relative rounded-md overflow-hidden border border-gray-700 bg-gray-900 aspect-video">
          <img
            src={previewUrl}
            alt={`Vista previa para ${section}`}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div 
          className="border border-dashed border-gray-700 rounded-md p-8 flex flex-col items-center justify-center bg-gray-900 cursor-pointer hover:bg-gray-800 transition-colors aspect-video"
          onClick={triggerFileInput}
        >
          <ImageIcon className="w-12 h-12 text-gray-500 mb-4" />
          <p className="text-gray-400 text-center mb-2">Haz clic para seleccionar una imagen</p>
          <p className="text-gray-500 text-xs text-center">JPEG, PNG, WebP o GIF (max. 5MB)</p>
        </div>
      )}
      
      {/* Input de archivo (oculto) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      
      {/* Botón de subida */}
      <Button
        type="button"
        variant="default"
        onClick={triggerFileInput}
        disabled={isUploading}
        className="w-full bg-gray-800 border-gray-700 hover:bg-gray-700"
      >
        {isUploading ? (
          <div className="flex items-center">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            Subiendo...
          </div>
        ) : uploadSuccess ? (
          <div className="flex items-center">
            <Check className="h-4 w-4 mr-2 text-green-500" />
            ¡Imagen subida!
          </div>
        ) : (
          <div className="flex items-center">
            <UploadCloud className="h-4 w-4 mr-2" />
            {previewUrl ? 'Cambiar imagen' : 'Subir imagen'}
          </div>
        )}
      </Button>
      
      {/* Mensaje de error */}
      {uploadError && (
        <p className="text-red-500 text-sm">{uploadError}</p>
      )}
    </div>
  );
};

export default ImageUploader;
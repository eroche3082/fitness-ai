import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
  className?: string;
}

const FontSelector: React.FC<FontSelectorProps> = ({ value, onChange, className = '' }) => {
  // Lista de fuentes disponibles
  const fonts = [
    'Inter',
    'Poppins',
    'Roboto',
    'Montserrat',
    'Open Sans',
    'Lato',
    'Oswald',
    'Raleway',
    'Ubuntu',
    'Source Sans Pro',
    'Playfair Display',
    'Merriweather',
    'Nunito',
    'PT Sans',
    'Rubik',
  ];

  // Función para obtener el estilo de muestra para cada fuente
  const getFontPreviewStyle = (fontName: string) => ({
    fontFamily: fontName,
  });

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor="font-selector" className="text-white">Fuente</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id="font-selector"
          className="w-full bg-gray-800 border-gray-700 text-white focus:ring-primary focus:border-primary"
        >
          <SelectValue placeholder="Seleccionar fuente" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700 text-white">
          {fonts.map((font) => (
            <SelectItem
              key={font}
              value={font}
              className="focus:bg-gray-700 hover:bg-gray-700 cursor-pointer"
            >
              <span style={getFontPreviewStyle(font)}>{font}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Vista previa de la fuente seleccionada */}
      <div className="mt-4">
        <p className="text-sm text-gray-400 mb-1">Vista previa:</p>
        <div
          className="p-3 bg-gray-900 rounded-md border border-gray-700"
          style={{ fontFamily: value }}
        >
          <p className="text-xl font-bold text-white mb-2">Fitness AI</p>
          <p className="text-sm text-gray-300">
            Entrenamiento personalizado e inteligente para alcanzar tu máximo potencial.
            Aquí puedes ver cómo se ve la fuente {value} en diferentes tamaños.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FontSelector;
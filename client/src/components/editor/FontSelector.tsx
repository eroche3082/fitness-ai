import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
}

// Lista de fuentes populares
const fonts = [
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Lato',
  'Poppins',
  'Inter',
  'Raleway',
  'Oswald',
  'Source Sans Pro',
  'Nunito',
  'Playfair Display',
  'Merriweather',
  'Rubik',
  'Ubuntu',
  'Archivo',
];

export default function FontSelector({ value, onChange }: FontSelectorProps) {
  return (
    <div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
          <SelectValue placeholder="Seleccionar fuente" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-gray-700 text-white">
          {fonts.map((font) => (
            <SelectItem key={font} value={font} className="focus:bg-gray-800 focus:text-white">
              <span style={{ fontFamily: font }}>{font}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="mt-4">
        <p className="text-sm text-gray-400 mb-2">Vista previa:</p>
        <div 
          className="p-3 bg-gray-800 border border-gray-700 rounded-md"
          style={{ fontFamily: value }}
        >
          <p className="text-lg">Texto de ejemplo</p>
          <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>
    </div>
  );
}
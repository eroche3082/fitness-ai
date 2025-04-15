import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const predefinedColors = [
  '#11ff00', // Verde Fitness AI
  '#22c55e', // Verde
  '#06b6d4', // Cyan
  '#3b82f6', // Azul
  '#8b5cf6', // Violeta
  '#ec4899', // Rosa
  '#f43f5e', // Rojo
  '#f97316', // Naranja
  '#fbbf24', // Ámbar
  '#111111', // Negro
  '#ffffff', // Blanco
  '#6b7280', // Gris
];

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(color);
  
  const handleColorClick = (newColor: string) => {
    onChange(newColor);
    setInputValue(newColor);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleInputBlur = () => {
    // Validar que sea un color hexadecimal válido
    if (/^#[0-9A-F]{6}$/i.test(inputValue)) {
      onChange(inputValue);
    } else {
      // Si no es válido, restaurar al valor anterior
      setInputValue(color);
    }
  };
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex space-x-2">
        <div
          className="h-10 w-10 rounded-md border border-gray-700 flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className="bg-gray-800 border-gray-700 text-white"
          placeholder="#000000"
        />
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="border-gray-700 text-white w-full">
            Seleccionar Color
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 bg-gray-900 border-gray-700">
          <div className="grid grid-cols-6 gap-2">
            {predefinedColors.map((presetColor) => (
              <button
                key={presetColor}
                className={`h-8 w-8 rounded-md cursor-pointer border ${
                  color === presetColor ? 'border-white' : 'border-gray-600'
                }`}
                style={{ backgroundColor: presetColor }}
                onClick={() => handleColorClick(presetColor)}
                aria-label={`Color ${presetColor}`}
              />
            ))}
          </div>
          <div className="mt-4">
            <div className="w-full h-24 rounded-md border border-gray-700" style={{ background: `linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)` }}>
              <div className="w-full h-full" style={{ background: 'linear-gradient(to top, #000000, rgba(0, 0, 0, 0))' }} />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
import React, { useState, useRef, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Colores predefinidos para Fitness AI
  const presetColors = [
    '#11ff00', // Verde Fitness (Default)
    '#00e676', // Verde Menta
    '#00bcd4', // Azul Agua
    '#2196f3', // Azul Material
    '#3f51b5', // Índigo
    '#673ab7', // Púrpura
    '#e91e63', // Rosa
    '#f44336', // Rojo
    '#ff9800', // Naranja
    '#ffeb3b', // Amarillo
    '#795548', // Marrón
    '#607d8b', // Gris Azulado
    '#333333', // Gris Oscuro
    '#000000', // Negro
    '#ffffff', // Blanco
  ];

  // Cerrar el color picker al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Manejar cambio de color
  const handleColorChange = (newColor: any) => {
    onChange(newColor.hex);
  };

  // Manejar selección de color predefinido
  const handlePresetColorClick = (presetColor: string) => {
    onChange(presetColor);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Color actual y botón para abrir el selector */}
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="h-10 px-3 bg-gray-800 border-gray-700 hover:bg-gray-700"
        >
          <div className="flex items-center space-x-2">
            <div
              className="w-6 h-6 rounded-md border border-gray-600"
              style={{ backgroundColor: color }}
            />
            <span className="text-white">{color}</span>
            <Palette className="h-4 w-4 text-gray-400" />
          </div>
        </Button>
      </div>

      {/* Selector de color */}
      {isOpen && (
        <div
          ref={pickerRef}
          className="absolute z-50 mt-2 bg-gray-800 border border-gray-700 rounded-md shadow-lg"
        >
          <ChromePicker
            color={color}
            onChange={handleColorChange}
            disableAlpha={true}
          />
          
          {/* Colores predefinidos */}
          <div className="p-3 border-t border-gray-700">
            <p className="text-sm text-gray-400 mb-2">Colores predefinidos</p>
            <div className="grid grid-cols-5 gap-2">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  type="button"
                  className={`w-8 h-8 rounded-md border ${
                    presetColor === color ? 'border-white' : 'border-gray-600'
                  }`}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => handlePresetColorClick(presetColor)}
                  title={presetColor}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  code: string;
  size?: number;
  foreground?: string;
  background?: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ 
  code, 
  size = 200, 
  foreground = '#000000',
  background = '#ffffff'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Generate QR code with workout code
    const url = `${window.location.origin}/workout?code=${code}`;
    
    QRCode.toCanvas(
      canvasRef.current, 
      url, 
      {
        width: size,
        margin: 2,
        color: {
          dark: foreground,
          light: background
        }
      }
    ).catch(error => {
      console.error('Error generating QR code:', error);
    });
  }, [code, size, foreground, background]);
  
  return (
    <div className="flex items-center justify-center">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default QRCodeDisplay;
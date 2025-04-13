import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  code: string;
  size?: number;
  background?: string;
  foreground?: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  code,
  size = 150,
  background = '#FFFFFF',
  foreground = '#000000'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const options = {
      width: size,
      height: size,
      margin: 1,
      color: {
        dark: foreground,
        light: background
      }
    };
    
    QRCode.toCanvas(canvasRef.current, code, options, (error) => {
      if (error) console.error('Error generating QR code:', error);
    });
  }, [code, size, background, foreground]);
  
  return (
    <div className="flex justify-center items-center bg-white rounded-md">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default QRCodeDisplay;
import React, { useEffect, useState } from 'react';
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
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (code) {
      generateQRCode();
    }
  }, [code, size, foreground, background]);

  const generateQRCode = async () => {
    try {
      const dataUrl = await QRCode.toDataURL(code, {
        width: size,
        margin: 1,
        color: {
          dark: foreground,
          light: background
        }
      });
      setQrDataUrl(dataUrl);
    } catch (error: unknown) {
      console.error('QR Code generation error:', error);
    }
  };

  if (!qrDataUrl) {
    return (
      <div 
        className="flex items-center justify-center" 
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <img 
      src={qrDataUrl} 
      alt={`QR Code for ${code}`} 
      className="rounded-md" 
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
};

export default QRCodeDisplay;
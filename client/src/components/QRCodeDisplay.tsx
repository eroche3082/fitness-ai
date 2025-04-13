import React, { useEffect, useRef } from 'react';

interface QRCodeDisplayProps {
  code: string;
  size?: number;
  backgroundColor?: string;
  foregroundColor?: string;
  logoUrl?: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  code,
  size = 200,
  backgroundColor = '#FFFFFF',
  foregroundColor = '#000000',
  logoUrl
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Simple QR code rendering function
    // In a production app, you'd use a library like qrcode.react
    const renderQRCode = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Clear canvas
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, size, size);
      
      // Create a pattern based on the code (simplified for demo)
      const codeChars = code.replace(/-/g, '').split('');
      const gridSize = Math.min(Math.ceil(Math.sqrt(codeChars.length * 3)), 25);
      const cellSize = size / gridSize;
      
      // Draw the QR-like pattern
      ctx.fillStyle = foregroundColor;
      
      // Always draw the three corner squares (simplified QR positioning markers)
      // Top-left corner
      ctx.fillRect(cellSize, cellSize, cellSize * 3, cellSize * 3);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(cellSize * 2, cellSize * 2, cellSize, cellSize);
      ctx.fillStyle = foregroundColor;
      
      // Top-right corner
      ctx.fillRect(size - cellSize * 4, cellSize, cellSize * 3, cellSize * 3);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(size - cellSize * 3, cellSize * 2, cellSize, cellSize);
      ctx.fillStyle = foregroundColor;
      
      // Bottom-left corner
      ctx.fillRect(cellSize, size - cellSize * 4, cellSize * 3, cellSize * 3);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(cellSize * 2, size - cellSize * 3, cellSize, cellSize);
      ctx.fillStyle = foregroundColor;
      
      // Use the code to create a unique pattern
      let charIndex = 0;
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          // Skip the corner markers
          if ((x < 4 && y < 4) || (x > gridSize - 5 && y < 4) || (x < 4 && y > gridSize - 5)) {
            continue;
          }
          
          if (charIndex < codeChars.length) {
            // Use character code to determine if a cell should be filled
            const charCode = codeChars[charIndex].charCodeAt(0);
            if (charCode % 2 === 0) {
              ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
            charIndex++;
          }
        }
      }
      
      // Add the logo if provided
      if (logoUrl) {
        const logoSize = size * 0.2;
        const logoX = (size - logoSize) / 2;
        const logoY = (size - logoSize) / 2;
        
        const logo = new Image();
        logo.onload = () => {
          // Draw white background for logo
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(logoX, logoY, logoSize, logoSize);
          
          // Draw the logo
          ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
        };
        logo.src = logoUrl;
      }
    };
    
    renderQRCode();
  }, [code, size, backgroundColor, foregroundColor, logoUrl]);
  
  return (
    <div style={{ textAlign: 'center' }}>
      <canvas 
        ref={canvasRef} 
        width={size} 
        height={size} 
        style={{ 
          display: 'block', 
          margin: '0 auto',
          borderRadius: '8px'
        }}
      />
    </div>
  );
};

export default QRCodeDisplay;
import React, { useEffect, useRef } from 'react';

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
  const qrContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple QR code rendering using SVG
    // In a real app, you would use a dedicated QR code library
    // This is a simplified fallback for demonstration purposes
    if (qrContainerRef.current) {
      // Create a simple QR code representation for demo
      const svgSize = size;
      const cellSize = svgSize / 10;

      // Layout a simple pattern that looks like a QR code
      // (This doesn't actually encode the data, it's just for visual representation)
      let pathData = '';
      
      // Create a simple QR-like pattern based on the code string
      const codeChars = code.split('');
      for (let i = 0; i < codeChars.length; i++) {
        const charCode = codeChars[i].charCodeAt(0);
        const row = Math.floor(i / 5) + 1;
        const col = i % 5 + 1;
        
        // Only add squares for certain character codes to create a pattern
        if (charCode % 2 === 0) {
          pathData += `M${col * cellSize},${row * cellSize} h${cellSize} v${cellSize} h-${cellSize} Z `;
        }
      }
      
      // Add the fixed position markers (corners and alignment)
      // Top-left position marker
      pathData += `M${cellSize},${cellSize} h${cellSize * 3} v${cellSize * 3} h-${cellSize * 3} Z `;
      pathData += `M${cellSize * 2},${cellSize * 2} h${cellSize} v${cellSize} h-${cellSize} Z `;
      
      // Top-right position marker
      pathData += `M${cellSize * 6},${cellSize} h${cellSize * 3} v${cellSize * 3} h-${cellSize * 3} Z `;
      pathData += `M${cellSize * 7},${cellSize * 2} h${cellSize} v${cellSize} h-${cellSize} Z `;
      
      // Bottom-left position marker
      pathData += `M${cellSize},${cellSize * 6} h${cellSize * 3} v${cellSize * 3} h-${cellSize * 3} Z `;
      pathData += `M${cellSize * 2},${cellSize * 7} h${cellSize} v${cellSize} h-${cellSize} Z `;
      
      // Alignment pattern
      pathData += `M${cellSize * 5},${cellSize * 5} h${cellSize * 2} v${cellSize * 2} h-${cellSize * 2} Z `;
      
      // Create the SVG element
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', String(svgSize));
      svg.setAttribute('height', String(svgSize));
      svg.setAttribute('viewBox', `0 0 ${svgSize} ${svgSize}`);
      
      // Create the path for the QR code
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('fill', foreground);
      
      // Create the background
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', String(svgSize));
      rect.setAttribute('height', String(svgSize));
      rect.setAttribute('fill', background);
      
      // Add the elements to the SVG
      svg.appendChild(rect);
      svg.appendChild(path);
      
      // Clear the container and add the SVG
      qrContainerRef.current.innerHTML = '';
      qrContainerRef.current.appendChild(svg);
    }
  }, [code, size, foreground, background]);

  return (
    <div 
      ref={qrContainerRef} 
      className="qr-code-container"
      style={{ 
        width: size, 
        height: size,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    />
  );
};

export default QRCodeDisplay;
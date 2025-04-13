import React from 'react';

interface QRCodeDisplayProps {
  code: string;
  size?: number;
}

/**
 * A component that generates a simple QR code visualization
 * Note: In a production app, use a proper QR code library like qrcode.react
 * This is a simplified version for demo purposes only
 */
const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ code, size = 200 }) => {
  // Create a simple pattern based on the code
  const createPattern = () => {
    // Convert code to a binary-like pattern
    const codeChars = code.split('');
    const pattern = [];
    
    // Create a 7x7 grid of cells
    for (let i = 0; i < 7; i++) {
      const row = [];
      for (let j = 0; j < 7; j++) {
        // Use characters from the code to determine if a cell is filled
        const charIndex = (i * 7 + j) % codeChars.length;
        const char = codeChars[charIndex];
        const charCode = char.charCodeAt(0);
        row.push(charCode % 2 === 0);
      }
      pattern.push(row);
    }
    
    // Add positioning squares (common in QR codes)
    // Top-left positioning square
    pattern[0][0] = true;
    pattern[0][1] = true;
    pattern[0][2] = true;
    pattern[1][0] = true;
    pattern[1][2] = true;
    pattern[2][0] = true;
    pattern[2][1] = true;
    pattern[2][2] = true;
    
    // Top-right positioning square
    pattern[0][4] = true;
    pattern[0][5] = true;
    pattern[0][6] = true;
    pattern[1][4] = true;
    pattern[1][6] = true;
    pattern[2][4] = true;
    pattern[2][5] = true;
    pattern[2][6] = true;
    
    // Bottom-left positioning square
    pattern[4][0] = true;
    pattern[4][1] = true;
    pattern[4][2] = true;
    pattern[5][0] = true;
    pattern[5][2] = true;
    pattern[6][0] = true;
    pattern[6][1] = true;
    pattern[6][2] = true;
    
    return pattern;
  };
  
  const pattern = createPattern();
  const cellSize = Math.floor(size / 7);
  
  return (
    <div className="qr-code-container flex flex-col items-center">
      {/* QR Code visualization */}
      <div 
        className="qr-code bg-white p-4 rounded-lg shadow-md mb-3"
        style={{ width: size + 32, height: size + 32 }}
      >
        <div className="flex flex-col">
          {pattern.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-row">
              {row.map((cell, cellIndex) => (
                <div 
                  key={`${rowIndex}-${cellIndex}`} 
                  className={`qr-cell ${cell ? 'bg-black' : 'bg-white'}`}
                  style={{ 
                    width: cellSize, 
                    height: cellSize,
                    border: '1px solid #f0f0f0' 
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Code display */}
      <div className="text-center">
        <p className="font-mono text-sm text-gray-600">{code}</p>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
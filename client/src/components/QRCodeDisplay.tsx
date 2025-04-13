import React from 'react';

interface QRCodeDisplayProps {
  code: string;
  size?: number;
  background?: string;
  foreground?: string;
}

/**
 * A component that renders a QR code as an SVG
 * Uses a simple algorithm to generate QR codes for demo purposes
 */
const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ 
  code, 
  size = 200,
  background = '#ffffff',
  foreground = '#000000'
}) => {
  // This is a simplified QR code generator for demo purposes
  // In a real app, use a library like qrcode.react
  
  // Use a hash function to create a deterministic pattern from the code
  const generatePattern = (code: string, gridSize: number): boolean[][] => {
    const pattern: boolean[][] = Array(gridSize).fill(0).map(() => Array(gridSize).fill(false));
    
    // Fill the finder patterns (the 3 squares in the corners)
    // Top-left finder pattern
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if ((i === 0 || i === 6 || j === 0 || j === 6) || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
          pattern[i][j] = true;
        }
      }
    }
    
    // Top-right finder pattern
    for (let i = 0; i < 7; i++) {
      for (let j = gridSize - 7; j < gridSize; j++) {
        if ((i === 0 || i === 6 || j === gridSize - 7 || j === gridSize - 1) || 
            (i >= 2 && i <= 4 && j >= gridSize - 5 && j <= gridSize - 3)) {
          pattern[i][j] = true;
        }
      }
    }
    
    // Bottom-left finder pattern
    for (let i = gridSize - 7; i < gridSize; i++) {
      for (let j = 0; j < 7; j++) {
        if ((i === gridSize - 7 || i === gridSize - 1 || j === 0 || j === 6) || 
            (i >= gridSize - 5 && i <= gridSize - 3 && j >= 2 && j <= 4)) {
          pattern[i][j] = true;
        }
      }
    }
    
    // Use the code to determine the rest of the pattern
    // This isn't a real QR code algorithm, just something that looks like one
    const hash = simpleHash(code);
    
    for (let i = 8; i < gridSize - 8; i++) {
      for (let j = 8; j < gridSize - 8; j++) {
        // Use the hash and position to deterministically set cells
        const shouldFill = ((hash + i * j) % 5) === 0 || ((hash + i + j) % 7) === 0;
        pattern[i][j] = shouldFill;
      }
    }
    
    // Add a few more patterns for aesthetic
    for (let i = 8; i < gridSize - 8; i++) {
      pattern[i][7] = i % 2 === 0;
      pattern[7][i] = i % 2 === 0;
      pattern[i][gridSize - 8] = i % 2 === 0;
      pattern[gridSize - 8][i] = i % 2 === 0;
    }
    
    return pattern;
  };
  
  // Simple string hash function
  const simpleHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };
  
  // Generate QR code pattern
  const gridSize = 25; // Size of the QR matrix
  const pattern = generatePattern(code, gridSize);
  
  // Calculate cell size
  const cellSize = size / gridSize;
  
  // Render the QR code as an SVG
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill={background}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={size} height={size} fill={background} />
      
      {pattern.map((row, i) =>
        row.map((filled, j) => 
          filled && (
            <rect
              key={`${i}-${j}`}
              x={j * cellSize}
              y={i * cellSize}
              width={cellSize}
              height={cellSize}
              fill={foreground}
              rx={cellSize / 5}
              ry={cellSize / 5}
            />
          )
        )
      )}
      
      {/* Add the code text at the bottom */}
      <text
        x={size / 2}
        y={size - 10}
        textAnchor="middle"
        fontSize={cellSize * 1.5}
        fontFamily="monospace"
        fill={foreground}
        opacity="0.8"
      >
        {code}
      </text>
    </svg>
  );
};

export default QRCodeDisplay;
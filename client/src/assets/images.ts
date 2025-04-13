// Bridge theme image imports
// This file centralizes all image imports and provides them as named exports

// Hero section background
export const heroBackground = '/src/assets/bridge-images/hero-bg.jpg';
export const logoWhite = '/src/assets/bridge-images/logo-white.png';

// Trainer images
export const trainer1 = '/src/assets/bridge-images/trainer1.jpg';
export const trainer2 = '/src/assets/bridge-images/trainer2.jpg';
export const trainer3 = '/src/assets/bridge-images/trainer3.jpg';

// Training category images
export const training1 = '/src/assets/bridge-images/training1.jpg';  // Training Power
export const training2 = '/src/assets/bridge-images/training2.jpg';  // Strength
export const training3 = '/src/assets/bridge-images/training3.jpg';  // Mobility
export const training4 = '/src/assets/bridge-images/training4.jpg';  // Endurance
export const training5 = '/src/assets/bridge-images/training5.jpg';  // Cardio
export const training6 = '/src/assets/bridge-images/training6.jpg';  // Recovery

// Feature icons are imported directly in the component from lucide-react

// Placeholder function to generate gradient backgrounds as fallbacks
export const getGradientBackground = (type: string): string => {
  const gradients = {
    'hero': 'linear-gradient(to bottom, #000000, #111111)',
    'trainer1': 'linear-gradient(to bottom right, #1a1a1a, #000000)',
    'trainer2': 'linear-gradient(to bottom right, #0f0f0f, #000000)',
    'trainer3': 'linear-gradient(to bottom right, #1a1a1a, #000000)',
    'training-power': 'linear-gradient(to bottom right, #1a1a1a, #000000)',
    'strength': 'linear-gradient(to bottom right, #0f0f0f, #000000)',
    'mobility': 'linear-gradient(to bottom right, #1a1a1a, #000000)',
    'endurance': 'linear-gradient(to bottom right, #0f0f0f, #000000)',
    'cardio': 'linear-gradient(to bottom right, #1a1a1a, #000000)',
    'recovery': 'linear-gradient(to bottom right, #0f0f0f, #000000)',
  };
  
  return gradients[type] || gradients['hero'];
};
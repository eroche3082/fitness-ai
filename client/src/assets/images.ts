// Bridge theme image imports
// This file centralizes all image imports and provides them as named exports

// Hero section background
export const heroBackground = '/src/assets/bridge-images/hero-bg.svg';
export const logoWhite = '/src/assets/bridge-images/logo-white.svg';

// Trainer images
export const trainer1 = '/src/assets/bridge-images/trainer1.svg';
export const trainer2 = '/src/assets/bridge-images/trainer2.svg';
export const trainer3 = '/src/assets/bridge-images/trainer3.svg';

// Training category images
export const training1 = '/src/assets/bridge-images/training1.svg';  // Training Power
export const training2 = '/src/assets/bridge-images/training2.svg';  // Strength
export const training3 = '/src/assets/bridge-images/training3.svg';  // Mobility
export const training4 = '/src/assets/bridge-images/training4.svg';  // Endurance
export const training5 = '/src/assets/bridge-images/training5.svg';  // Cardio
export const training6 = '/src/assets/bridge-images/training6.svg';  // Recovery

// Feature icons are imported directly in the component from lucide-react

// Placeholder function to generate gradient backgrounds as fallbacks
type GradientType = 'hero' | 'trainer1' | 'trainer2' | 'trainer3' | 'training-power' | 
                    'strength' | 'mobility' | 'endurance' | 'cardio' | 'recovery' | string;

export const getGradientBackground = (type: GradientType): string => {
  const gradients: Record<string, string> = {
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
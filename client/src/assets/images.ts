// Bridge theme image imports
// This file centralizes all image imports and provides them as named exports

// Hero section background
export const heroBackground = '/src/assets/bridge-images/hero-bg.svg';
export const hero = '/images/yoga_plank.jpeg'; 
export const logoWhite = '/src/assets/bridge-images/logo-white.svg';

// Trainer images
export const trainer1 = '/images/kettlebell_swings.jpeg';
export const trainer2 = '/images/barbell_squats.jpeg';
export const trainer3 = '/images/group_class.jpeg';

// Training category images
export const training1 = '/images/garage_gym.jpeg';       // Training Power
export const training2 = '/images/treadmill_friends.jpeg'; // Strength
export const training3 = '/images/resistance_band.jpeg';   // Mobility
export const training4 = '/images/family_workout.jpeg';    // Endurance
export const training5 = '/images/elderly_fitness.jpeg';   // Cardio
export const training6 = '/images/meditation.jpeg';        // Recovery

// Additional fitness images
export const progressCheck = '/images/progress_check.jpeg';
export const gymBreak = '/images/gym_break.jpeg';

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
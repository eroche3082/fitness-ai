import { AchievementBadge } from "../shared/types";

/**
 * Collection of all available achievement badges in the system
 */
export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  // Strength category badges
  {
    id: "strength-beginner",
    name: "Fuerza Inicial",
    description: "Has completado tu primer entrenamiento de fuerza",
    category: "strength",
    tier: "bronze",
    imageUrl: "/src/assets/badges/strength-beginner.svg",
    locked: true,
    requirements: "Completa tu primer entrenamiento de fuerza",
    shareable: true,
    socialShareImage: "/src/assets/badges/social/strength-beginner.png"
  },
  {
    id: "strength-intermediate",
    name: "Poder en Progreso",
    description: "Has completado 10 entrenamientos de fuerza",
    category: "strength",
    tier: "silver",
    imageUrl: "/src/assets/badges/strength-intermediate.svg",
    locked: true,
    progress: 0,
    progressDescription: "0/10 entrenamientos",
    requirements: "Completa 10 entrenamientos de fuerza",
    shareable: true,
    socialShareImage: "/src/assets/badges/social/strength-intermediate.png"
  },
  {
    id: "strength-advanced",
    name: "Maestro de Fuerza",
    description: "Has completado 50 entrenamientos de fuerza",
    category: "strength",
    tier: "gold",
    imageUrl: "/src/assets/badges/strength-advanced.svg",
    locked: true,
    progress: 0,
    progressDescription: "0/50 entrenamientos",
    requirements: "Completa 50 entrenamientos de fuerza",
    shareable: true,
    socialShareImage: "/src/assets/badges/social/strength-advanced.png"
  },

  // Cardio category badges
  {
    id: "cardio-beginner",
    name: "Primer Paso",
    description: "Has acumulado 10,000 pasos en un día",
    category: "cardio",
    tier: "bronze",
    imageUrl: "/src/assets/badges/cardio-beginner.svg",
    locked: true,
    requirements: "Acumula 10,000 pasos en un día",
    shareable: true,
    socialShareImage: "/src/assets/badges/social/cardio-beginner.png"
  },
  {
    id: "cardio-intermediate",
    name: "Maratonista en Progreso",
    description: "Has corrido un total de 25 kilómetros",
    category: "cardio",
    tier: "silver",
    imageUrl: "/src/assets/badges/cardio-intermediate.svg",
    locked: true,
    progress: 0,
    progressDescription: "0/25 kilómetros",
    requirements: "Corre un total de 25 kilómetros",
    shareable: true,
    socialShareImage: "/src/assets/badges/social/cardio-intermediate.png"
  },
  {
    id: "cardio-advanced",
    name: "Campeón de Resistencia",
    description: "Has completado tu primera media maratón (21 km)",
    category: "cardio",
    tier: "gold",
    imageUrl: "/src/assets/badges/cardio-advanced.svg",
    locked: true,
    requirements: "Completa una carrera de 21 kilómetros",
    shareable: true,
    socialShareImage: "/src/assets/badges/social/cardio-advanced.png"
  },

  // Nutrition category badges
  {
    id: "nutrition-beginner",
    name: "Nutrición Consciente",
    description: "Has registrado tus comidas durante 7 días consecutivos",
    category: "nutrition",
    tier: "bronze",
    imageUrl: "/src/assets/badges/nutrition-beginner.svg",
    locked: true,
    progress: 0,
    progressDescription: "0/7 días",
    requirements: "Registra tus comidas durante 7 días consecutivos",
    shareable: true,
    socialShareImage: "/src/assets/badges/social/nutrition-beginner.png"
  },
  {
    id: "nutrition-intermediate",
    name: "Nutricionista Aficionado",
    description: "Has alcanzado tu meta de proteínas durante 14 días",
    category: "nutrition",
    tier: "silver",
    imageUrl: "/src/assets/badges/nutrition-intermediate.svg",
    locked: true,
    progress: 0,
    progressDescription: "0/14 días",
    requirements: "Alcanza tu meta de proteínas durante 14 días",
    shareable: true,
    socialShareImage: "/src/assets/badges/social/nutrition-intermediate.png"
  },
  {
    id: "nutrition-advanced",
    name: "Maestro del Balance",
    description: "Has mantenido un balance nutricional perfecto durante 30 días",
    category: "nutrition",
    tier: "gold",
    imageUrl: "/src/assets/badges/nutrition-advanced.svg",
    locked: true,
    progress: 0,
    progressDescription: "0/30 días",
    requirements: "Mantén un balance nutricional perfecto durante 30 días",
    shareable: true,
    socialShareImage: "/src/assets/badges/social/nutrition-advanced.png"
  },

  // Consistency category badges
  {
    id: "consistency-beginner",
    name: "Hábito en Formación",
    description: "Has iniciado sesión en la app durante 7 días consecutivos",
    category: "consistency",
    tier: "bronze",
    imageUrl: "/src/assets/badges/consistency-beginner.svg",
    locked: true,
    progress: 0,
    progressDescription: "0/7 días",
    requirements: "Inicia sesión en la app durante 7 días consecutivos",
    shareable: true,
    socialShareImage: "/src/assets/badges/social/consistency-beginner.png"
  },
  {
    id: "consistency-intermediate",
    name: "Compromiso Firme",
    description: "Has completado 15 entrenamientos en un mes",
    category: "consistency",
    tier: "silver",
    imageUrl: "/src/assets/badges/consistency-intermediate.svg",
    locked: true,
    progress: 0,
    progressDescription: "0/15 entrenamientos",
    requirements: "Completa 15 entrenamientos en un mes",
    shareable: true,
    socialShareImage: "/src/assets/badges/social/consistency-intermediate.png"
  },
  {
    id: "consistency-advanced",
    name: "Inquebrantable",
    description: "Has completado todos tus entrenamientos programados durante 8 semanas",
    category: "consistency",
    tier: "gold",
    imageUrl: "/src/assets/badges/consistency-advanced.svg",
    locked: true,
    progress: 0,
    progressDescription: "0/8 semanas",
    requirements: "Completa todos tus entrenamientos programados durante 8 semanas",
    shareable: true,
    socialShareImage: "/src/assets/badges/social/consistency-advanced.png"
  },

  // Milestone category badges
  {
    id: "milestone-weight-loss",
    name: "Primera Meta de Peso",
    description: "Has alcanzado tu primer objetivo de peso",
    category: "milestone",
    tier: "silver",
    imageUrl: "/src/assets/badges/milestone-weight-loss.svg",
    locked: true,
    requirements: "Alcanza tu primer objetivo de pérdida de peso",
    shareable: true,
    socialShareImage: "/src/assets/badges/social/milestone-weight-loss.png"
  },
  {
    id: "milestone-muscle-gain",
    name: "Constructor de Músculo",
    description: "Has aumentado tu masa muscular en un 5%",
    category: "milestone",
    tier: "silver",
    imageUrl: "/src/assets/badges/milestone-muscle-gain.svg",
    locked: true,
    progress: 0,
    progressDescription: "0/5% ganancia muscular",
    requirements: "Aumenta tu masa muscular en un 5%",
    shareable: true,
    socialShareImage: "/src/assets/badges/social/milestone-muscle-gain.png"
  },
  {
    id: "milestone-performance",
    name: "Superación Personal",
    description: "Has superado tu récord personal en un ejercicio clave",
    category: "milestone",
    tier: "gold",
    imageUrl: "/src/assets/badges/milestone-performance.svg",
    locked: true,
    requirements: "Supera tu récord personal en un ejercicio clave",
    shareable: true,
    socialShareImage: "/src/assets/badges/social/milestone-performance.png"
  },

  // Special category badges
  {
    id: "special-early-adopter",
    name: "Pionero Fitness",
    description: "Eres uno de los primeros usuarios de Fitness AI",
    category: "special",
    tier: "diamond",
    imageUrl: "/src/assets/badges/special-early-adopter.svg",
    locked: false, // This one starts unlocked for early users
    unlockedAt: new Date().toISOString(),
    requirements: "Únete a Fitness AI durante su fase inicial",
    shareable: true,
    socialShareImage: "/src/assets/badges/social/special-early-adopter.png"
  },
  {
    id: "special-social-sharer",
    name: "Influencer Fitness",
    description: "Has compartido 5 insignias en redes sociales",
    category: "special",
    tier: "platinum",
    imageUrl: "/src/assets/badges/special-social-sharer.svg",
    locked: true,
    progress: 0,
    progressDescription: "0/5 insignias compartidas",
    requirements: "Comparte 5 insignias en redes sociales",
    shareable: true,
    socialShareImage: "/src/assets/badges/social/special-social-sharer.png"
  }
];

/**
 * Get all badges for a specific category
 */
export function getBadgesByCategory(category: string): AchievementBadge[] {
  return ACHIEVEMENT_BADGES.filter(badge => badge.category === category);
}

/**
 * Get a specific badge by ID
 */
export function getBadgeById(id: string): AchievementBadge | undefined {
  return ACHIEVEMENT_BADGES.find(badge => badge.id === id);
}

/**
 * Get all badges organized by category
 */
export function getBadgesByCategories(): Record<string, AchievementBadge[]> {
  const categories: Record<string, AchievementBadge[]> = {};
  
  ACHIEVEMENT_BADGES.forEach(badge => {
    if (!categories[badge.category]) {
      categories[badge.category] = [];
    }
    categories[badge.category].push(badge);
  });
  
  return categories;
}
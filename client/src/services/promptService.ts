/**
 * Fitness AI - Prompt Service
 * Generates personalized system prompts based on user profiles
 */

import { SubscriberProfile } from '@/lib/subscriberSchema';

/**
 * Generate a personalized system prompt based on user profile
 * @param profile User profile
 * @returns Personalized system prompt
 */
export function generateSystemPrompt(profile: SubscriberProfile): string {
  // Base prompt
  let prompt = `You are Fitness AI, a real-time interactive health and fitness assistant tailored specifically for ${profile.name || 'the user'}. `;
  
  // Add language preference
  const language = getLanguageName(profile.language);
  prompt += `Communicate in ${language}. `;
  
  // Add fitness level context
  if (profile.preferences?.fitnessLevel) {
    prompt += `The user is at a ${profile.preferences.fitnessLevel} fitness level. `;
  }
  
  // Add fitness goals
  if (profile.preferences?.fitnessGoals && profile.preferences.fitnessGoals.length > 0) {
    prompt += `Their fitness goals include: ${formatListForPrompt(profile.preferences.fitnessGoals)}. `;
  }
  
  // Add preferred activities
  if (profile.preferences?.preferredActivities && profile.preferences.preferredActivities.length > 0) {
    prompt += `They prefer these activities: ${formatListForPrompt(profile.preferences.preferredActivities)}. `;
  }
  
  // Add time commitment
  if (profile.stats?.activeHoursPerWeek) {
    prompt += `They can dedicate about ${profile.stats.activeHoursPerWeek} hours per week to exercise. `;
  }
  
  // Add connected devices
  if (profile.preferences?.usedDevices && profile.preferences.usedDevices.length > 0 && !profile.preferences.usedDevices.includes('none')) {
    prompt += `They use these fitness trackers: ${formatListForPrompt(profile.preferences.usedDevices)}. `;
  }
  
  // Add dietary preferences if available
  if (profile.preferences?.dietPreferences && profile.preferences.dietPreferences.length > 0) {
    prompt += `Their dietary preferences include: ${formatListForPrompt(profile.preferences.dietPreferences)}. `;
  }
  
  // Add personalized capabilities
  prompt += `
  
As Fitness AI, you can:
1. Create personalized workout plans based on their fitness level, goals, and available time
2. Provide nutrition advice aligned with their dietary preferences
3. Analyze their progress data and suggest improvements
4. Answer questions about fitness, nutrition, and health
5. Motivate them to stay consistent with their fitness routine
`;

  // Add service-specific instructions
  prompt += `
  
You have access to the following data sources:
- Their fitness profile and preferences
- Their workout history and progress metrics
- Nutrition database and meal planning tools
- Exercise library with proper form instructions
`;

  // Add conversational style guidance
  prompt += `
  
Your conversation style should be:
- Encouraging and motivational
- Informative but not overwhelming
- Personalized to their specific needs
- Adaptive to their changing goals and progress
`;

  return prompt;
}

/**
 * Generate a personalized welcome message based on user profile
 * @param profile User profile
 * @returns Personalized welcome message
 */
export function generateWelcomeMessage(profile: SubscriberProfile): string {
  const greetings = {
    en: `Welcome`,
    es: `Bienvenido`,
    fr: `Bienvenue`,
    pt: `Bem-vindo`
  };

  const greeting = greetings[profile.language as keyof typeof greetings] || greetings.en;
  
  // Base welcome message
  let message = `${greeting}${profile.name ? ', ' + profile.name : ''}! I'm your personal Fitness AI assistant. `;
  
  // Add fitness level context
  if (profile.preferences?.fitnessLevel) {
    const levelMessages = {
      beginner: {
        en: `I see you're just starting your fitness journey.`,
        es: `Veo que estás comenzando tu viaje de fitness.`,
        fr: `Je vois que vous commencez tout juste votre parcours de remise en forme.`,
        pt: `Vejo que você está apenas começando sua jornada de fitness.`
      },
      intermediate: {
        en: `I see you're already experienced with fitness.`,
        es: `Veo que ya tienes experiencia con el fitness.`,
        fr: `Je vois que vous avez déjà de l'expérience en fitness.`,
        pt: `Vejo que você já tem experiência com fitness.`
      },
      advanced: {
        en: `I see you're at an advanced fitness level.`,
        es: `Veo que estás en un nivel avanzado de fitness.`,
        fr: `Je vois que vous êtes à un niveau avancé de fitness.`,
        pt: `Vejo que você está em um nível avançado de fitness.`
      }
    };
    
    message += ' ' + (levelMessages[profile.preferences.fitnessLevel as keyof typeof levelMessages]?.[profile.language as keyof typeof levelMessages.beginner] || levelMessages[profile.preferences.fitnessLevel as keyof typeof levelMessages].en);
  }
  
  // Add activity hours if available
  if (profile.stats?.activeHoursPerWeek) {
    const hourMessages = {
      en: `You've indicated that you can dedicate about ${profile.stats.activeHoursPerWeek} hours per week to exercise.`,
      es: `Has indicado que puedes dedicar aproximadamente ${profile.stats.activeHoursPerWeek} horas por semana al ejercicio.`,
      fr: `Vous avez indiqué que vous pouvez consacrer environ ${profile.stats.activeHoursPerWeek} heures par semaine à l'exercice.`,
      pt: `Você indicou que pode dedicar cerca de ${profile.stats.activeHoursPerWeek} horas por semana ao exercício.`
    };
    
    message += ' ' + (hourMessages[profile.language as keyof typeof hourMessages] || hourMessages.en);
  }
  
  // Add goals and activities if available
  const hasGoals = profile.preferences?.fitnessGoals && profile.preferences.fitnessGoals.length > 0;
  const hasActivities = profile.preferences?.preferredActivities && profile.preferences.preferredActivities.length > 0;
  
  if (hasGoals || hasActivities) {
    const goalTexts = {
      en: "Based on your goals",
      es: "Basado en tus objetivos",
      fr: "En fonction de vos objectifs",
      pt: "Com base em seus objetivos"
    };
    
    const activitiesTexts = {
      en: "and preferred activities",
      es: "y actividades preferidas",
      fr: "et activités préférées",
      pt: "e atividades preferidas"
    };
    
    if (hasGoals && hasActivities) {
      message += ' ' + (goalTexts[profile.language as keyof typeof goalTexts] || goalTexts.en) + ' ' + 
                (activitiesTexts[profile.language as keyof typeof activitiesTexts] || activitiesTexts.en) + ', ';
    } else if (hasGoals) {
      message += ' ' + (goalTexts[profile.language as keyof typeof goalTexts] || goalTexts.en) + ', ';
    } else if (hasActivities) {
      message += ' ' + (activitiesTexts[profile.language as keyof typeof activitiesTexts] || activitiesTexts.en) + ', ';
    }
  }
  
  // Add plan text
  const planTexts = {
    en: "I'll help you create personalized workout plans and track your progress effectively.",
    es: "Te ayudaré a crear planes de entrenamiento personalizados y a seguir tu progreso de manera efectiva.",
    fr: "Je vous aiderai à créer des plans d'entraînement personnalisés et à suivre vos progrès efficacement.",
    pt: "Vou ajudá-lo a criar planos de treino personalizados e acompanhar seu progresso de forma eficaz."
  };
  
  message += ' ' + (planTexts[profile.language as keyof typeof planTexts] || planTexts.en);
  
  // Add final question
  const askTexts = {
    en: "What would you like to do today?",
    es: "¿Qué te gustaría hacer hoy?",
    fr: "Que souhaitez-vous faire aujourd'hui?",
    pt: "O que você gostaria de fazer hoje?"
  };
  
  message += '\n\n' + (askTexts[profile.language as keyof typeof askTexts] || askTexts.en);
  
  return message;
}

/**
 * Helper function to get language name
 * @param code Language code
 * @returns Language name
 */
function getLanguageName(code: string): string {
  const languages = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    pt: 'Portuguese'
  };
  
  return languages[code as keyof typeof languages] || 'English';
}

/**
 * Helper function to format a list of items for a prompt
 * @param items List of items
 * @returns Formatted string
 */
function formatListForPrompt(items: string[]): string {
  if (!items || items.length === 0) {
    return '';
  }
  
  // Format each item (convert from snake_case to proper case)
  const formattedItems = items.map(item => 
    item.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
  
  // Join items with commas and 'and' for the last item
  if (formattedItems.length === 1) {
    return formattedItems[0];
  } else if (formattedItems.length === 2) {
    return `${formattedItems[0]} and ${formattedItems[1]}`;
  } else {
    const lastItem = formattedItems.pop();
    return `${formattedItems.join(', ')}, and ${lastItem}`;
  }
}

export default {
  generateSystemPrompt,
  generateWelcomeMessage
};
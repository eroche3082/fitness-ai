/**
 * Stripe payment service for Fitness AI
 * Handles premium level unlocking via payment
 */

/**
 * Creates a checkout session for level unlocking
 * @param levelId The ID of the level to unlock
 * @param userCode The user's unique access code
 * @returns The URL to redirect to for checkout
 */
export async function createCheckoutSession(levelId: string, userCode: string): Promise<string> {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        levelId,
        userCode,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Validates if a session was completed successfully
 * @param sessionId The Stripe session ID
 * @returns Whether the payment was successful
 */
export async function validateCheckoutSession(sessionId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/validate-checkout-session?session_id=${sessionId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to validate checkout session');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error validating checkout session:', error);
    return false;
  }
}

/**
 * Retrieves premium level details
 * @returns Array of available premium levels
 */
export async function getPremiumLevels(): Promise<PremiumLevel[]> {
  // For demonstration purposes, returning mock data
  // In production, this would be fetched from an API
  return [
    {
      id: 'level-4',
      name: 'Advanced Training Insights',
      description: 'Unlock detailed analytics and AI-powered training recommendations',
      price: 9.99,
      features: [
        'Personalized workout suggestions',
        'Recovery optimization insights',
        'Advanced performance metrics',
        'Video form analysis',
      ],
      requiredLevel: 'INT',
    },
    {
      id: 'level-5',
      name: 'Premium Coaching Access',
      description: 'One-on-one virtual coaching sessions with professional trainers',
      price: 19.99,
      features: [
        'Monthly virtual coaching session',
        'Personalized workout calendar',
        'Nutrition guidance',
        'Priority support',
      ],
      requiredLevel: 'ADV',
    },
    {
      id: 'level-6',
      name: 'Elite Athlete Program',
      description: 'Comprehensive training program for serious athletes',
      price: 29.99,
      features: [
        'Weekly professional coaching check-ins',
        'Competition preparation',
        'Advanced periodization',
        'Recovery protocols',
        'Elite community access',
      ],
      requiredLevel: 'PRO',
    },
  ];
}

/**
 * Interface for premium level information
 */
export interface PremiumLevel {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  requiredLevel: string;
}
/**
 * Stripe payment service
 * Handles Stripe checkout sessions and payment processing
 */
import Stripe from 'stripe';
import { IStorage } from '../storage';

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  : null;

/**
 * Premium level mapping for prices
 */
const PREMIUM_LEVELS = {
  'level-4': {
    name: 'Advanced Training Insights',
    priceId: process.env.STRIPE_PRICE_LEVEL_4 || 'price_placeholder',
    amount: 999, // $9.99
  },
  'level-5': {
    name: 'Premium Coaching Access',
    priceId: process.env.STRIPE_PRICE_LEVEL_5 || 'price_placeholder',
    amount: 1999, // $19.99
  },
  'level-6': {
    name: 'Elite Athlete Program',
    priceId: process.env.STRIPE_PRICE_LEVEL_6 || 'price_placeholder',
    amount: 2999, // $29.99
  },
};

/**
 * Creates a checkout session for premium level purchase
 * @param levelId The ID of the level to purchase
 * @param userCode The user's access code
 * @param storage Storage service to get/update user data
 * @returns URL to redirect to for checkout
 */
export async function createCheckoutSession(
  levelId: string, 
  userCode: string,
  storage: IStorage
): Promise<string> {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
  }
  
  if (!PREMIUM_LEVELS[levelId]) {
    throw new Error(`Invalid level ID: ${levelId}`);
  }
  
  // Get user profile for the access code
  const user = await storage.getUserByAccessCode(userCode);
  if (!user) {
    throw new Error(`User not found for access code: ${userCode}`);
  }
  
  const level = PREMIUM_LEVELS[levelId];
  const domain = process.env.DOMAIN || `http://localhost:${process.env.PORT || 3000}`;
  
  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: level.name,
            description: `Unlock ${level.name} on Fitness AI`,
          },
          unit_amount: level.amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${domain}/dashboard?code=${userCode}&success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domain}/dashboard?code=${userCode}&cancel=true`,
    metadata: {
      levelId,
      userCode,
      userId: user.id,
    },
  });
  
  return session.url || '';
}

/**
 * Validates a checkout session and updates user's unlocked levels
 * @param sessionId The Stripe checkout session ID
 * @param storage Storage service to update user data
 * @returns Success status and updated user data
 */
export async function validateCheckoutSession(
  sessionId: string,
  storage: IStorage
): Promise<{ success: boolean; user?: any }> {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
  }
  
  // Retrieve session from Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  
  if (session.payment_status !== 'paid') {
    return { success: false };
  }
  
  const { levelId, userCode, userId } = session.metadata || {};
  
  if (!levelId || !userCode || !userId) {
    return { success: false };
  }
  
  // Update user profile with unlocked level
  const user = await storage.getUserById(userId);
  if (!user) {
    return { success: false };
  }
  
  const unlockedLevels = [...(user.unlockedLevels || [])];
  if (!unlockedLevels.includes(levelId)) {
    unlockedLevels.push(levelId);
  }
  
  // Update user with unlocked level and payment status
  const updatedUser = await storage.updateUser(userId, {
    unlockedLevels,
    paymentStatus: 'paid',
    stripePaymentId: session.payment_intent as string,
  });
  
  return {
    success: true,
    user: updatedUser,
  };
}

/**
 * Handles Stripe webhook events
 * @param event Stripe webhook event
 * @param storage Storage service to update user data
 * @returns Success status
 */
export async function handleStripeWebhook(
  event: Stripe.Event,
  storage: IStorage
): Promise<{ success: boolean }> {
  if (!stripe) {
    throw new Error('Stripe is not configured.');
  }
  
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      if (session.payment_status === 'paid') {
        const { levelId, userCode, userId } = session.metadata || {};
        
        if (!levelId || !userCode || !userId) {
          return { success: false };
        }
        
        // Update user profile with unlocked level
        const user = await storage.getUserById(userId);
        if (!user) {
          return { success: false };
        }
        
        const unlockedLevels = [...(user.unlockedLevels || [])];
        if (!unlockedLevels.includes(levelId)) {
          unlockedLevels.push(levelId);
        }
        
        // Update user with unlocked level and payment status
        await storage.updateUser(userId, {
          unlockedLevels,
          paymentStatus: 'paid',
          stripePaymentId: session.payment_intent as string,
        });
      }
      
      return { success: true };
    }
    
    default:
      return { success: true };
  }
}
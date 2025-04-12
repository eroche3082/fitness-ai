/**
 * Utility functions for fitness tracker services
 */

// In a real app, this would interact with a database to store and retrieve tokens
// For this prototype, we'll use an in-memory store

interface ServiceToken {
  serviceId: string;
  userId: number;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  lastSyncDate?: string;
}

// In-memory token storage
const serviceTokens: Map<string, ServiceToken> = new Map();

/**
 * Store a service token for a user
 * @param userId User ID
 * @param serviceId Service identifier (e.g., 'google-fit')
 * @param token Token data
 */
export async function storeServiceToken(
  userId: number,
  serviceId: string,
  token: Omit<ServiceToken, 'userId' | 'serviceId'>
): Promise<ServiceToken> {
  const tokenKey = `${userId}:${serviceId}`;
  const serviceToken: ServiceToken = {
    userId,
    serviceId,
    ...token
  };
  
  serviceTokens.set(tokenKey, serviceToken);
  console.log(`Stored token for user ${userId} and service ${serviceId}`);
  
  return serviceToken;
}

/**
 * Get a service token for a user
 * @param userId User ID
 * @param serviceId Service identifier (e.g., 'google-fit')
 */
export async function getServiceToken(
  userId: number,
  serviceId: string
): Promise<ServiceToken | null> {
  const tokenKey = `${userId}:${serviceId}`;
  const token = serviceTokens.get(tokenKey);
  
  return token || null;
}

/**
 * Update token with the last sync date
 * @param userId User ID
 * @param serviceId Service identifier (e.g., 'google-fit')
 */
export async function updateLastSyncDate(
  userId: number,
  serviceId: string
): Promise<ServiceToken | null> {
  const token = await getServiceToken(userId, serviceId);
  
  if (!token) {
    return null;
  }
  
  const updatedToken: ServiceToken = {
    ...token,
    lastSyncDate: new Date().toISOString()
  };
  
  return await storeServiceToken(userId, serviceId, updatedToken);
}

/**
 * Delete a service token for a user
 * @param userId User ID
 * @param serviceId Service identifier (e.g., 'google-fit')
 */
export async function deleteServiceToken(
  userId: number,
  serviceId: string
): Promise<boolean> {
  const tokenKey = `${userId}:${serviceId}`;
  return serviceTokens.delete(tokenKey);
}

/**
 * Test all integrations for a user
 * @param userId User ID
 */
export async function testAllIntegrations(userId: number): Promise<any> {
  // For now, we'll just return a static result indicating which services are connected
  // In a real implementation, this would test the actual connections
  
  const services = ['google-fit', 'apple-health', 'fitbit', 'strava'];
  const results: any = {};
  
  for (const serviceId of services) {
    try {
      const token = await getServiceToken(userId, serviceId);
      
      results[serviceId] = {
        service: serviceId,
        connected: !!token,
        lastSync: token?.lastSyncDate || null,
        error: null
      };
    } catch (error) {
      results[serviceId] = {
        service: serviceId,
        connected: false,
        lastSync: null,
        error: (error as Error).message
      };
    }
  }
  
  return results;
}
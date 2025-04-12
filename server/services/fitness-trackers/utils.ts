/**
 * Utility functions for fitness tracker services
 */
import { firebaseAdmin, isFirebaseInitialized } from '../../google-cloud-config';

interface ServiceToken {
  serviceId: string;
  userId: number;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  lastSyncDate?: string;
}

// We'll use both Firebase and in-memory storage for flexibility
// In-memory token storage as fallback
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
  
  // Store in-memory for fallback
  serviceTokens.set(tokenKey, serviceToken);
  
  // Try to store in Firebase if available
  if (isFirebaseInitialized && firebaseAdmin) {
    try {
      const firestore = firebaseAdmin.firestore();
      await firestore
        .collection('fitness-tokens')
        .doc(userId.toString())
        .collection('services')
        .doc(serviceId)
        .set(serviceToken);
      
      console.log(`Stored token in Firebase for user ${userId} and service ${serviceId}`);
    } catch (error) {
      console.error(`Failed to store token in Firebase for user ${userId} and service ${serviceId}:`, error);
      // Continue with in-memory storage as fallback
    }
  }
  
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
  // Try to retrieve from Firebase first
  if (isFirebaseInitialized && firebaseAdmin) {
    try {
      const firestore = firebaseAdmin.firestore();
      const tokenDoc = await firestore
        .collection('fitness-tokens')
        .doc(userId.toString())
        .collection('services')
        .doc(serviceId)
        .get();
      
      if (tokenDoc.exists) {
        return tokenDoc.data() as ServiceToken;
      }
    } catch (error) {
      console.error(`Failed to retrieve token from Firebase for user ${userId} and service ${serviceId}:`, error);
      // Fall back to in-memory storage
    }
  }
  
  // Fallback to in-memory storage
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
  
  // Also update sync status in Firebase under /fitness/userId/trackerName path
  if (isFirebaseInitialized && firebaseAdmin) {
    try {
      const firestore = firebaseAdmin.firestore();
      // Update sync metadata
      await firestore
        .collection('fitness')
        .doc(userId.toString())
        .collection(serviceId)
        .doc('metadata')
        .set({
          lastSyncDate: new Date().toISOString(),
          status: 'active'
        }, { merge: true });
      
      console.log(`Updated sync status in Firebase for user ${userId} and service ${serviceId}`);
    } catch (error) {
      console.error(`Failed to update sync status in Firebase for user ${userId} and service ${serviceId}:`, error);
    }
  }
  
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
  
  // Try to delete from Firebase first
  if (isFirebaseInitialized && firebaseAdmin) {
    try {
      const firestore = firebaseAdmin.firestore();
      // Delete the token
      await firestore
        .collection('fitness-tokens')
        .doc(userId.toString())
        .collection('services')
        .doc(serviceId)
        .delete();
      
      // Update service metadata to show disconnected status
      await firestore
        .collection('fitness')
        .doc(userId.toString())
        .collection(serviceId)
        .doc('metadata')
        .set({
          status: 'disconnected',
          disconnectedAt: new Date().toISOString()
        }, { merge: true });
      
      console.log(`Deleted token from Firebase for user ${userId} and service ${serviceId}`);
    } catch (error) {
      console.error(`Failed to delete token from Firebase for user ${userId} and service ${serviceId}:`, error);
    }
  }
  
  // Also delete from in-memory storage
  return serviceTokens.delete(tokenKey);
}

/**
 * Test all integrations for a user
 * @param userId User ID
 */
export async function testAllIntegrations(userId: number): Promise<any> {
  const services = ['google-fit', 'apple-health', 'fitbit', 'strava'];
  const results: any = {};
  
  for (const serviceId of services) {
    try {
      const token = await getServiceToken(userId, serviceId);
      let firebaseData = null;
      
      // Check Firebase for synced data
      if (isFirebaseInitialized && firebaseAdmin) {
        try {
          const firestore = firebaseAdmin.firestore();
          
          // Get metadata for this tracker
          const metadataDoc = await firestore
            .collection('fitness')
            .doc(userId.toString())
            .collection(serviceId)
            .doc('metadata')
            .get();
          
          if (metadataDoc.exists) {
            firebaseData = {
              ...metadataDoc.data(),
              hasSyncedData: true
            };
            
            // Get available data types
            const dataTypeCollection = await firestore
              .collection('fitness')
              .doc(userId.toString())
              .collection(serviceId)
              .listDocuments();
            
            const dataTypes = dataTypeCollection
              .map(doc => doc.id)
              .filter(id => id !== 'metadata');
            
            if (dataTypes.length > 0) {
              firebaseData.dataTypes = dataTypes;
            }
          }
        } catch (error) {
          console.error(`Error checking Firebase for user ${userId} and service ${serviceId}:`, error);
        }
      }
      
      results[serviceId] = {
        service: serviceId,
        connected: !!token,
        lastSync: token?.lastSyncDate || null,
        syncedData: firebaseData || null,
        error: null
      };
    } catch (error) {
      results[serviceId] = {
        service: serviceId,
        connected: false,
        lastSync: null,
        syncedData: null,
        error: (error as Error).message
      };
    }
  }
  
  return results;
}
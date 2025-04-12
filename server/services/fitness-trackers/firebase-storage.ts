/**
 * Firebase Storage Module for Fitness Tracker Data
 * 
 * This module handles storing fitness tracker data in Firebase
 * under `/fitness/userId/trackerName` path structure.
 */

import { firebaseAdmin, isFirebaseInitialized } from '../../google-cloud-config';
import { notifyUser } from './initialize';

interface FitnessData {
  timestamp: string;
  dataType: string;
  source: string;
  value: any;
  unit?: string;
  startTime?: string;
  endTime?: string;
}

/**
 * Store fitness data for a specific user and tracker in Firebase
 * Path structure: /fitness/{userId}/{trackerName}/{dataType}/{timestamp}
 */
export async function storeFitnessData(
  userId: number,
  trackerName: string,
  dataType: string,
  data: any
): Promise<boolean> {
  try {
    if (!isFirebaseInitialized || !firebaseAdmin) {
      console.error('Firebase not initialized. Cannot store fitness data.');
      return false;
    }

    const firestore = firebaseAdmin.firestore();
    const timestamp = new Date().toISOString();
    
    // Prepare data object with metadata
    const fitnessData: FitnessData = {
      timestamp,
      dataType,
      source: trackerName,
      value: data,
    };

    // Define path structure: /fitness/{userId}/{trackerName}/{dataType}/{timestamp}
    await firestore
      .collection('fitness')
      .doc(userId.toString())
      .collection(trackerName)
      .doc(dataType)
      .collection('records')
      .doc(timestamp)
      .set(fitnessData);
    
    // Also update the latest data reference
    await firestore
      .collection('fitness')
      .doc(userId.toString())
      .collection(trackerName)
      .doc(dataType)
      .set({
        lastUpdated: timestamp,
        lastValue: data
      }, { merge: true });
    
    console.log(`Stored ${dataType} data for user ${userId} from ${trackerName}`);
    
    // Notify the user that data was synced
    notifyUser(userId, {
      type: 'success',
      message: `Successfully synced ${dataType} data from ${trackerName}`,
      details: { trackerName, dataType, timestamp }
    });
    
    return true;
  } catch (error) {
    console.error(`Error storing fitness data for user ${userId} from ${trackerName}:`, error);
    return false;
  }
}

/**
 * Retrieve the latest fitness data for a specific user and tracker
 */
export async function getLatestFitnessData(
  userId: number,
  trackerName: string,
  dataType: string
): Promise<any> {
  try {
    if (!isFirebaseInitialized || !firebaseAdmin) {
      console.error('Firebase not initialized. Cannot retrieve fitness data.');
      return null;
    }

    const firestore = firebaseAdmin.firestore();
    
    const latestRef = await firestore
      .collection('fitness')
      .doc(userId.toString())
      .collection(trackerName)
      .doc(dataType)
      .get();
    
    if (!latestRef.exists) {
      return null;
    }
    
    return latestRef.data();
  } catch (error) {
    console.error(`Error retrieving fitness data for user ${userId} from ${trackerName}:`, error);
    return null;
  }
}

/**
 * Retrieve all fitness data for a specific user and tracker
 */
export async function getAllFitnessData(
  userId: number,
  trackerName: string,
  dataType: string,
  limit: number = 50
): Promise<FitnessData[]> {
  try {
    if (!isFirebaseInitialized || !firebaseAdmin) {
      console.error('Firebase not initialized. Cannot retrieve fitness data.');
      return [];
    }

    const firestore = firebaseAdmin.firestore();
    
    const recordsRef = await firestore
      .collection('fitness')
      .doc(userId.toString())
      .collection(trackerName)
      .doc(dataType)
      .collection('records')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();
    
    if (recordsRef.empty) {
      return [];
    }
    
    return recordsRef.docs.map(doc => doc.data() as FitnessData);
  } catch (error) {
    console.error(`Error retrieving fitness data for user ${userId} from ${trackerName}:`, error);
    return [];
  }
}

/**
 * Get the sync status of all trackers for a user
 */
export async function getFitnessTrackerSyncStatus(userId: number): Promise<Record<string, any>> {
  try {
    if (!isFirebaseInitialized || !firebaseAdmin) {
      console.error('Firebase not initialized. Cannot retrieve fitness sync status.');
      return {};
    }

    const firestore = firebaseAdmin.firestore();
    
    const userRef = await firestore
      .collection('fitness')
      .doc(userId.toString())
      .get();
    
    if (!userRef.exists) {
      return {};
    }
    
    // Get all tracker collections
    const trackerCollections = await firestore
      .collection('fitness')
      .doc(userId.toString())
      .listCollections();
    
    const status: Record<string, any> = {};
    
    for (const trackerCollection of trackerCollections) {
      const trackerName = trackerCollection.id;
      
      // Get all data types for this tracker
      const dataTypeDocs = await trackerCollection.listDocuments();
      const dataTypes: Record<string, any> = {};
      
      for (const dataTypeDoc of dataTypeDocs) {
        const dataType = dataTypeDoc.id;
        const dataTypeSnapshot = await dataTypeDoc.get();
        
        if (dataTypeSnapshot.exists) {
          dataTypes[dataType] = dataTypeSnapshot.data();
        }
      }
      
      status[trackerName] = {
        connected: true,
        dataTypes
      };
    }
    
    return status;
  } catch (error) {
    console.error(`Error retrieving fitness sync status for user ${userId}:`, error);
    return {};
  }
}
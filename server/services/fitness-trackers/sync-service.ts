/**
 * Fitness Data Synchronization Service
 * 
 * This service handles synchronizing fitness data from connected trackers
 * to the Firebase database under /fitness/userId/trackerName/
 */

import { getServiceToken, updateLastSyncDate } from './utils';
import { storeFitnessData, getLatestFitnessData } from './firebase-storage';
import { notifyUser } from './initialize';
import { storage } from '../../storage';

interface SyncOptions {
  userId: number;
  serviceId: string;
  dataTypes?: string[];
  startDate?: string;
  endDate?: string;
  forceRefresh?: boolean;
}

interface SyncResult {
  serviceId: string;
  success: boolean;
  dataTypes: {
    [key: string]: {
      synced: boolean;
      count: number;
      lastSynced?: string;
      error?: string;
    }
  };
  timestamp: string;
  error?: string;
}

/**
 * Synchronize fitness data from a specific service to Firebase
 */
export async function syncFitnessData(options: SyncOptions): Promise<SyncResult> {
  const { userId, serviceId, dataTypes = [], startDate, endDate, forceRefresh = false } = options;
  const timestamp = new Date().toISOString();
  
  console.log(`Synchronizing ${serviceId} data for user ${userId}`);
  
  try {
    // Check if the service is connected
    const token = await getServiceToken(userId, serviceId);
    
    if (!token) {
      return {
        serviceId,
        success: false,
        dataTypes: {},
        timestamp,
        error: `Service ${serviceId} is not connected for user ${userId}`
      };
    }
    
    // Determine which data types to sync
    const typesToSync = dataTypes.length > 0 ? dataTypes : getDefaultDataTypes(serviceId);
    const result: SyncResult = {
      serviceId,
      success: false,
      dataTypes: {},
      timestamp
    };
    
    let anySuccess = false;
    
    // Sync each data type
    for (const dataType of typesToSync) {
      try {
        // Get data from the appropriate service adapter
        const data = await getDataFromService(userId, serviceId, dataType, startDate, endDate);
        
        if (data) {
          // Store the data in Firebase
          const stored = await storeFitnessData(userId, serviceId, dataType, data);
          
          result.dataTypes[dataType] = {
            synced: stored,
            count: Array.isArray(data) ? data.length : 1,
            lastSynced: timestamp
          };
          
          if (stored) {
            anySuccess = true;
          }
        } else {
          result.dataTypes[dataType] = {
            synced: false,
            count: 0,
            error: `No data available for ${dataType}`
          };
        }
      } catch (error) {
        result.dataTypes[dataType] = {
          synced: false,
          count: 0,
          error: (error as Error).message
        };
      }
    }
    
    // Update the last sync date if any data type was successfully synced
    if (anySuccess) {
      await updateLastSyncDate(userId, serviceId);
      result.success = true;
      
      // Notify the user about the successful sync
      notifyUser(userId, {
        type: 'success',
        message: `Successfully synced ${Object.keys(result.dataTypes).filter(key => result.dataTypes[key].synced).length} data types from ${serviceId}`,
        details: result
      });
    }
    
    return result;
  } catch (error) {
    console.error(`Error synchronizing ${serviceId} data for user ${userId}:`, error);
    
    return {
      serviceId,
      success: false,
      dataTypes: {},
      timestamp,
      error: (error as Error).message
    };
  }
}

/**
 * Get default data types for a specific service
 */
function getDefaultDataTypes(serviceId: string): string[] {
  switch (serviceId) {
    case 'google-fit':
      return ['steps', 'calories', 'distance', 'heartRate', 'activeMinutes'];
    case 'apple-health':
      return ['steps', 'calories', 'distance', 'heartRate', 'sleep', 'workout'];
    case 'fitbit':
      return ['steps', 'calories', 'distance', 'heartRate', 'sleep', 'floors'];
    case 'strava':
      return ['activities', 'workout', 'distance', 'calories'];
    default:
      return ['steps', 'calories'];
  }
}

/**
 * Get data from the appropriate service adapter
 * 
 * This function would dispatch to the appropriate service's API
 * For now, we'll simulate data for testing purposes
 */
async function getDataFromService(
  userId: number,
  serviceId: string,
  dataType: string,
  startDate?: string,
  endDate?: string
): Promise<any> {
  // In a production implementation, this would call the actual API endpoints
  // of the respective fitness trackers
  
  // Format dates or use defaults
  const start = startDate || formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const end = endDate || formatDate(new Date());
  
  // For now, generate some sample data for testing
  // In a production environment, these would be adapted to each fitness tracker's API
  switch (dataType) {
    case 'steps':
      return {
        startDate: start,
        endDate: end,
        total: Math.floor(Math.random() * 50000) + 10000,
        daily: generateDailyData(start, end, 5000, 15000)
      };
    case 'calories':
      return {
        startDate: start,
        endDate: end,
        total: Math.floor(Math.random() * 5000) + 1000,
        daily: generateDailyData(start, end, 1000, 3000)
      };
    case 'distance':
      return {
        startDate: start,
        endDate: end,
        total: (Math.random() * 50 + 10).toFixed(2),
        unit: 'km',
        daily: generateDailyDistanceData(start, end, 1, 10)
      };
    case 'heartRate':
      return {
        startDate: start,
        endDate: end,
        average: Math.floor(Math.random() * 30) + 60,
        min: Math.floor(Math.random() * 20) + 50,
        max: Math.floor(Math.random() * 40) + 120,
        zones: generateHeartRateZones()
      };
    case 'sleep':
      return {
        startDate: start,
        endDate: end,
        averageDuration: 7 + Math.random() * 2,
        records: generateSleepData(start, end)
      };
    case 'activeMinutes':
      return {
        startDate: start,
        endDate: end,
        total: Math.floor(Math.random() * 1000) + 200,
        daily: generateDailyData(start, end, 20, 120)
      };
    case 'workout':
      return {
        startDate: start,
        endDate: end,
        count: Math.floor(Math.random() * 10) + 2,
        workouts: generateWorkoutData(start, end)
      };
    case 'activities':
      return {
        startDate: start,
        endDate: end,
        count: Math.floor(Math.random() * 15) + 3,
        activities: generateActivityData(start, end)
      };
    case 'floors':
      return {
        startDate: start,
        endDate: end,
        total: Math.floor(Math.random() * 100) + 20,
        daily: generateDailyData(start, end, 5, 30)
      };
    default:
      return null;
  }
}

// Helper functions for generating sample data
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function generateDailyData(startDate: string, endDate: string, min: number, max: number): Record<string, number> {
  const result: Record<string, number> = {};
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dayMilliseconds = 24 * 60 * 60 * 1000;
  
  for (let date = new Date(start); date <= end; date = new Date(date.getTime() + dayMilliseconds)) {
    const formattedDate = formatDate(date);
    result[formattedDate] = Math.floor(Math.random() * (max - min)) + min;
  }
  
  return result;
}

function generateDailyDistanceData(startDate: string, endDate: string, min: number, max: number): Record<string, string> {
  const result: Record<string, string> = {};
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dayMilliseconds = 24 * 60 * 60 * 1000;
  
  for (let date = new Date(start); date <= end; date = new Date(date.getTime() + dayMilliseconds)) {
    const formattedDate = formatDate(date);
    result[formattedDate] = (Math.random() * (max - min) + min).toFixed(2);
  }
  
  return result;
}

function generateHeartRateZones(): Record<string, number> {
  return {
    rest: Math.floor(Math.random() * 20) + 50,
    fatBurn: Math.floor(Math.random() * 10) + 100,
    cardio: Math.floor(Math.random() * 20) + 130,
    peak: Math.floor(Math.random() * 15) + 160
  };
}

function generateSleepData(startDate: string, endDate: string): any[] {
  const records = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dayMilliseconds = 24 * 60 * 60 * 1000;
  
  for (let date = new Date(start); date <= end; date = new Date(date.getTime() + dayMilliseconds)) {
    const formattedDate = formatDate(date);
    
    records.push({
      date: formattedDate,
      duration: (6 + Math.random() * 3).toFixed(1),
      efficiency: Math.floor(Math.random() * 30) + 70,
      stages: {
        deep: Math.floor(Math.random() * 20) + 10,
        light: Math.floor(Math.random() * 30) + 40,
        rem: Math.floor(Math.random() * 15) + 15,
        awake: Math.floor(Math.random() * 10) + 5
      }
    });
  }
  
  return records;
}

function generateWorkoutData(startDate: string, endDate: string): any[] {
  const workouts = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dayMilliseconds = 24 * 60 * 60 * 1000;
  const workoutTypes = ['Running', 'Cycling', 'Swimming', 'Walking', 'Weight Training', 'HIIT', 'Yoga'];
  
  const count = Math.floor(Math.random() * 10) + 2;
  const workoutDates = [];
  
  // Generate random dates within the range
  for (let i = 0; i < count; i++) {
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    workoutDates.push(new Date(randomTime));
  }
  
  // Sort dates
  workoutDates.sort((a, b) => a.getTime() - b.getTime());
  
  // Generate workout data for each date
  for (const date of workoutDates) {
    const formattedDate = formatDate(date);
    const workoutType = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
    
    workouts.push({
      date: formattedDate,
      type: workoutType,
      duration: Math.floor(Math.random() * 60) + 20,
      calories: Math.floor(Math.random() * 500) + 100,
      distance: workoutType === 'Running' || workoutType === 'Cycling' || workoutType === 'Swimming' || workoutType === 'Walking'
        ? (Math.random() * 10 + 1).toFixed(2)
        : null,
      averageHeartRate: Math.floor(Math.random() * 40) + 110
    });
  }
  
  return workouts;
}

function generateActivityData(startDate: string, endDate: string): any[] {
  const activities = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const activityTypes = ['Running', 'Cycling', 'Swimming', 'Walking', 'Hiking', 'Rowing', 'Elliptical'];
  
  const count = Math.floor(Math.random() * 15) + 3;
  const activityDates = [];
  
  // Generate random dates within the range
  for (let i = 0; i < count; i++) {
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    activityDates.push(new Date(randomTime));
  }
  
  // Sort dates
  activityDates.sort((a, b) => a.getTime() - b.getTime());
  
  // Generate activity data for each date
  for (const date of activityDates) {
    const formattedDate = formatDate(date);
    const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    
    activities.push({
      date: formattedDate,
      type: activityType,
      duration: Math.floor(Math.random() * 120) + 15,
      distance: (Math.random() * 20 + 1).toFixed(2),
      elevationGain: activityType === 'Hiking' || activityType === 'Cycling'
        ? Math.floor(Math.random() * 1000) + 100
        : null,
      averageSpeed: (Math.random() * 15 + 5).toFixed(1),
      calories: Math.floor(Math.random() * 800) + 200
    });
  }
  
  return activities;
}
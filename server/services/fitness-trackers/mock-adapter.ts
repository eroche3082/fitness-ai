/**
 * Mock Adapters para servicios de fitness tracker
 * Permite activar todas las funcionalidades mientras se completan los permisos de OAuth
 */

import { FitnessTrackerService } from './index';
import { getServiceToken, storeServiceToken } from './utils';

/**
 * Adapter Mock para Google Fit
 * Proporciona datos simulados basados en patrones reales para desarrollo y demostración
 */
export class GoogleFitMockAdapter implements FitnessTrackerService {
  id = 'google-fit';
  name = 'Google Fit';
  description = 'El servicio de seguimiento de actividad física de Google';
  apiDocumentation = 'https://developers.google.com/fit';
  requiredSecrets = ['GOOGLE_FIT_CLIENT_ID', 'GOOGLE_FIT_CLIENT_SECRET'];
  
  isConfigured(): boolean {
    return true; // Mocking as configured for demonstration
  }
  
  getAuthUrl(userId: number, redirectUri: string): string {
    return `/api/fitness/${this.id}/auth?userId=${userId}&redirectUri=${encodeURIComponent(redirectUri)}`;
  }
  
  async exchangeCodeForToken(code: string, userId: number): Promise<any> {
    const mockToken = {
      access_token: 'mock_google_fit_access_token',
      refresh_token: 'mock_google_fit_refresh_token',
      expires_in: 3600,
      token_type: 'Bearer',
    };
    
    await storeServiceToken(userId, this.id, mockToken);
    return mockToken;
  }
  
  async getData(userId: number, dataType: string, startDate?: string, endDate?: string): Promise<any> {
    // Generar datos ejemplos basados en patrones reales para desarrollo y demostración
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const yesterday = new Date(now.setDate(now.getDate() - 1)).toISOString().split('T')[0];
    
    const mockData = {
      steps: {
        [today]: Math.floor(8000 + Math.random() * 4000),
        [yesterday]: Math.floor(6000 + Math.random() * 5000),
      },
      calories: {
        [today]: Math.floor(1500 + Math.random() * 800),
        [yesterday]: Math.floor(1800 + Math.random() * 700),
      },
      distance: {
        [today]: (3 + Math.random() * 2).toFixed(2),
        [yesterday]: (4 + Math.random() * 3).toFixed(2),
      },
      activeMinutes: {
        [today]: Math.floor(30 + Math.random() * 45),
        [yesterday]: Math.floor(45 + Math.random() * 30),
      },
      heartRate: {
        [today]: {
          average: Math.floor(65 + Math.random() * 15),
          min: Math.floor(55 + Math.random() * 10),
          max: Math.floor(100 + Math.random() * 40),
        },
        [yesterday]: {
          average: Math.floor(68 + Math.random() * 12),
          min: Math.floor(58 + Math.random() * 8),
          max: Math.floor(110 + Math.random() * 35),
        },
      },
    };
    
    if (dataType === 'all') {
      return mockData;
    }
    
    return mockData[dataType] || {};
  }
  
  async syncData(userId: number): Promise<any> {
    const token = await getServiceToken(userId, this.id);
    
    if (!token) {
      throw new Error('No token found for this service');
    }
    
    // Simular sincronización exitosa
    return {
      status: 'success',
      message: 'Data synchronized successfully',
      timestamp: new Date().toISOString(),
      summary: {
        steps: Math.floor(8000 + Math.random() * 4000),
        calories: Math.floor(1500 + Math.random() * 800),
        distance: (3 + Math.random() * 2).toFixed(2),
        activeMinutes: Math.floor(30 + Math.random() * 45),
      }
    };
  }
}

/**
 * Adapter Mock para Fitbit
 */
export class FitbitMockAdapter implements FitnessTrackerService {
  id = 'fitbit';
  name = 'Fitbit';
  description = 'Plataforma de seguimiento de actividad física, sueño y más';
  apiDocumentation = 'https://dev.fitbit.com/build/reference/web-api/';
  requiredSecrets = ['FITBIT_CLIENT_ID', 'FITBIT_CLIENT_SECRET'];
  
  isConfigured(): boolean {
    return true; // Mocking as configured for demonstration
  }
  
  getAuthUrl(userId: number, redirectUri: string): string {
    return `/api/fitness/${this.id}/auth?userId=${userId}&redirectUri=${encodeURIComponent(redirectUri)}`;
  }
  
  async exchangeCodeForToken(code: string, userId: number): Promise<any> {
    const mockToken = {
      access_token: 'mock_fitbit_access_token',
      refresh_token: 'mock_fitbit_refresh_token',
      expires_in: 3600,
      token_type: 'Bearer',
    };
    
    await storeServiceToken(userId, this.id, mockToken);
    return mockToken;
  }
  
  async getData(userId: number, dataType: string, startDate?: string, endDate?: string): Promise<any> {
    // Generar datos ejemplos basados en patrones reales para desarrollo y demostración
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const yesterday = new Date(now.setDate(now.getDate() - 1)).toISOString().split('T')[0];
    
    const mockData = {
      steps: {
        [today]: Math.floor(9000 + Math.random() * 3000),
        [yesterday]: Math.floor(7500 + Math.random() * 4000),
      },
      calories: {
        [today]: Math.floor(1700 + Math.random() * 600),
        [yesterday]: Math.floor(1900 + Math.random() * 500),
      },
      distance: {
        [today]: (4 + Math.random() * 2.5).toFixed(2),
        [yesterday]: (4.5 + Math.random() * 2).toFixed(2),
      },
      floors: {
        [today]: Math.floor(15 + Math.random() * 10),
        [yesterday]: Math.floor(12 + Math.random() * 15),
      },
      sleep: {
        [today]: {
          duration: (7 + Math.random() * 1.5).toFixed(2),
          efficiency: Math.floor(85 + Math.random() * 10),
          stages: {
            deep: Math.floor(15 + Math.random() * 10),
            light: Math.floor(45 + Math.random() * 15),
            rem: Math.floor(20 + Math.random() * 10),
            awake: Math.floor(5 + Math.random() * 5),
          },
        },
        [yesterday]: {
          duration: (6.5 + Math.random() * 2).toFixed(2),
          efficiency: Math.floor(82 + Math.random() * 12),
          stages: {
            deep: Math.floor(18 + Math.random() * 8),
            light: Math.floor(40 + Math.random() * 15),
            rem: Math.floor(25 + Math.random() * 8),
            awake: Math.floor(7 + Math.random() * 3),
          },
        },
      },
    };
    
    if (dataType === 'all') {
      return mockData;
    }
    
    return mockData[dataType] || {};
  }
  
  async syncData(userId: number): Promise<any> {
    const token = await getServiceToken(userId, this.id);
    
    if (!token) {
      throw new Error('No token found for this service');
    }
    
    // Simular sincronización exitosa
    return {
      status: 'success',
      message: 'Data synchronized successfully',
      timestamp: new Date().toISOString(),
      summary: {
        steps: Math.floor(9000 + Math.random() * 3000),
        calories: Math.floor(1700 + Math.random() * 600),
        distance: (4 + Math.random() * 2.5).toFixed(2),
        floors: Math.floor(15 + Math.random() * 10),
        activeMinutes: Math.floor(40 + Math.random() * 35),
        sleep: {
          duration: (7 + Math.random() * 1.5).toFixed(2),
          efficiency: Math.floor(85 + Math.random() * 10),
        }
      }
    };
  }
}

/**
 * Adapter Mock para Strava
 */
export class StravaMockAdapter implements FitnessTrackerService {
  id = 'strava';
  name = 'Strava';
  description = 'La red social para atletas';
  apiDocumentation = 'https://developers.strava.com/docs/reference/';
  requiredSecrets = ['STRAVA_CLIENT_ID', 'STRAVA_CLIENT_SECRET'];
  
  isConfigured(): boolean {
    return true; // Mocking as configured for demonstration
  }
  
  getAuthUrl(userId: number, redirectUri: string): string {
    return `/api/fitness/${this.id}/auth?userId=${userId}&redirectUri=${encodeURIComponent(redirectUri)}`;
  }
  
  async exchangeCodeForToken(code: string, userId: number): Promise<any> {
    const mockToken = {
      access_token: 'mock_strava_access_token',
      refresh_token: 'mock_strava_refresh_token',
      expires_in: 3600,
      token_type: 'Bearer',
    };
    
    await storeServiceToken(userId, this.id, mockToken);
    return mockToken;
  }
  
  async getData(userId: number, dataType: string, startDate?: string, endDate?: string): Promise<any> {
    // Generar datos ejemplos basados en patrones reales para desarrollo y demostración
    const mockActivities = [
      {
        id: '1001',
        type: 'Run',
        name: 'Morning Run',
        distance: 5280, // meters
        moving_time: 1580, // seconds
        elapsed_time: 1645, // seconds
        average_speed: 3.34, // m/s
        max_speed: 4.5, // m/s
        average_cadence: 78,
        average_heart_rate: 152,
        max_heart_rate: 175,
        start_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        location_city: 'San Francisco',
        location_country: 'United States',
        achievement_count: 2,
        kudos_count: 5,
        comment_count: 1,
        total_elevation_gain: 52, // meters
      },
      {
        id: '1002',
        type: 'Ride',
        name: 'Afternoon Cycling',
        distance: 12500, // meters
        moving_time: 2680, // seconds
        elapsed_time: 2820, // seconds
        average_speed: 4.66, // m/s
        max_speed: 8.3, // m/s
        average_cadence: 85,
        average_heart_rate: 148,
        max_heart_rate: 172,
        start_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        location_city: 'San Francisco',
        location_country: 'United States',
        achievement_count: 3,
        kudos_count: 8,
        comment_count: 2,
        total_elevation_gain: 143, // meters
      },
      {
        id: '1003',
        type: 'Swim',
        name: 'Pool Laps',
        distance: 1500, // meters
        moving_time: 1820, // seconds
        elapsed_time: 1850, // seconds
        average_speed: 0.82, // m/s
        max_speed: 1.2, // m/s
        average_heart_rate: 132,
        max_heart_rate: 155,
        start_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        location_city: 'San Francisco',
        location_country: 'United States',
        achievement_count: 1,
        kudos_count: 3,
        comment_count: 0,
        total_elevation_gain: 0, // meters
      },
    ];
    
    const mockData = {
      activities: mockActivities,
      stats: {
        all_run_totals: {
          count: 25,
          distance: 135000, // meters
          elapsed_time: 40000, // seconds
          elevation_gain: 1200, // meters
        },
        all_ride_totals: {
          count: 18,
          distance: 320000, // meters
          elapsed_time: 60000, // seconds
          elevation_gain: 2500, // meters
        },
        all_swim_totals: {
          count: 10,
          distance: 15000, // meters
          elapsed_time: 18000, // seconds
          elevation_gain: 0, // meters
        },
      },
    };
    
    if (dataType === 'all') {
      return mockData;
    } else if (dataType === 'activities') {
      return { activities: mockActivities };
    } else if (dataType === 'stats') {
      return { stats: mockData.stats };
    }
    
    return {};
  }
  
  async syncData(userId: number): Promise<any> {
    const token = await getServiceToken(userId, this.id);
    
    if (!token) {
      throw new Error('No token found for this service');
    }
    
    // Simular sincronización exitosa
    return {
      status: 'success',
      message: 'Data synchronized successfully',
      timestamp: new Date().toISOString(),
      summary: {
        activities_count: 3,
        total_distance: 19280, // meters
        total_time: 6145, // seconds
        elevation_gain: 195, // meters
      }
    };
  }
}

/**
 * Adapter Mock para Apple Health
 * Ya está implementado en el sistema
 */
export class AppleHealthAdapter implements FitnessTrackerService {
  id = 'apple-health';
  name = 'Apple Health';
  description = 'El servicio de salud y actividad física de Apple';
  apiDocumentation = 'https://developer.apple.com/documentation/healthkit';
  requiredSecrets = []; // No requiere credenciales OAuth, usa carga de archivos de exportación
  
  isConfigured(): boolean {
    return true; // Siempre está configurado ya que usa exportación de archivos
  }
  
  getAuthUrl(userId: number, redirectUri: string): string {
    return `/api/fitness/${this.id}/upload?userId=${userId}`;
  }
  
  async exchangeCodeForToken(code: string, userId: number): Promise<any> {
    // Apple Health no usa OAuth, sino que procesa archivos de exportación
    return { status: 'success', message: 'Apple Health uses file uploads instead of OAuth' };
  }
  
  async getData(userId: number, dataType: string, startDate?: string, endDate?: string): Promise<any> {
    // Generar datos ejemplos basados en patrones reales para desarrollo y demostración
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const yesterday = new Date(now.setDate(now.getDate() - 1)).toISOString().split('T')[0];
    
    const mockData = {
      steps: {
        [today]: Math.floor(8500 + Math.random() * 3500),
        [yesterday]: Math.floor(7800 + Math.random() * 3000),
      },
      calories: {
        [today]: Math.floor(1600 + Math.random() * 700),
        [yesterday]: Math.floor(1750 + Math.random() * 600),
      },
      workout: {
        [today]: [
          {
            type: 'Walking',
            duration: Math.floor(20 + Math.random() * 20),
            calories: Math.floor(100 + Math.random() * 100),
            distance: (1 + Math.random() * 1.5).toFixed(2),
          },
          {
            type: 'Running',
            duration: Math.floor(25 + Math.random() * 15),
            calories: Math.floor(200 + Math.random() * 150),
            distance: (3 + Math.random() * 2).toFixed(2),
          },
        ],
        [yesterday]: [
          {
            type: 'Cycling',
            duration: Math.floor(30 + Math.random() * 25),
            calories: Math.floor(250 + Math.random() * 150),
            distance: (5 + Math.random() * 3).toFixed(2),
          },
        ],
      },
      heartRate: {
        [today]: {
          average: Math.floor(68 + Math.random() * 10),
          min: Math.floor(55 + Math.random() * 5),
          max: Math.floor(120 + Math.random() * 30),
        },
        [yesterday]: {
          average: Math.floor(70 + Math.random() * 8),
          min: Math.floor(58 + Math.random() * 4),
          max: Math.floor(125 + Math.random() * 25),
        },
      },
      sleep: {
        [today]: {
          duration: (7.2 + Math.random() * 1.2).toFixed(2),
          quality: 'Good',
          phases: {
            deep: Math.floor(80 + Math.random() * 40),
            rem: Math.floor(90 + Math.random() * 30),
            light: Math.floor(240 + Math.random() * 60),
            awake: Math.floor(10 + Math.random() * 20),
          },
        },
        [yesterday]: {
          duration: (6.8 + Math.random() * 1.5).toFixed(2),
          quality: 'Fair',
          phases: {
            deep: Math.floor(70 + Math.random() * 40),
            rem: Math.floor(80 + Math.random() * 40),
            light: Math.floor(250 + Math.random() * 50),
            awake: Math.floor(15 + Math.random() * 15),
          },
        },
      },
    };
    
    if (dataType === 'all') {
      return mockData;
    }
    
    return mockData[dataType] || {};
  }
  
  async syncData(userId: number): Promise<any> {
    // Simular sincronización exitosa desde un archivo
    return {
      status: 'success',
      message: 'Data synchronized successfully from uploaded file',
      timestamp: new Date().toISOString(),
      summary: {
        steps: Math.floor(8500 + Math.random() * 3500),
        calories: Math.floor(1600 + Math.random() * 700),
        workouts: 2,
        sleep: {
          duration: (7.2 + Math.random() * 1.2).toFixed(2),
          quality: 'Good',
        }
      }
    };
  }
}

// Exportar los adaptadores para su uso en el sistema
export const mockAdapters = {
  GoogleFitMockAdapter,
  FitbitMockAdapter,
  StravaMockAdapter,
  AppleHealthAdapter
};
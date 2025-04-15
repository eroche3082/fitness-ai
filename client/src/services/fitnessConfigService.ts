import { doc, getDoc, setDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface FitnessConfig {
  // Información básica del sitio
  homepage_title: string;
  homepage_subtitle: string;
  cta_text: string;
  primary_color: string;
  
  // Estilos generales
  font_family: string;
  button_shape: 'rounded' | 'pill' | 'square';
  layout: 'dark' | 'light';
  
  // Imágenes
  hero_image_url: string;
  logo_url: string;
  
  // Navegación
  header_menu: string[];
  
  // Controles de visibilidad
  visible_sections: {
    hero: boolean;
    features: boolean;
    pricing: boolean;
    plans: boolean;
    testimonials: boolean;
    chat: boolean;
    footer: boolean;
  };
  
  // Metadatos
  last_updated: string;
  updated_by: string;
}

const DEFAULT_CONFIG: FitnessConfig = {
  homepage_title: 'Transforma tu cuerpo y mente con Fitness AI',
  homepage_subtitle: 'Coaching personalizado en tiempo real, seguimiento de progreso y planes adaptados a tus objetivos',
  cta_text: 'Comenzar ahora',
  primary_color: '#11ff00',
  
  font_family: 'Roboto',
  button_shape: 'pill',
  layout: 'dark',
  
  hero_image_url: '',
  logo_url: '',
  
  header_menu: ['Inicio', 'Características', 'Planes', 'Contacto'],
  
  visible_sections: {
    hero: true,
    features: true,
    pricing: true,
    plans: true,
    testimonials: true,
    chat: true,
    footer: true
  },
  
  last_updated: new Date().toISOString(),
  updated_by: 'system'
};

const CONFIG_PATH = 'config/fitnessai';

/**
 * Obtiene la configuración actual desde Firestore
 */
export async function getConfig(): Promise<FitnessConfig> {
  try {
    const docRef = doc(db, CONFIG_PATH);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as FitnessConfig;
    } else {
      console.log('No existe configuración, usando valores por defecto');
      await setConfig(DEFAULT_CONFIG);
      return DEFAULT_CONFIG;
    }
  } catch (error) {
    console.error('Error al cargar la configuración:', error);
    return DEFAULT_CONFIG;
  }
}

/**
 * Guarda la configuración en Firestore
 */
export async function setConfig(config: FitnessConfig): Promise<void> {
  try {
    // Actualizar timestamp y otros metadatos
    const updatedConfig = {
      ...config,
      last_updated: new Date().toISOString(),
      // Aquí podrías obtener el usuario actual del contexto de auth
      updated_by: 'editor_user'
    };
    
    const docRef = doc(db, CONFIG_PATH);
    await setDoc(docRef, updatedConfig);
    console.log('Configuración guardada con éxito');
  } catch (error) {
    console.error('Error al guardar la configuración:', error);
    throw error;
  }
}

/**
 * Se suscribe a cambios en la configuración
 */
export function subscribeToConfig(callback: (config: FitnessConfig) => void): Unsubscribe {
  const docRef = doc(db, CONFIG_PATH);
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as FitnessConfig);
    } else {
      // Si no existe, usar valores por defecto
      callback(DEFAULT_CONFIG);
    }
  }, (error) => {
    console.error('Error al escuchar cambios en la configuración:', error);
  });
}
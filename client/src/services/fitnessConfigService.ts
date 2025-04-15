import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  Unsubscribe 
} from "firebase/firestore";
import { firestore } from "../firebaseConfig";

// Interfaz para la configuración de la aplicación
export interface FitnessConfig {
  primary_color: string;
  font_family: string;
  layout: "dark" | "light";
  button_shape: "rounded" | "square" | "pill";
  homepage_title: string;
  homepage_subtitle: string;
  cta_text: string;
  header_menu: string[];
  visible_sections: {
    chat: boolean;
    features: boolean;
    pricing: boolean;
    plans: boolean;
  };
  hero_image_url?: string;
  logo_url?: string;
  last_updated?: {
    timestamp: number;
    user_id: string;
    user_role: string;
  };
}

// Configuración por defecto
export const defaultConfig: FitnessConfig = {
  primary_color: "#11ff00",
  font_family: "Roboto",
  layout: "dark",
  button_shape: "rounded",
  homepage_title: "Welcome to Fitness AI",
  homepage_subtitle: "Train smarter with your personal AI coach",
  cta_text: "Get Started",
  header_menu: ["Home", "Features", "Pricing", "Assistant"],
  visible_sections: {
    chat: true,
    features: true,
    pricing: true,
    plans: true
  }
};

const CONFIG_PATH = "config/fitnessai";

/**
 * Obtiene la configuración actual de Firestore
 * @returns Promesa con la configuración
 */
export async function getConfig(): Promise<FitnessConfig> {
  try {
    const docRef = doc(firestore, CONFIG_PATH);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as FitnessConfig;
    } else {
      // Si no existe el documento, lo creamos con la configuración por defecto
      await setDoc(docRef, defaultConfig);
      return defaultConfig;
    }
  } catch (error) {
    console.error("Error fetching config:", error);
    return defaultConfig;
  }
}

/**
 * Actualiza la configuración en Firestore
 * @param config La nueva configuración
 * @param userId ID del usuario que realiza el cambio
 * @param userRole Rol del usuario que realiza el cambio
 * @returns Promesa que se resuelve cuando se completa la actualización
 */
export async function updateConfig(
  config: Partial<FitnessConfig>, 
  userId: string, 
  userRole: string
): Promise<void> {
  try {
    const docRef = doc(firestore, CONFIG_PATH);
    const updateData = {
      ...config,
      last_updated: {
        timestamp: Date.now(),
        user_id: userId,
        user_role: userRole
      }
    };
    
    await updateDoc(docRef, updateData);
    console.log("Config updated successfully");
  } catch (error) {
    console.error("Error updating config:", error);
    throw new Error("Failed to update configuration");
  }
}

/**
 * Suscribe a cambios en la configuración en tiempo real
 * @param callback Función a llamar cuando cambia la configuración
 * @returns Función para cancelar la suscripción
 */
export function subscribeToConfigChanges(
  callback: (config: FitnessConfig) => void
): Unsubscribe {
  const docRef = doc(firestore, CONFIG_PATH);
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as FitnessConfig);
    } else {
      callback(defaultConfig);
    }
  }, (error) => {
    console.error("Error listening to config changes:", error);
  });
}

/**
 * Registra un cambio de configuración en el historial de auditoría
 * @param userId ID del usuario que realizó el cambio
 * @param userRole Rol del usuario
 * @param changes Cambios realizados
 */
export async function logConfigChange(
  userId: string,
  userRole: string,
  changes: Record<string, any>
): Promise<void> {
  try {
    // Implementar la lógica para registrar cambios en el historial
    // Esto podría ser en una colección separada en Firestore
    console.log("Changes logged:", { userId, userRole, changes, timestamp: new Date() });
  } catch (error) {
    console.error("Error logging config changes:", error);
  }
}
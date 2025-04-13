import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";

/**
 * Uploads workout media (image or video) to Firebase Storage
 * @param file The file to upload
 * @param userId The user ID to associate with the file
 * @returns Promise with the download URL
 */
export async function uploadWorkoutMedia(file: File, userId: string): Promise<string> {
  // Create a unique filename with timestamp
  const timestamp = new Date().getTime();
  const fileName = `${timestamp}_${file.name}`;
  const path = `fitness_users/${userId}/media/${fileName}`;
  
  // Create a reference to the file location
  const fileRef = ref(storage, path);
  
  try {
    // Upload the file
    await uploadBytes(fileRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading workout media:", error);
    throw new Error("Failed to upload workout media");
  }
}
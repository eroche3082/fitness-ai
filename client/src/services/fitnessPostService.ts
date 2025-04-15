import { collection, addDoc, getDocs, query, where, Timestamp, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { FitnessPostContent } from "./generateFitnessPost";

/**
 * Interface for a fitness post to be saved in Firestore
 */
export interface FitnessPost {
  userId: string;
  routineType: string;
  fitnessLevel: string;
  mediaUrl: string;
  caption: string;
  hashtags: string[];
  platform: string;
  postType: "Reel" | "Story" | "Post";
  tone: string;
  createdAt: Timestamp;
  scheduledAt: Timestamp | null;
  status: "Draft" | "Scheduled" | "Posted";
  callToAction?: string;
  videoIdea?: string;
}

/**
 * Saves a fitness post to Firestore
 * @param post The post data to save
 * @returns Promise with the post ID
 */
export async function saveFitnessPost(post: Omit<FitnessPost, "createdAt">): Promise<string> {
  try {
    const postData: FitnessPost = {
      ...post,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, "fitness_posts"), postData);
    return docRef.id;
  } catch (error) {
    console.error("Error saving fitness post:", error);
    throw new Error("Failed to save fitness post");
  }
}

/**
 * Creates a fitness post from media upload and AI generated content
 * @param userId User ID
 * @param routineType Type of workout routine
 * @param fitnessLevel User's fitness level
 * @param mediaUrl URL of the uploaded media
 * @param generatedContent AI generated content
 * @param platform Target social media platform
 * @param postType Type of post (Reel, Story, Post)
 * @param tone Tone of the post
 * @param scheduledAt Optional timestamp for scheduling the post
 * @returns Promise with the post ID
 */
export async function createFitnessPost(
  userId: string,
  routineType: string,
  fitnessLevel: string,
  mediaUrl: string,
  generatedContent: FitnessPostContent,
  platform: string,
  postType: "Reel" | "Story" | "Post",
  tone: string,
  scheduledAt: Date | null = null
): Promise<string> {
  const post: Omit<FitnessPost, "createdAt"> = {
    userId,
    routineType,
    fitnessLevel,
    mediaUrl,
    caption: generatedContent.caption,
    hashtags: generatedContent.hashtags,
    callToAction: generatedContent.callToAction,
    videoIdea: generatedContent.videoIdea,
    platform,
    postType,
    tone,
    scheduledAt: scheduledAt ? Timestamp.fromDate(scheduledAt) : null,
    status: scheduledAt ? "Scheduled" : "Draft"
  };
  
  return saveFitnessPost(post);
}

/**
 * Gets all fitness posts for a user
 * @param userId User ID
 * @returns Promise with an array of fitness posts
 */
export async function getUserFitnessPosts(userId: string): Promise<FitnessPost[]> {
  try {
    const q = query(
      collection(db, "fitness_posts"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as FitnessPost);
  } catch (error) {
    console.error("Error fetching user fitness posts:", error);
    throw new Error("Failed to fetch fitness posts");
  }
}
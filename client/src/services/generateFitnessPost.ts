import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Interface for the parameters needed to generate a fitness post
 */
export interface FitnessPostParams {
  routineType: string;
  fitnessLevel: string;
  tone: string;
  notes?: string;
  platform: string;
}

/**
 * Interface for the generated fitness post content
 */
export interface FitnessPostContent {
  caption: string;
  hashtags: string[];
  callToAction: string;
  videoIdea: string;
}

/**
 * Generates social media content for a fitness post
 * @param params Configuration parameters for the post generation
 * @returns Promise with the generated content
 */
export async function generateFitnessPost(params: FitnessPostParams): Promise<FitnessPostContent> {
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { routineType, fitnessLevel, tone, notes, platform } = params;
    
    const prompt = `
      Create a viral ${platform} post for a ${routineType} workout at ${fitnessLevel} level.
      Style: ${tone} (energetic, inspiring, educational, bold).
      User Notes: ${notes || "None"}.
      
      Format your response as a JSON object with these keys:
      - caption: A compelling caption for the post
      - hashtags: Array of 10 relevant hashtags (without the # symbol)
      - callToAction: A motivational call to action
      - videoIdea: A brief description of what the video should show
    `;

    const result = await model.generateContent(prompt);
    const textResult = result.response.text();
    
    // Parse the JSON response
    try {
      // Find JSON in the response
      const jsonMatch = textResult.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      
      const parsedResult = JSON.parse(jsonMatch[0]) as FitnessPostContent;
      return parsedResult;
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      
      // Fallback: Return a structured response manually
      return {
        caption: textResult.substring(0, 200) + "...",
        hashtags: ["fitness", "workout", "health", "exercise", "training", "motivation", "wellness", "healthy", "fit", "lifestyle"],
        callToAction: "Start your fitness journey today!",
        videoIdea: "Show your workout routine and highlight your progress."
      };
    }
  } catch (error) {
    console.error("Error generating fitness post:", error);
    throw new Error("Failed to generate fitness post");
  }
}
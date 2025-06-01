"use server";

import { z } from "zod";
import { auth } from "@repo/auth/server";
import { database } from "@repo/db";

// Define validation schema for onboarding data
export const onboardingSchema = z.object({
  businessType: z.string().min(1, "Business type is required"),
  websiteUrl: z.string().url("Please enter a valid URL"),
  marketingGoals: z.array(z.string()).min(1, "Select at least one marketing goal"),
  currentTools: z.array(z.string()).min(1, "Select at least one current tool"),
  expectedOutcomes: z.string().min(10, "Please provide more details about your expected outcomes")
});

// Type for the onboarding data
export type OnboardingData = z.infer<typeof onboardingSchema>;

// Type for the response
type OnboardingResponse = 
  | { success: true; userId: string }
  | { success: false; error: string };

/**
 * Updates the user profile with onboarding data and marks onboarding as completed
 */
export async function updateOnboardingProfile(
  formData: FormData | OnboardingData
): Promise<OnboardingResponse> {
  try {
    // Get the authenticated user
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }
    
    // Parse and validate the form data
    let data: OnboardingData;
    
    if (formData instanceof FormData) {
      // Convert FormData to object and parse arrays
      const rawData = {
        businessType: formData.get("businessType") as string,
        websiteUrl: formData.get("websiteUrl") as string,
        marketingGoals: (formData.get("marketingGoals") as string)?.split(",") || [],
        currentTools: (formData.get("currentTools") as string)?.split(",") || [],
        expectedOutcomes: formData.get("expectedOutcomes") as string
      };
      
      // Validate with zod schema
      const result = onboardingSchema.safeParse(rawData);
      
      if (!result.success) {
        const errorMessage = result.error.errors.map(e => 
          `${e.path.join('.')}: ${e.message}`
        ).join(', ');
        
        return { success: false, error: errorMessage };
      }
      
      data = result.data;
    } else {
      // Direct object input (already in the correct format)
      const result = onboardingSchema.safeParse(formData);
      
      if (!result.success) {
        const errorMessage = result.error.errors.map(e => 
          `${e.path.join('.')}: ${e.message}`
        ).join(', ');
        
        return { success: false, error: errorMessage };
      }
      
      data = result.data;
    }
    
    // Update the user profile in the database
    await database.user.update({
      where: { id: userId },
      data: {
        profile: {
          upsert: {
            create: {
              businessType: data.businessType,
              websiteUrl: data.websiteUrl,
              marketingGoals: data.marketingGoals,
              currentTools: data.currentTools,
              expectedOutcomes: data.expectedOutcomes,
            },
            update: {
              businessType: data.businessType,
              websiteUrl: data.websiteUrl,
              marketingGoals: data.marketingGoals,
              currentTools: data.currentTools,
              expectedOutcomes: data.expectedOutcomes,
            }
          }
        },
        onboardingCompleted: true,
        updatedAt: new Date()
      }
    });
    
    return { success: true, userId };
  } catch (error) {
    console.error("Error updating onboarding profile:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
}

/**
 * Checks if the user has completed onboarding
 */
export async function checkOnboardingStatus(): Promise<{ completed: boolean }> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { completed: false };
    }
    
    const user = await database.user.findUnique({
      where: { id: userId },
      select: { onboardingCompleted: true }
    });
    
    return { completed: !!user?.onboardingCompleted };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return { completed: false };
  }
}

/**
 * Resets the onboarding status for testing purposes
 * Note: This should be disabled in production
 */
export async function resetOnboarding(): Promise<OnboardingResponse> {
  try {
    // This should be protected in production
    if (process.env.NODE_ENV === "production") {
      return { success: false, error: "This action is not allowed in production" };
    }
    
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }
    
    await database.user.update({
      where: { id: userId },
      data: {
        onboardingCompleted: false,
        updatedAt: new Date()
      }
    });
    
    return { success: true, userId };
  } catch (error) {
    console.error("Error resetting onboarding:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
}

import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@repo/auth/server";
import { database } from "@repo/db";
import { createMetadata } from "@repo/seo/metadata";

// Import the client wrapper component
import dynamic from "next/dynamic";
const OnboardingWrapper = dynamic(
  () => import("@/components/onboarding/onboarding-wrapper").then(mod => mod.OnboardingWrapper),
  { ssr: false }
);

export const metadata = createMetadata({
  title: "Welcome to Intentified",
  description: "Complete your profile to get started with intent tracking"
});

export default async function OnboardingPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }
  
  // Check if user has already completed onboarding
  const userProfile = await database.user.findUnique({
    where: { id: user.id },
    select: { onboardingCompleted: true }
  });
  
  if (userProfile?.onboardingCompleted) {
    redirect("/dashboard");
  }
  
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-12">
      {/* Glassmorphic background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-green-500/20 rounded-full blur-3xl" />
      </div>
      
      {/* Content */}
      <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Welcome to Intentified</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Let's set up your account to track customer intent signals and optimize your marketing ROI.
            This will only take a few minutes.
          </p>
        </div>
        
        <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading...</div>}>
          <OnboardingWrapper />
        </Suspense>
      </div>
    </div>
  );
}

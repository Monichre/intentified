import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Intentified",
  description: "Sign in to your Intentified dashboard account",
};

export default function SignInPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Sign in to Intentified</h1>
          <p className="mt-2 text-muted-foreground">
            Enter your credentials below to access your dashboard
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
              card: "bg-card shadow-lg",
            },
          }}
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}
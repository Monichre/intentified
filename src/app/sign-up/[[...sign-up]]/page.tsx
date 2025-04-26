import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Intentified",
  description: "Create a new Intentified dashboard account",
};

export default function SignUpPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="mt-2 text-muted-foreground">
            Sign up for Intentified to get started
          </p>
        </div>
        <SignUp
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
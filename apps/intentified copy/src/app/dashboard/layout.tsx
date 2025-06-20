import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardLayoutWrapper from "@/features/dashboard/components/dashboard-layout";
import { BackgroundDots } from "@/components/background";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the current user
  const session = await auth();

  // If not authenticated, redirect to sign-in
  if (!session?.userId) {
    redirect("/sign-in");
  }

  return (
    <DashboardLayoutWrapper>
      <BackgroundDots />

      {children}
    </DashboardLayoutWrapper>
  );
}

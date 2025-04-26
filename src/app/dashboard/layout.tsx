import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardLayoutWrapper from "@/features/dashboard/components/dashboard-layout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the current user
  const { userId } = auth();
  
  // This is a backup check, as middleware should already filter
  // But it's good to have defense in depth
  if (!userId) {
    redirect("/sign-in");
  }
  
  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>;
}
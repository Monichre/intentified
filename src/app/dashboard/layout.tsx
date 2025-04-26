import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardLayoutWrapper from "@/features/dashboard/components/dashboard-layout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the current user

  const session = await auth();

  console.log("🚀 ~ session:", session);

  // if (!session?.userId) {
  //   redirect("/sign-in");
  // }

  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>;
}

import type { Metadata } from "next";

import { AppProvider } from "@/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { StagewiseToolbar } from "@stagewise/toolbar-next";
import { Fira_Mono, Roboto, Geist_Mono } from "next/font/google";
import "./globals.css";

import { TooltipProvider } from "@/components/ui/tooltip";

// import { ReactScan } from "../../../dev-utils/react-scan";

const stagewiseConfig = { plugins: [] };
const geist_mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--display-family",
});

const fira_mono = Fira_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--display-family",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--text-family",
});

export const metadata: Metadata = {
  title: "Intentified - Customer Relationship Management",
  description:
    "Intentified CRM dashboard for managing customer relationships using Next.js, Shadcn UI",
};

// ${roboto.variable} ${geist_mono.variable}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" suppressHydrationWarning>
        <body className={`${fira_mono.variable} ${geist_mono.variable} dark`}>
          <AppProvider
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <TooltipProvider>
              {children}
              {process.env.NODE_ENV === "development" && (
                <>
                  <StagewiseToolbar config={stagewiseConfig} />
                  {/* <ReactScan /> */}
                </>
              )}
            </TooltipProvider>
          </AppProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function AppProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    // <PostHogProvider>
    <NextThemesProvider
      {...props}
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
    // </PostHogProvider>
  );
}

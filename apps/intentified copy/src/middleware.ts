import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/dashboard/onboarding(.*)"]);

// export default clerkMiddleware()

export default clerkMiddleware(async (auth, req) => {
	// Allow public routes and authenticated users to access them
	// if (isPublicRoute(req)) {
	// 	return NextResponse.next();
	// }

	// // Redirect to sign-in if not authenticated
	// const { userId, redirectToSignIn } = await auth();
	// if (!userId) {
	// 	return redirectToSignIn({ returnBackUrl: req.url });
	// }

	// // Allow access to onboarding for all authenticated users
	// if (isOnboardingRoute(req)) {
	// 	return NextResponse.next();
	// }

	// // Get user from Clerk and check if they are an admin
	// // Admin role check is only for regular dashboard routes, not onboarding
	// try {
	// 	const user = await auth.user;
	// 	const isAdmin =
	// 		user?.publicMetadata.role === "admin" ||
	// 		(typeof user?.emailAddresses?.[0]?.emailAddress === "string" &&
	// 			user.emailAddresses[0].emailAddress.endsWith("@agencyunderground.com"));
	// 	const hasCompletedOnboarding = user?.publicMetadata.onboardingCompleted === true;

	// 	// If not an admin and trying to access dashboard, redirect to appropriate page
	// 	if (!isAdmin && req.nextUrl.pathname.startsWith("/dashboard")) {
	// 		// If they haven't completed onboarding, send them there
	// 		if (!hasCompletedOnboarding) {
	// 			return NextResponse.redirect(new URL("/dashboard/onboarding", req.url));
	// 		}
	// 		// Otherwise redirect to home
	// 		return NextResponse.redirect(new URL("/", req.url));
	// 	}
	// } catch (error) {
	// 	console.error("Error checking user role:", error);
	// 	// If there's an error, redirect to home page
	// 	return NextResponse.redirect(new URL("/", req.url));
	// }

	// // If we get here, the user is authenticated and authorized
	// return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
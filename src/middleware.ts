import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
	// Allow public routes and authenticated users to access them
	if (isPublicRoute(req)) {
		return NextResponse.next();
	}

	// Redirect to sign-in if not authenticated
	const { userId, redirectToSignIn } = await auth();
	if (!userId) {
		return redirectToSignIn({ returnBackUrl: req.url });
	}

	// Get user from Clerk and check if they are an admin
	// All dashboard routes will be restricted to admin users
	try {
		const user = await auth.user;
		const isAdmin = user?.publicMetadata.role === "admin";

		// If not an admin, redirect to home page
		if (!isAdmin && req.nextUrl.pathname.startsWith("/dashboard")) {
			return NextResponse.redirect(new URL("/", req.url));
		}
	} catch (error) {
		console.error("Error checking user role:", error);
		// If there's an error, redirect to home page
		return NextResponse.redirect(new URL("/", req.url));
	}

	// If we get here, the user is authenticated and authorized
	return NextResponse.next();
});

export const config = {
	// Protects all routes, including api/trpc.
	// Paths specified in publicRoutes are excluded.
	matcher: ["/((?!_next|[^?]*\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

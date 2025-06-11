
// Function to handle POST requests
export async function POST(req: NextRequest) {
  // Check rate limit
  if (ratelimit) {
    const ip = req.headers.get("x-real-ip") ?? "local";
    const rl = await ratelimit.limit(ip);
    if (!rl.success) {
      return errorResponse(
        "You've reached your maximum AI usage for today. You can use the manual editor and get 5 more free AI requests tomorrow",
        429
      );
    }
  }

  try {
    

   
    // Validate the response data
    const validationResult = SEODiffSchema.safeParse(response);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed.", details: validationResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}

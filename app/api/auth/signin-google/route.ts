import { NextResponse } from "next/server";
import { demoUser } from "@/lib/demo-auth";

export async function GET() {
  try {
    // In a real app, this would authenticate with Google
    // For our demo, we'll simulate a successful login with the demo user

    // Create a response with the demo user data
    const response = NextResponse.json({
      success: true,
      user: demoUser,
      redirect: "/dashboard",
    });

    // Set a cookie to indicate the user is logged in
    // This is a simplified approach - in a real app, you'd use secure JWT tokens
    response.cookies.set(
      "auth-session",
      JSON.stringify({
        user: demoUser,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      }
    );

    return response;
  } catch (error) {
    console.error("Error in Google sign-in:", error);
    return NextResponse.json(
      { error: "Failed to authenticate with Google" },
      { status: 500 }
    );
  }
}

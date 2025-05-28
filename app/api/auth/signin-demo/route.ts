import { NextResponse } from "next/server";
import { demoUser } from "@/lib/demo-auth";

export async function GET() {
  try {
    // Create a response with the demo user data
    const response = NextResponse.json({
      success: true,
      user: demoUser,
      redirect: "/dashboard",
    });

    // Set a cookie to indicate the user is using the demo account
    response.cookies.set(
      "auth-session",
      JSON.stringify({
        user: demoUser,
        isDemoUser: true,
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
    console.error("Error in demo sign-in:", error);
    return NextResponse.json(
      { error: "Failed to sign in with demo account" },
      { status: 500 }
    );
  }
}

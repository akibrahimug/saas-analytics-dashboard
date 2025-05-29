import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Create a formatted response that mimics the structure of getProviders()
    const providersArray = authOptions.providers || [];
    const providers = providersArray.reduce((acc, provider) => {
      if (!provider.id) return acc;

      acc[provider.id] = {
        id: provider.id,
        name: provider.name || provider.id,
        type: provider.type,
        signinUrl: `/api/auth/signin/${provider.id}`,
        callbackUrl: `/api/auth/callback/${provider.id}`,
      };
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(providers, { status: 200 });
  } catch (error) {
    console.error("Error fetching providers:", error);
    return NextResponse.json(
      { error: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // In a real app, you would validate the input and create a user in your database
    // This is a mock implementation for demonstration purposes

    // Check if email is already in use
    if (email === "demo@example.com") {
      return NextResponse.json({ message: "Email already in use" }, { status: 409 })
    }

    // Return success response
    return NextResponse.json({ message: "User registered successfully" }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

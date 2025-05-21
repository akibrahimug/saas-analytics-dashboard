import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: { userId: string } }) {
  try {
    // For preview, we'll just return a success response
    const { role } = await request.json()

    // Validate the role
    if (!role || !["admin", "manager", "member", "viewer"].includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 })
    }

    return NextResponse.json({
      id: params.userId,
      name: "Demo User",
      email: "demo@example.com",
      role,
    })
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

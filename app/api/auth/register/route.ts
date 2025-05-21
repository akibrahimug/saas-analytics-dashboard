import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // For preview, we'll just return a success response
    return NextResponse.json(
      {
        user: {
          id: "new-user",
          name,
          email,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

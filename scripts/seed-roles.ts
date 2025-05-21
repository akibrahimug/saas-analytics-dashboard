import { createClient } from "@supabase/supabase-js"
import { ROLES } from "../lib/roles"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  // Find the first user to make them an admin
  const { data: firstUser, error: firstUserError } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .single()

  if (firstUserError) {
    console.error("Error fetching first user:", firstUserError)
  }

  if (firstUser) {
    console.log(`Setting user ${firstUser.email} as admin...`)
    const { error } = await supabase.from("users").update({ role: ROLES.ADMIN }).eq("id", firstUser.id)

    if (error) {
      console.error("Error updating user role:", error)
    } else {
      console.log("Admin role assigned successfully!")
    }
  } else {
    console.log("No users found. Create a user first.")
  }

  // Create some example users with different roles
  const demoUsers = [
    {
      name: "Manager User",
      email: "manager@example.com",
      role: ROLES.MANAGER,
    },
    {
      name: "Member User",
      email: "member@example.com",
      role: ROLES.MEMBER,
    },
    {
      name: "Viewer User",
      email: "viewer@example.com",
      role: ROLES.VIEWER,
    },
  ]

  for (const user of demoUsers) {
    // Check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("email", user.email)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error(`Error checking for user ${user.email}:`, checkError)
      continue
    }

    if (!existingUser) {
      // Create new user
      const { error: createError } = await supabase.from("users").insert([
        {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      ])

      if (createError) {
        console.error(`Error creating user ${user.email}:`, createError)
      } else {
        console.log(`Created ${user.role} user: ${user.email}`)
      }
    } else {
      // Update existing user
      const { error: updateError } = await supabase.from("users").update({ role: user.role }).eq("id", existingUser.id)

      if (updateError) {
        console.error(`Error updating user ${user.email}:`, updateError)
      } else {
        console.log(`Updated ${user.email} to ${user.role} role`)
      }
    }
  }

  console.log("Seed completed successfully!")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

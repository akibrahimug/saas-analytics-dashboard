import { PrismaClient } from "@prisma/client"
import { ROLES } from "../lib/roles"

const prisma = new PrismaClient()

async function main() {
  // Find the first user to make them an admin
  const firstUser = await prisma.user.findFirst({
    orderBy: {
      createdAt: "asc",
    },
  })

  if (firstUser) {
    console.log(`Setting user ${firstUser.email} as admin...`)
    await prisma.user.update({
      where: { id: firstUser.id },
      data: { role: ROLES.ADMIN },
    })
    console.log("Admin role assigned successfully!")
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
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    })

    if (!existingUser) {
      await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
      console.log(`Created ${user.role} user: ${user.email}`)
    } else {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { role: user.role },
      })
      console.log(`Updated ${user.email} to ${user.role} role`)
    }
  }

  console.log("Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

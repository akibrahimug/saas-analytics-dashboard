import { UserRoleManagement } from "@/components/user-role-management"

// Mock users data
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    image: "/abstract-geometric-shapes.png",
    role: "admin",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    image: "/abstract-geometric-shapes.png",
    role: "manager",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    image: "/diverse-group-collaborating.png",
    role: "member",
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice@example.com",
    image: "/abstract-geometric-shapes.png",
    role: "viewer",
  },
  {
    id: "5",
    name: "Demo User",
    email: "demo@example.com",
    image: "/abstract-geometric-shapes.png",
    role: "admin",
  },
]

export default async function UsersAdminPage() {
  // Use mock users instead of fetching from database
  const users = mockUsers

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage user roles and permissions</p>
      </div>

      <UserRoleManagement users={users} />
    </div>
  )
}

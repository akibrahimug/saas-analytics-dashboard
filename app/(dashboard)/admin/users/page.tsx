import { UserRoleManagement } from "@/components/user-role-management"
import { db } from "@/lib/db"

export default async function UsersAdminPage() {
  // Fetch mock users
  const users = await db.user.findMany()

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

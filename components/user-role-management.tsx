"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { ROLES, getRoleName } from "@/lib/roles"
import { useDemoAuth } from "@/lib/demo-auth"

// Demo users for the table
const demoUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    image: "/abstract-geometric-shapes.png",
    role: ROLES.ADMIN,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    image: "/abstract-geometric-shapes.png",
    role: ROLES.MANAGER,
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    image: "/diverse-group-collaborating.png",
    role: ROLES.MEMBER,
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice@example.com",
    image: "/abstract-geometric-shapes.png",
    role: ROLES.VIEWER,
  },
  {
    id: "5",
    name: "Demo User",
    email: "demo@example.com",
    image: "/abstract-geometric-shapes.png",
    role: ROLES.ADMIN,
  },
]

interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: string
}

interface UserRoleManagementProps {
  users?: User[]
}

export function UserRoleManagement({ users = demoUsers }: UserRoleManagementProps) {
  const router = useRouter()
  const { session, setRole } = useDemoAuth()
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({})
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>(
    users.reduce((acc, user) => ({ ...acc, [user.id]: user.role }), {}),
  )

  const handleRoleChange = (userId: string, role: string) => {
    setSelectedRoles((prev) => ({ ...prev, [userId]: role }))
  }

  const updateUserRole = async (userId: string) => {
    setIsUpdating((prev) => ({ ...prev, [userId]: true }))

    try {
      // If this is the demo user, update their role in the demo auth context
      if (userId === "5") {
        setRole(selectedRoles[userId])
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "Role updated",
        description: "The user's role has been updated successfully.",
      })

      // Refresh the page to show the updated role
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user role",
        variant: "destructive",
      })
    } finally {
      setIsUpdating((prev) => ({ ...prev, [userId]: false }))
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Current Role</TableHead>
            <TableHead>New Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                    <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.name || "Unnamed User"}</span>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="outline">{getRoleName(user.role)}</Badge>
              </TableCell>
              <TableCell>
                <Select value={selectedRoles[user.id]} onValueChange={(value) => handleRoleChange(user.id, value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ROLES.ADMIN}>{getRoleName(ROLES.ADMIN)}</SelectItem>
                    <SelectItem value={ROLES.MANAGER}>{getRoleName(ROLES.MANAGER)}</SelectItem>
                    <SelectItem value={ROLES.MEMBER}>{getRoleName(ROLES.MEMBER)}</SelectItem>
                    <SelectItem value={ROLES.VIEWER}>{getRoleName(ROLES.VIEWER)}</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateUserRole(user.id)}
                  disabled={isUpdating[user.id] || selectedRoles[user.id] === user.role}
                >
                  {isUpdating[user.id] ? "Updating..." : "Update Role"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

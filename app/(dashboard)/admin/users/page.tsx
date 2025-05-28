import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Search, UserPlus } from "lucide-react";

// Mock data for users
const users = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "admin",
    status: "active",
    lastActive: "2 hours ago",
    created: "Jan 15, 2023",
  },
  {
    id: 2,
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "editor",
    status: "active",
    lastActive: "1 day ago",
    created: "Feb 20, 2023",
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael@example.com",
    role: "viewer",
    status: "active",
    lastActive: "3 hours ago",
    created: "Mar 10, 2023",
  },
  {
    id: 4,
    name: "Jessica Lee",
    email: "jessica@example.com",
    role: "editor",
    status: "inactive",
    lastActive: "2 weeks ago",
    created: "Apr 5, 2023",
  },
  {
    id: 5,
    name: "David Smith",
    email: "david@example.com",
    role: "viewer",
    status: "active",
    lastActive: "5 days ago",
    created: "May 12, 2023",
  },
  {
    id: 6,
    name: "Emily Brown",
    email: "emily@example.com",
    role: "viewer",
    status: "pending",
    lastActive: "Never",
    created: "Oct 8, 2023",
  },
];

// Mock data for roles
const roles = [
  {
    id: 1,
    name: "Admin",
    description: "Full access to all resources",
    usersCount: 1,
    permissions: [
      "View dashboard",
      "Edit dashboard",
      "View team",
      "Manage team",
      "View settings",
      "Edit settings",
      "Access admin panel",
      "Manage users",
    ],
  },
  {
    id: 2,
    name: "Editor",
    description: "Can view and edit most content",
    usersCount: 2,
    permissions: [
      "View dashboard",
      "Edit dashboard",
      "View team",
      "View settings",
      "Edit settings",
    ],
  },
  {
    id: 3,
    name: "Viewer",
    description: "Can only view content",
    usersCount: 3,
    permissions: ["View dashboard", "View team"],
  },
];

function RoleBadge({ role }: { role: string }) {
  const variants: Record<string, { className: string; displayName: string }> = {
    admin: {
      className:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      displayName: "Admin",
    },
    editor: {
      className:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      displayName: "Editor",
    },
    viewer: {
      className:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      displayName: "Viewer",
    },
  };

  const { className, displayName } = variants[role] || {
    className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    displayName: role,
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {displayName}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<
    string,
    { variant: "default" | "outline" | "secondary" | "destructive" }
  > = {
    active: { variant: "default" },
    inactive: { variant: "secondary" },
    pending: { variant: "outline" },
  };

  const variant = variants[status]?.variant || "outline";

  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  );
}

export default function UserManagementPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">User Management</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage users, roles, and permissions
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4 mt-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8 w-full sm:max-w-xs"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full sm:w-auto">
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <table className="min-w-full divide-y">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="w-12 px-4 py-3">
                        <Checkbox />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Last Active
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y">
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <Checkbox />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <RoleBadge role={user.role} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={user.status} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                          {user.lastActive}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                          {user.created}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>Edit User</DropdownMenuItem>
                              <DropdownMenuItem>Change Role</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Deactivate
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">System Roles</h2>
              <p className="text-sm text-muted-foreground">
                Manage roles and their permissions
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{role.name}</CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-sm font-medium">
                      Users with this role:
                    </span>
                    <span className="ml-2 font-bold">{role.usersCount}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Permissions:</h4>
                    <ul className="space-y-1">
                      {role.permissions.map((permission, index) => (
                        <li key={index} className="flex items-center">
                          <Checkbox
                            id={`permission-${role.id}-${index}`}
                            defaultChecked
                          />
                          <label
                            htmlFor={`permission-${role.id}-${index}`}
                            className="ml-2 text-sm font-medium"
                          >
                            {permission}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

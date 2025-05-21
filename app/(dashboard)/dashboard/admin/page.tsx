"use client"

import { useDemo, ROLES, ROLE_NAMES } from "@/lib/demo-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function AdminPage() {
  const { isAdmin } = useDemo()

  if (!isAdmin) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You need administrator privileges to access this page. Please switch to the Admin role.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Administrative controls and settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage users and their roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left">User</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Role</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(ROLES).map((role, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">Demo User {index + 1}</td>
                    <td className="p-2">user{index + 1}@example.com</td>
                    <td className="p-2">{ROLE_NAMES[role]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

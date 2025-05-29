"use client";

import { useDemoAuth } from "@/lib/demo-auth";
import { ROLES, hasPermission, PERMISSIONS } from "@/lib/roles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function TeamPage() {
  const { session } = useDemoAuth();
  const canAccess = session?.user?.role
    ? hasPermission(session.user.role, "VIEW_TEAM" as keyof typeof PERMISSIONS)
    : false;

  if (!canAccess) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You need at least Viewer privileges to access team information. Please
          switch to a higher role.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team</h1>
        <p className="text-muted-foreground">View and manage your team</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>View all members of your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Role</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">John Doe</td>
                  <td className="p-2">john@example.com</td>
                  <td className="p-2">Developer</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Jane Smith</td>
                  <td className="p-2">jane@example.com</td>
                  <td className="p-2">Designer</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Bob Johnson</td>
                  <td className="p-2">bob@example.com</td>
                  <td className="p-2">Manager</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

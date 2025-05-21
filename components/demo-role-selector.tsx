"use client"

import { useDemoAuth } from "@/lib/demo-auth"
import { ROLES, getRoleName } from "@/lib/roles"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RoleBadge } from "@/components/role-badge"

export function DemoRoleSelector() {
  const { session, setRole } = useDemoAuth()

  if (!session) return null

  return (
    <Card className="mb-6 border-dashed border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
          Demo Mode
          <RoleBadge role={session.user.role} />
        </CardTitle>
        <CardDescription className="text-yellow-600 dark:text-yellow-500">
          Switch roles to test different permission levels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={session.user.role} onValueChange={setRole}>
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
      </CardContent>
    </Card>
  )
}

"use client"

import { useDemo, ROLES, ROLE_NAMES } from "@/lib/demo-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export function RoleSelector() {
  const { user, setUserRole } = useDemo()

  const getBadgeVariant = (role: string) => {
    switch (role) {
      case ROLES.ADMIN:
        return "destructive"
      case ROLES.MANAGER:
        return "default"
      case ROLES.MEMBER:
        return "secondary"
      case ROLES.VIEWER:
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <Card className="mb-6 border-dashed border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
          Demo Mode
          <Badge variant={getBadgeVariant(user.role)}>{ROLE_NAMES[user.role]}</Badge>
        </CardTitle>
        <CardDescription className="text-yellow-600 dark:text-yellow-500">
          Switch roles to test different permission levels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={user.role} onValueChange={setUserRole}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ROLES.ADMIN}>{ROLE_NAMES[ROLES.ADMIN]}</SelectItem>
            <SelectItem value={ROLES.MANAGER}>{ROLE_NAMES[ROLES.MANAGER]}</SelectItem>
            <SelectItem value={ROLES.MEMBER}>{ROLE_NAMES[ROLES.MEMBER]}</SelectItem>
            <SelectItem value={ROLES.VIEWER}>{ROLE_NAMES[ROLES.VIEWER]}</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}

import { Badge } from "@/components/ui/badge"
import { getRoleName } from "@/lib/roles"

interface RoleBadgeProps {
  role: string
  className?: string
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const getVariant = () => {
    switch (role) {
      case "admin":
        return "destructive"
      case "manager":
        return "default"
      case "member":
        return "secondary"
      case "viewer":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <Badge variant={getVariant()} className={className}>
      {getRoleName(role)}
    </Badge>
  )
}

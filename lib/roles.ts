// Define all possible permissions in the system
export const PERMISSIONS = {
  // Dashboard permissions
  VIEW_DASHBOARD: "view_dashboard",

  // Team permissions
  VIEW_TEAM: "view_team",
  MANAGE_TEAM: "manage_team",

  // Project permissions
  VIEW_PROJECTS: "view_projects",
  MANAGE_PROJECTS: "manage_projects",

  // User management permissions
  VIEW_USERS: "view_users",
  MANAGE_USERS: "manage_users",

  // Settings permissions
  VIEW_SETTINGS: "view_settings",
  MANAGE_SETTINGS: "manage_settings",

  // Admin permissions
  ACCESS_ADMIN: "access_admin",
  MANAGE_ROLES: "manage_roles",
} as const

export type Permission = keyof typeof PERMISSIONS

// Define the available roles and their permissions
export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  MEMBER: "member",
  VIEWER: "viewer",
} as const

export type Role = keyof typeof ROLES

// Map roles to their permissions
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  [ROLES.ADMIN]: Object.keys(PERMISSIONS) as Permission[],
  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_TEAM,
    PERMISSIONS.MANAGE_TEAM,
    PERMISSIONS.VIEW_PROJECTS,
    PERMISSIONS.MANAGE_PROJECTS,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.MANAGE_SETTINGS,
  ],
  [ROLES.MEMBER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_TEAM,
    PERMISSIONS.VIEW_PROJECTS,
    PERMISSIONS.VIEW_SETTINGS,
  ],
  [ROLES.VIEWER]: [PERMISSIONS.VIEW_DASHBOARD, PERMISSIONS.VIEW_TEAM, PERMISSIONS.VIEW_PROJECTS],
}

// Helper function to check if a role has a specific permission
export function hasPermission(role: string, permission: Permission): boolean {
  if (!role || !permission) return false

  // Admin has all permissions
  if (role === ROLES.ADMIN) return true

  // Check if the role exists in our mapping
  if (!(role in ROLE_PERMISSIONS)) return false

  // Check if the permission is included in the role's permissions
  return ROLE_PERMISSIONS[role].includes(permission)
}

// Helper function to get all permissions for a role
export function getPermissionsForRole(role: string): Permission[] {
  if (!role || !(role in ROLE_PERMISSIONS)) return []
  return ROLE_PERMISSIONS[role]
}

// Get a human-readable name for a role
export function getRoleName(role: string): string {
  switch (role) {
    case ROLES.ADMIN:
      return "Administrator"
    case ROLES.MANAGER:
      return "Team Manager"
    case ROLES.MEMBER:
      return "Team Member"
    case ROLES.VIEWER:
      return "Viewer"
    default:
      return "Unknown Role"
  }
}

// Get a description for a role
export function getRoleDescription(role: string): string {
  switch (role) {
    case ROLES.ADMIN:
      return "Full access to all features and settings"
    case ROLES.MANAGER:
      return "Can manage teams, projects, and view all data"
    case ROLES.MEMBER:
      return "Can view dashboard and participate in team activities"
    case ROLES.VIEWER:
      return "Read-only access to dashboard and team data"
    default:
      return ""
  }
}

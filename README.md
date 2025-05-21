# Remote Team Analytics Dashboard

A SaaS web application that helps remote teams and managers track productivity and engagement through a modern dashboard. It displays key performance indicators (KPIs) such as task completion rates, project progress, and communication metrics in real time.

## Features

- Interactive charts and graphs for data visualization
- Customizable dashboard layout with widgets for different metrics
- News/announcements feed for team updates
- User authentication with multiple providers (Google, GitHub, Email/Password)
- Role-based access control with different permission levels
- Dark/light mode switch for user preference
- Settings panel for configuring alerts or thresholds
- Responsive design for all device sizes
- Collapsible sidebar navigation

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Server Actions
- **Authentication**: NextAuth.js with multiple providers (Google, GitHub, Email/Password)
- **Database**: PostgreSQL with Prisma for user data, Upstash Redis for real-time data
- **Styling**: Tailwind CSS with dark mode support
- **Charts**: Recharts with shadcn/ui chart components

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Upstash Redis account
- Google OAuth credentials (optional)
- GitHub OAuth credentials (optional)

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/akibrahimug/saas-analytics-dashboard
   cd remote-team-analytics
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   \`\`\`
   # Database
   POSTGRES_PRISMA_URL=your_postgres_connection_string
   
   # Redis
   REDIS_URL=your_upstash_redis_url
   KV_REST_API_TOKEN=your_upstash_redis_token
   
   # NextAuth.js
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   
   # OAuth Providers (optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   \`\`\`

4. Initialize the database:
   \`\`\`bash
   npx prisma migrate dev --name init
   \`\`\`

5. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Implementations

### Role-Based Access Control (RBAC)

The application implements a comprehensive role-based access control system that defines different user roles with varying permission levels:

#### User Roles

- **Administrator**: Full access to all features and settings
- **Manager**: Can manage teams, projects, and view all data
- **Member**: Can view dashboard and participate in team activities
- **Viewer**: Read-only access to dashboard and team data

#### Permissions System

The RBAC system is built around a granular permissions model:

\`\`\`typescript
// Define all possible permissions in the system
export const PERMISSIONS = {
  VIEW_DASHBOARD: "view_dashboard",
  MANAGE_TEAM: "manage_team",
  VIEW_PROJECTS: "view_projects",
  // ... more permissions
}
\`\`\`

Each role is assigned a set of permissions that determine what actions users with that role can perform:

\`\`\`typescript
// Map roles to their permissions
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.keys(PERMISSIONS) as Permission[],
  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_TEAM,
    // ... more permissions
  ],
  // ... other roles
}
\`\`\`

#### Implementation Components

1. **Permission Checking**:
   - Server-side permission validation with middleware
   - Client-side permission hooks for conditional rendering

2. **UI Components**:
   - `<PermissionGate>` component for conditionally rendering UI elements
   - Role badges to display user roles
   - Access denied pages for unauthorized access attempts

3. **Admin Interface**:
   - User role management interface for administrators
   - Role assignment and modification capabilities

4. **Database Integration**:
   - User roles stored in the database
   - Role information included in authentication tokens and sessions

#### Usage Examples

**Conditional Rendering Based on Permissions**:

\`\`\`tsx
<PermissionGate permission={PERMISSIONS.MANAGE_USERS}>
  <Button>Manage Users</Button>
</PermissionGate>
\`\`\`

**Server-Side Permission Checking**:

\`\`\`tsx
// Check if the user has permission to manage users
await checkPermission(PERMISSIONS.MANAGE_USERS)
\`\`\`

**Client-Side Permission Hooks**:

\`\`\`tsx
const { can, isAdmin } = usePermissions()

if (can(PERMISSIONS.MANAGE_SETTINGS)) {
  // Perform action that requires MANAGE_SETTINGS permission
}
\`\`\`

### Authentication with Multiple Providers

The application uses NextAuth.js to provide a secure and flexible authentication system that supports:

- Email/password authentication with secure password hashing
- Google OAuth for one-click sign-in
- GitHub OAuth for developer-friendly authentication
- Session management with JWT
- Protected routes via middleware

User authentication flow:
1. Users can sign up/in using their preferred method
2. For email/password, credentials are validated and passwords are securely hashed
3. For OAuth providers, users are redirected to the provider's login page
4. After successful authentication, users are redirected to the dashboard
5. Session information is stored in cookies and the database

The authentication system includes:
- User registration and login pages
- Account linking capabilities
- Secure session management
- Role-based access control

### Redis Integration

We've implemented a comprehensive real-time data update system for the dashboard using Upstash Redis. This allows the dashboard to display live metrics without requiring page refreshes.

#### Redis Client Setup

- Created a Redis client utility that connects to the Upstash Redis instance
- Defined key prefixes for different data types to organize Redis storage
- Implemented helper functions for channel names and data retrieval

\`\`\`typescript
// lib/redis.ts
import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: process.env.REDIS_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
})

export const KEYS = {
  TEAM_PERFORMANCE: "team:performance",
  TASK_COMPLETION: "task:completion",
  PROJECT_PROGRESS: "project:progress",
  KPI_METRICS: "kpi:metrics",
  ANNOUNCEMENTS: "announcements",
  LAST_UPDATED: "last_updated",
}
\`\`\`

#### Server-Side Data Management

- Created server actions to fetch and update data in Redis
- Added type definitions for all data structures
- Implemented revalidation to ensure fresh data
- Provided default data when Redis is empty

\`\`\`typescript
// Example server action
export async function updateKpiMetrics(data: KpiMetric) {
  await redis.set(KEYS.KPI_METRICS, JSON.stringify(data))
  await redis.set(KEYS.LAST_UPDATED, new Date().toISOString())
  revalidatePath("/dashboard")
  return { success: true }
}
\`\`\`

#### Real-Time Updates with Server-Sent Events (SSE)

- Created an SSE API route that establishes a persistent connection with clients
- Implemented polling mechanism to check for data changes in Redis
- Added error handling and reconnection logic
- Created a custom React hook (`useRealTimeData`) to consume SSE data

\`\`\`typescript
// Custom hook for real-time data
export function useRealTimeData<T>(dataType: DataType, initialData: T) {
  const [data, setData] = useState<T>(initialData)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // SSE connection logic...
  
  return { data, lastUpdated, isConnected, error }
}
\`\`\`

#### Dashboard Components

- Modified all dashboard components to use real-time data
- Added visual indicators for live data connections
- Implemented error handling for connection issues
- Added a "Last Updated" component that shows when data was last refreshed

\`\`\`tsx
// Example component using real-time data
export function KpiCards({ initialData }: KpiCardsProps) {
  const { data, error } = useRealTimeData<KpiMetric>("kpi", initialData)
  
  // Component rendering...
}
\`\`\`

#### Testing and Simulation Tools

- Created an admin panel to simulate data updates
- Added API routes to generate random data changes
- Implemented toast notifications for update confirmations

\`\`\`tsx
// Admin panel for testing
export function AdminPanel() {
  // Simulation functions...
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Panel</CardTitle>
        <CardDescription>Simulate real-time data updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Button onClick={() => simulateUpdate("kpi")}>Update KPIs</Button>
          {/* Other buttons... */}
        </div>
      </CardContent>
    </Card>
  )
}
\`\`\`

#### User Experience Improvements

- Added loading states with Suspense
- Included visual indicators for real-time connections
- Implemented error handling and recovery mechanisms
- Added a "Live" badge to show when real-time updates are active

#### How It Works

1. **Initial Load**: The dashboard fetches initial data from Redis via server actions
2. **Real-Time Connection**: Client components establish SSE connections to listen for updates
3. **Data Updates**: When data changes in Redis, the SSE connection pushes updates to clients
4. **Visual Feedback**: Components show live indicators and update timestamps
5. **Error Handling**: If connections fail, the system attempts to reconnect with exponential backoff

#### Testing the Real-Time Updates

You can test the real-time functionality by:

1. Navigate to the Admin page via the sidebar
2. Use the buttons to simulate updates to different data types
3. Watch as the dashboard components update in real-time without page refreshes

## Project Structure

\`\`\`
remote-team-analytics/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authentication routes
│   ├── (dashboard)/        # Dashboard routes
│   ├── api/                # API routes
│   │   ├── auth/           # NextAuth.js API routes
│   │   ├── sse/            # Server-Sent Events API
│   │   └── users/          # User management API
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── ui/                 # UI components (shadcn/ui)
│   └── ...                 # Dashboard components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
│   ├── actions.ts          # Server actions
│   ├── auth.ts             # NextAuth.js configuration
│   ├── db.ts               # Prisma client
│   ├── redis.ts            # Redis client
│   ├── roles.ts            # Role and permission definitions
│   ├── permissions.ts      # Permission utilities
│   ├── session.ts          # Session utilities
│   └── utils.ts            # Utility functions
├── prisma/                 # Prisma schema and migrations
│   └── schema.prisma       # Database schema
├── public/                 # Static assets
└── ...                     # Config files
\`\`\`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

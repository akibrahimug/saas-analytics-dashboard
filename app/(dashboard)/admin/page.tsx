import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Server,
  Shield,
  Users,
} from "lucide-react";

// Mock data for system status
const systemStatus = {
  cpu: 32,
  memory: 64,
  disk: 42,
  uptime: "23 days, 4 hours",
  lastDeployment: "Oct 15, 2023 (3 days ago)",
  activeUsers: 128,
  serverStatus: "operational",
};

// Mock data for recent system events
const systemEvents = [
  {
    id: 1,
    event: "Server Restart",
    status: "completed",
    timestamp: "Oct 15, 2023 14:30",
    description: "Scheduled maintenance restart completed successfully",
  },
  {
    id: 2,
    event: "Database Backup",
    status: "completed",
    timestamp: "Oct 15, 2023 02:00",
    description: "Automated daily backup completed successfully",
  },
  {
    id: 3,
    event: "High CPU Usage",
    status: "warning",
    timestamp: "Oct 14, 2023 18:45",
    description: "CPU usage exceeded 80% for more than 5 minutes",
  },
  {
    id: 4,
    event: "New User Signups",
    status: "info",
    timestamp: "Oct 14, 2023 10:15",
    description: "25 new users signed up in the last 24 hours",
  },
  {
    id: 5,
    event: "API Rate Limit Reached",
    status: "warning",
    timestamp: "Oct 13, 2023 16:20",
    description: "External API rate limit reached for analytics endpoint",
  },
];

// Mock data for registered services
const registeredServices = [
  {
    id: 1,
    name: "Authentication Service",
    status: "online",
    lastPing: "2 minutes ago",
    version: "v1.2.5",
  },
  {
    id: 2,
    name: "Analytics API",
    status: "online",
    lastPing: "1 minute ago",
    version: "v2.0.1",
  },
  {
    id: 3,
    name: "Email Service",
    status: "online",
    lastPing: "5 minutes ago",
    version: "v1.1.0",
  },
  {
    id: 4,
    name: "Payment Processing",
    status: "offline",
    lastPing: "2 hours ago",
    version: "v1.3.2",
  },
  {
    id: 5,
    name: "Storage Service",
    status: "degraded",
    lastPing: "10 minutes ago",
    version: "v2.1.0",
  },
];

function StatusBadge({ status }: { status: string }) {
  const variants: Record<
    string,
    {
      variant: "default" | "outline" | "secondary" | "destructive";
      label: string;
    }
  > = {
    online: { variant: "default", label: "Online" },
    offline: { variant: "destructive", label: "Offline" },
    degraded: { variant: "secondary", label: "Degraded" },
    warning: { variant: "secondary", label: "Warning" },
    info: { variant: "outline", label: "Info" },
    completed: { variant: "default", label: "Completed" },
    operational: { variant: "default", label: "Operational" },
  };

  const { variant, label } = variants[status] || {
    variant: "outline",
    label: status,
  };

  return <Badge variant={variant}>{label}</Badge>;
}

function SystemStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array(6)
        .fill(null)
        .map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/3" />
            </CardContent>
          </Card>
        ))}
    </div>
  );
}

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Panel</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage system settings and monitor performance
        </p>
      </div>

      <Tabs defaultValue="system">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-6 mt-6">
          <Suspense fallback={<SystemStatsSkeleton />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Server className="mr-2 h-5 w-5" />
                    CPU Usage
                  </CardTitle>
                  <CardDescription>Current server load</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {systemStatus.cpu}%
                  </div>
                  <Progress value={systemStatus.cpu} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Server className="mr-2 h-5 w-5" />
                    Memory Usage
                  </CardTitle>
                  <CardDescription>RAM allocation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {systemStatus.memory}%
                  </div>
                  <Progress value={systemStatus.memory} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Server className="mr-2 h-5 w-5" />
                    Disk Usage
                  </CardTitle>
                  <CardDescription>Storage capacity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {systemStatus.disk}%
                  </div>
                  <Progress value={systemStatus.disk} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Uptime
                  </CardTitle>
                  <CardDescription>Time since last restart</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {systemStatus.uptime}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Active Users
                  </CardTitle>
                  <CardDescription>Currently online</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {systemStatus.activeUsers}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    System Status
                  </CardTitle>
                  <CardDescription>Overall health</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <StatusBadge status={systemStatus.serverStatus} />
                    <Button variant="ghost" size="sm" className="ml-auto">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Suspense>

          <Card>
            <CardHeader>
              <CardTitle>Recent System Events</CardTitle>
              <CardDescription>
                Events and alerts from the last 72 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="mr-4 mt-0.5">
                      {event.status === "completed" && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                      {(event.status === "warning" ||
                        event.status === "info") && (
                        <AlertTriangle
                          className={`h-5 w-5 ${
                            event.status === "warning"
                              ? "text-amber-500"
                              : "text-blue-500"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{event.event}</h4>
                        <StatusBadge status={event.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {event.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Registered Services</CardTitle>
              <CardDescription>Status of system microservices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Version
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Last Ping
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y">
                    {registeredServices.map((service) => (
                      <tr key={service.id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium">{service.name}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={service.status} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {service.version}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                          {service.lastPing}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                          <Button size="sm" variant="outline">
                            Restart
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>
                Recent system activity and error logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 font-mono text-sm p-4 rounded-md h-96 overflow-auto">
                <div>
                  [2023-10-15 14:30:22] INFO: Server restart initiated by admin
                </div>
                <div>
                  [2023-10-15 14:31:15] INFO: Server restart completed
                  successfully
                </div>
                <div>[2023-10-15 14:32:00] INFO: All services initialized</div>
                <div>
                  [2023-10-15 15:12:35] WARNING: High CPU usage detected (85%)
                </div>
                <div>
                  [2023-10-15 15:14:22] INFO: CPU usage normalized (42%)
                </div>
                <div>[2023-10-15 18:22:41] INFO: Database backup started</div>
                <div>
                  [2023-10-15 18:25:16] INFO: Database backup completed
                  successfully
                </div>
                <div>
                  [2023-10-16 02:00:00] INFO: Automated daily backup started
                </div>
                <div>
                  [2023-10-16 02:03:12] INFO: Automated daily backup completed
                </div>
                <div>
                  [2023-10-16 09:12:38] ERROR: Payment service connection
                  timeout
                </div>
                <div>
                  [2023-10-16 09:15:45] ERROR: Payment service reconnection
                  failed
                </div>
                <div>
                  [2023-10-16 09:22:18] WARNING: Payment service offline for
                  more than 10 minutes
                </div>
                <div>
                  [2023-10-16 10:30:52] INFO: User authentication rate increased
                  (25 logins/minute)
                </div>
                <div>
                  [2023-10-16 12:45:10] WARNING: Storage service performance
                  degraded
                </div>
                <div>
                  [2023-10-16 13:05:22] INFO: Storage service performance
                  optimization started
                </div>
                <div>
                  [2023-10-16 13:15:40] INFO: Storage service performance
                  improved but still suboptimal
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

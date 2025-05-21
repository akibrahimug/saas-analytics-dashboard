import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Remote Team Analytics Dashboard</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
            <CardDescription>Overview of your team's performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-muted/50 flex items-center justify-center rounded-md">Chart Placeholder</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Completion</CardTitle>
            <CardDescription>Task completion rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-muted/50 flex items-center justify-center rounded-md">Chart Placeholder</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Latest team announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-muted/50 flex items-center justify-center rounded-md">
              Announcements Placeholder
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

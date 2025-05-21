"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

export function NotificationSettings() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Email Notifications</h3>
            <p className="text-sm text-muted-foreground">Configure which emails you want to receive</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="task-updates">Task Updates</Label>
                <p className="text-sm text-muted-foreground">Receive emails when tasks are assigned or updated</p>
              </div>
              <Switch id="task-updates" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="team-activity">Team Activity</Label>
                <p className="text-sm text-muted-foreground">Get notified about your team's activity</p>
              </div>
              <Switch id="team-activity" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="announcements">Announcements</Label>
                <p className="text-sm text-muted-foreground">Receive important announcements and updates</p>
              </div>
              <Switch id="announcements" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="weekly-digest">Weekly Digest</Label>
                <p className="text-sm text-muted-foreground">Get a weekly summary of your team's performance</p>
              </div>
              <Switch id="weekly-digest" />
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-lg font-medium">In-App Notifications</h3>
            <p className="text-sm text-muted-foreground">Configure which notifications appear in the app</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="messages">Messages</Label>
                <p className="text-sm text-muted-foreground">Show notifications for new messages</p>
              </div>
              <Switch id="messages" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="mentions">Mentions</Label>
                <p className="text-sm text-muted-foreground">Notify when someone mentions you</p>
              </div>
              <Switch id="mentions" defaultChecked />
            </div>
          </div>

          <Button>Save preferences</Button>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRealTimeData } from "@/hooks/use-real-time-data"
import type { Announcement } from "@/lib/actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface AnnouncementsFeedProps {
  initialAnnouncements: Announcement[]
}

export function AnnouncementsFeed({ initialAnnouncements }: AnnouncementsFeedProps) {
  const {
    data: announcements,
    error,
    isConnected,
  } = useRealTimeData<Announcement[]>("announcements", initialAnnouncements)

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Latest team updates and announcements</CardDescription>
          </div>
          {isConnected && <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" title="Live data" />}
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <ScrollArea className="h-[250px] sm:h-[300px] md:h-[350px] pr-4">
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="flex gap-4">
                <Avatar>
                  <AvatarImage src={announcement.author.avatar || "/placeholder.svg"} alt={announcement.author.name} />
                  <AvatarFallback>{announcement.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{announcement.author.name}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(announcement.date), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm">{announcement.content}</p>
                  {announcement.link && (
                    <a
                      href={announcement.link.url}
                      className="text-xs text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {announcement.link.text}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

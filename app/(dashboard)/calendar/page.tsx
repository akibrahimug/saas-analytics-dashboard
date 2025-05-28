import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { getUserData } from "@/lib/auth";

// Generate days for the current month
function generateCalendarDays(events: any[] = []) {
  const days = [];
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();

  // Get the first day of the month
  const firstDay = new Date(year, month, 1);
  // Get the last day of the month
  const lastDay = new Date(year, month + 1, 0);

  // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDay.getDay();

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push({ day: null, date: null, events: [] });
  }

  // Add cells for each day of the month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const currentDate = new Date(year, month, day);
    const dateString = currentDate.toISOString().split("T")[0];

    // Find events for this day
    const dayEvents = events.filter((event) => event.date === dateString);

    days.push({
      day,
      date: dateString,
      events: dayEvents,
      isToday:
        day === new Date().getDate() &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear(),
    });
  }

  return days;
}

function getEventBadgeColor(type: string) {
  switch (type) {
    case "meeting":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "deadline":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "call":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "planning":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "event":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
}

export default async function CalendarPage() {
  // Fetch user data from the server
  const userData = await getUserData();
  const events = userData?.events || [];

  const calendarDays = generateCalendarDays(events);
  const currentMonth = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get upcoming events (next 7 days)
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= today && eventDate <= nextWeek;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Calendar</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          View and manage your schedule and events
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Calendar */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>{currentMonth}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Days of week headers */}
              {daysOfWeek.map((day) => (
                <div key={day} className="text-center font-medium text-sm py-2">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`
                    h-24 border rounded-lg p-1 overflow-hidden 
                    ${!day.day ? "bg-muted/20" : ""}
                    ${day.isToday ? "border-primary" : ""}
                  `}
                >
                  {day.day && (
                    <>
                      <div className="text-right text-sm">
                        <span
                          className={`
                          ${
                            day.isToday
                              ? "bg-primary text-primary-foreground rounded-full h-6 w-6 inline-flex items-center justify-center"
                              : ""
                          }
                        `}
                        >
                          {day.day}
                        </span>
                      </div>
                      <div className="mt-1 overflow-hidden space-y-1">
                        {day.events.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs truncate ${getEventBadgeColor(
                              event.type
                            )} px-1 py-0.5 rounded`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {day.events.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{day.events.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Upcoming Events</CardTitle>
            <Button size="sm" variant="outline">
              <Plus className="mr-1 h-4 w-4" />
              Add Event
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No upcoming events for the next 7 days
                </p>
              ) : (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        <div className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-sm">{event.time}</div>
                      </div>
                      <Badge className={getEventBadgeColor(event.type)}>
                        {event.type}
                      </Badge>
                    </div>
                    {event.description && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        {event.description}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

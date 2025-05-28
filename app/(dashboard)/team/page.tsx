import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserData } from "@/lib/auth";

function TeamMemberSkeleton() {
  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-8 w-24" />
    </div>
  );
}

export default async function TeamPage() {
  // Fetch user data from the server
  const userData = await getUserData();
  const teamMembers = userData?.team || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Team</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          View and manage your team members and their performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Team Size</CardTitle>
            <CardDescription>Total active members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{teamMembers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Online Members</CardTitle>
            <CardDescription>Currently available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {
                teamMembers.filter((member) => member.status === "online")
                  .length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Tasks</CardTitle>
            <CardDescription>Completed and pending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {teamMembers.reduce(
                (total, member) =>
                  total + member.tasks.completed + member.tasks.pending,
                0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>View and manage team member details</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <div className="space-y-4">
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <TeamMemberSkeleton key={i} />
                  ))}
              </div>
            }
          >
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {member.role}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <div>
                        Tasks: {member.tasks.completed} /{" "}
                        {member.tasks.completed + member.tasks.pending}
                      </div>
                      <div>Projects: {member.activeProjects}</div>
                    </div>
                    <Badge
                      variant={
                        member.status === "online"
                          ? "default"
                          : member.status === "away"
                          ? "outline"
                          : "secondary"
                      }
                    >
                      {member.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

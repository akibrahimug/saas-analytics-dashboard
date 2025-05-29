"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  Phone,
  Github,
  Twitter,
  Linkedin,
  Edit,
  CheckCircle,
  Clock,
  Users,
  BarChart2,
  FileText,
  MessageSquare,
  Activity,
} from "lucide-react";
import { useDemoAuth } from "@/lib/demo-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RoleBadge } from "@/components/role-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemoMode } from "@/lib/DemoModeContext";

// Loading skeleton component
function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-64" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-[350px] rounded-lg" />
        <Skeleton className="h-[350px] rounded-lg lg:col-span-2" />
      </div>

      <Skeleton className="h-[300px] rounded-lg" />
    </div>
  );
}

// Real auth profile page
function RealAuthProfile() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data from API endpoint
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/user");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data.userData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate first name for avatar fallback
  const getFirstName = (fullName: string | null | undefined) => {
    if (!fullName) return "U";
    return fullName.split(" ")[0];
  };

  const getAvatarFallback = (fullName: string | null | undefined) => {
    if (!fullName) return "U";
    const firstName = getFirstName(fullName);
    return firstName.charAt(0).toUpperCase();
  };

  // Mock projects data (in a real app, this would come from the API)
  const projects = [
    {
      id: 1,
      name: "Analytics Dashboard",
      progress: 85,
      status: "In Progress",
      dueDate: "Oct 15, 2023",
      role: "Project Lead",
      teamSize: 4,
    },
    {
      id: 2,
      name: "Mobile App Redesign",
      progress: 60,
      status: "In Progress",
      dueDate: "Nov 30, 2023",
      role: "UX Contributor",
      teamSize: 5,
    },
    {
      id: 3,
      name: "API Integration",
      progress: 100,
      status: "Completed",
      dueDate: "Sep 1, 2023",
      role: "Backend Lead",
      teamSize: 3,
    },
  ];

  // Mock activity data
  const activities = [
    {
      id: 1,
      type: "comment",
      target: "Analytics Dashboard",
      content: "Added new comments on the KPI metrics design",
      timestamp: "2 hours ago",
      icon: MessageSquare,
    },
    {
      id: 2,
      type: "task",
      target: "Mobile App Redesign",
      content: "Completed the navigation component",
      timestamp: "Yesterday",
      icon: CheckCircle,
    },
    {
      id: 3,
      type: "meeting",
      target: "Weekly Team Sync",
      content: "Participated in the weekly strategy meeting",
      timestamp: "2 days ago",
      icon: Users,
    },
    {
      id: 4,
      type: "document",
      target: "Product Requirements",
      content: "Updated the Q4 product roadmap document",
      timestamp: "3 days ago",
      icon: FileText,
    },
    {
      id: 5,
      type: "analytics",
      target: "Performance Review",
      content: "Reviewed monthly dashboard analytics",
      timestamp: "1 week ago",
      icon: BarChart2,
    },
  ];

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <div className="text-xl font-semibold text-destructive">
          Error loading profile
        </div>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const team = userData?.team || [];

  // Calculate statistics based on team data
  const totalTasks = team.reduce(
    (sum: number, member: any) =>
      sum + (member.tasks?.completed || 0) + (member.tasks?.pending || 0),
    0
  );

  const completedTasks = team.reduce(
    (sum: number, member: any) => sum + (member.tasks?.completed || 0),
    0
  );

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">My Profile</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          View and manage your profile information and work activities
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle>Profile Information</CardTitle>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage
                  src={session?.user?.image || ""}
                  alt={session?.user?.name || "User"}
                />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {getAvatarFallback(session?.user?.name)}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">{session?.user?.name}</h3>
              <div className="mt-1 mb-3">
                <RoleBadge role={session?.user?.role as string} />
              </div>
              <p className="text-muted-foreground text-center">
                Product designer specializing in UI/UX with expertise in data
                visualization and analytics dashboards
              </p>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{session?.user?.email}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>SaaS Analytics Inc.</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Joined January 2023</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between">
              <Button variant="outline" size="sm" className="w-full">
                <Github className="h-4 w-4 mr-2" />
                Github
              </Button>
              <Button variant="outline" size="sm" className="w-full mx-2">
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Work Statistics Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Work Overview</CardTitle>
            <CardDescription>
              Your work statistics and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                    <h4 className="text-xl font-bold">{completedTasks}</h4>
                    <p className="text-sm text-muted-foreground">
                      Tasks Completed
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <Clock className="h-8 w-8 text-yellow-500 mb-2" />
                    <h4 className="text-xl font-bold">
                      {totalTasks - completedTasks}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Tasks Pending
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <Users className="h-8 w-8 text-blue-500 mb-2" />
                    <h4 className="text-xl font-bold">{projects.length}</h4>
                    <p className="text-sm text-muted-foreground">
                      Active Projects
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-lg font-semibold mb-4">Task Completion Rate</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-1">
                <span>Overall Progress</span>
                <span className="font-medium">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Team Collaboration
                  </h4>
                  <div className="flex items-center">
                    <Progress value={92} className="h-2 flex-1 mr-4" />
                    <span className="font-medium">92%</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Meeting Attendance
                  </h4>
                  <div className="flex items-center">
                    <Progress value={88} className="h-2 flex-1 mr-4" />
                    <span className="font-medium">88%</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Documentation</h4>
                  <div className="flex items-center">
                    <Progress value={75} className="h-2 flex-1 mr-4" />
                    <span className="font-medium">75%</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Code Reviews</h4>
                  <div className="flex items-center">
                    <Progress value={95} className="h-2 flex-1 mr-4" />
                    <span className="font-medium">95%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects and Activities */}
      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Projects</CardTitle>
              <CardDescription>
                Projects you're currently working on
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projects.map((project) => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{project.name}</h4>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <span className="mr-4">Role: {project.role}</span>
                          <span className="mr-4">
                            Team: {project.teamSize} members
                          </span>
                          <span>Due: {project.dueDate}</span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          project.status === "Completed" ? "outline" : "default"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex items-center">
                      <Progress
                        value={project.progress}
                        className="h-2 flex-1 mr-4"
                      />
                      <span className="text-sm font-medium">
                        {project.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                People you work with on projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {team.map((member: any) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-right mr-4">
                        <p className="text-sm font-medium">
                          {member.tasks.completed + member.tasks.pending} Tasks
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.tasks.completed} completed,{" "}
                          {member.tasks.pending} pending
                        </p>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-green-500 ml-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your activity across projects and teams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex">
                      <div className="mr-4 mt-0.5">
                        <div className="bg-muted p-2 rounded-full">
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="flex-1 border-b pb-4">
                        <div className="flex justify-between">
                          <p className="font-medium">{activity.target}</p>
                          <span className="text-sm text-muted-foreground">
                            {activity.timestamp}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{activity.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button variant="outline" className="w-full">
                <Activity className="h-4 w-4 mr-2" />
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Demo auth profile page
function DemoAuthProfile() {
  const { session } = useDemoAuth();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data from API endpoint with demo flag
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/user?demo=true");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data.userData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate first name for avatar fallback
  const getFirstName = (fullName: string | null | undefined) => {
    if (!fullName) return "U";
    return fullName.split(" ")[0];
  };

  const getAvatarFallback = (fullName: string | null | undefined) => {
    if (!fullName) return "U";
    const firstName = getFirstName(fullName);
    return firstName.charAt(0).toUpperCase();
  };

  // Mock projects data (in a real app, this would come from the API)
  const projects = [
    {
      id: 1,
      name: "Analytics Dashboard",
      progress: 85,
      status: "In Progress",
      dueDate: "Oct 15, 2023",
      role: "Project Lead",
      teamSize: 4,
    },
    {
      id: 2,
      name: "Mobile App Redesign",
      progress: 60,
      status: "In Progress",
      dueDate: "Nov 30, 2023",
      role: "UX Contributor",
      teamSize: 5,
    },
    {
      id: 3,
      name: "API Integration",
      progress: 100,
      status: "Completed",
      dueDate: "Sep 1, 2023",
      role: "Backend Lead",
      teamSize: 3,
    },
  ];

  // Mock activity data
  const activities = [
    {
      id: 1,
      type: "comment",
      target: "Analytics Dashboard",
      content: "Added new comments on the KPI metrics design",
      timestamp: "2 hours ago",
      icon: MessageSquare,
    },
    {
      id: 2,
      type: "task",
      target: "Mobile App Redesign",
      content: "Completed the navigation component",
      timestamp: "Yesterday",
      icon: CheckCircle,
    },
    {
      id: 3,
      type: "meeting",
      target: "Weekly Team Sync",
      content: "Participated in the weekly strategy meeting",
      timestamp: "2 days ago",
      icon: Users,
    },
    {
      id: 4,
      type: "document",
      target: "Product Requirements",
      content: "Updated the Q4 product roadmap document",
      timestamp: "3 days ago",
      icon: FileText,
    },
    {
      id: 5,
      type: "analytics",
      target: "Performance Review",
      content: "Reviewed monthly dashboard analytics",
      timestamp: "1 week ago",
      icon: BarChart2,
    },
  ];

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <div className="text-xl font-semibold text-destructive">
          Error loading profile
        </div>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const team = userData?.team || [];

  // Calculate statistics based on team data
  const totalTasks = team.reduce(
    (sum: number, member: any) =>
      sum + (member.tasks?.completed || 0) + (member.tasks?.pending || 0),
    0
  );

  const completedTasks = team.reduce(
    (sum: number, member: any) => sum + (member.tasks?.completed || 0),
    0
  );

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">My Profile</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          View and manage your profile information and work activities
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle>Profile Information</CardTitle>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage
                  src={session?.user?.image || ""}
                  alt={session?.user?.name || "User"}
                />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {getAvatarFallback(session?.user?.name)}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">{session?.user?.name}</h3>
              <div className="mt-1 mb-3">
                <RoleBadge role={session?.user?.role as string} />
              </div>
              <p className="text-muted-foreground text-center">
                Product designer specializing in UI/UX with expertise in data
                visualization and analytics dashboards
              </p>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{session?.user?.email}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>SaaS Analytics Inc.</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Joined January 2023</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between">
              <Button variant="outline" size="sm" className="w-full">
                <Github className="h-4 w-4 mr-2" />
                Github
              </Button>
              <Button variant="outline" size="sm" className="w-full mx-2">
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Work Statistics Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Work Overview</CardTitle>
            <CardDescription>
              Your work statistics and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                    <h4 className="text-xl font-bold">{completedTasks}</h4>
                    <p className="text-sm text-muted-foreground">
                      Tasks Completed
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <Clock className="h-8 w-8 text-yellow-500 mb-2" />
                    <h4 className="text-xl font-bold">
                      {totalTasks - completedTasks}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Tasks Pending
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <Users className="h-8 w-8 text-blue-500 mb-2" />
                    <h4 className="text-xl font-bold">{projects.length}</h4>
                    <p className="text-sm text-muted-foreground">
                      Active Projects
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-lg font-semibold mb-4">Task Completion Rate</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-1">
                <span>Overall Progress</span>
                <span className="font-medium">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Team Collaboration
                  </h4>
                  <div className="flex items-center">
                    <Progress value={92} className="h-2 flex-1 mr-4" />
                    <span className="font-medium">92%</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Meeting Attendance
                  </h4>
                  <div className="flex items-center">
                    <Progress value={88} className="h-2 flex-1 mr-4" />
                    <span className="font-medium">88%</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Documentation</h4>
                  <div className="flex items-center">
                    <Progress value={75} className="h-2 flex-1 mr-4" />
                    <span className="font-medium">75%</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Code Reviews</h4>
                  <div className="flex items-center">
                    <Progress value={95} className="h-2 flex-1 mr-4" />
                    <span className="font-medium">95%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects and Activities */}
      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Projects</CardTitle>
              <CardDescription>
                Projects you're currently working on
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projects.map((project) => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{project.name}</h4>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <span className="mr-4">Role: {project.role}</span>
                          <span className="mr-4">
                            Team: {project.teamSize} members
                          </span>
                          <span>Due: {project.dueDate}</span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          project.status === "Completed" ? "outline" : "default"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex items-center">
                      <Progress
                        value={project.progress}
                        className="h-2 flex-1 mr-4"
                      />
                      <span className="text-sm font-medium">
                        {project.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                People you work with on projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {team.map((member: any) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-right mr-4">
                        <p className="text-sm font-medium">
                          {member.tasks.completed + member.tasks.pending} Tasks
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.tasks.completed} completed,{" "}
                          {member.tasks.pending} pending
                        </p>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-green-500 ml-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your activity across projects and teams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex">
                      <div className="mr-4 mt-0.5">
                        <div className="bg-muted p-2 rounded-full">
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="flex-1 border-b pb-4">
                        <div className="flex justify-between">
                          <p className="font-medium">{activity.target}</p>
                          <span className="text-sm text-muted-foreground">
                            {activity.timestamp}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{activity.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button variant="outline" className="w-full">
                <Activity className="h-4 w-4 mr-2" />
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Main profile component that decides which implementation to use
export default function ProfilePage() {
  const { isDemo } = useDemoMode();

  // Render the appropriate profile based on auth mode
  return isDemo ? <DemoAuthProfile /> : <RealAuthProfile />;
}

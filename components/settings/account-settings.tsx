"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/simple-toast";
import { Camera, CreditCard, Edit, Save } from "lucide-react";
import { getUserProfile, setUserProfile } from "@/lib/storage";

type User = {
  id: string;
  name?: string | null;
  email?: string;
  image?: string | null;
  role?: string;
};

type AccountSettingsProps = {
  user: User | null;
};

export default function AccountSettings({ user }: AccountSettingsProps) {
  // Initialize form data with empty values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    jobTitle: "Product Manager", // Default value
    timezone: "america/new_york",
    bio: "Product Manager with 5+ years of experience in SaaS analytics dashboards.",
  });

  // Load data from localStorage on mount, with fallback to server data
  useEffect(() => {
    const storedProfile = getUserProfile();
    if (storedProfile) {
      // Load from local storage
      setFormData({
        name: storedProfile.name || user?.name || "",
        email: storedProfile.email || user?.email || "",
        jobTitle: storedProfile.jobTitle || "Product Manager",
        timezone: storedProfile.timezone || "america/new_york",
        bio:
          storedProfile.bio ||
          "Product Manager with 5+ years of experience in SaaS analytics dashboards.",
      });
    } else if (user) {
      // Initialize from server data if available
      setFormData({
        ...formData,
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    // Save to localStorage
    setUserProfile(formData);

    // In a real app, you would also send this data to your API
    console.log("Saving profile:", formData);

    // Show a toast notification
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const handleUpdatePassword = async () => {
    // In a real app, you would validate and send this to your API
    console.log("Password update requested");

    // Simulate a successful update with a toast notification
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully.",
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your account profile information and email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col items-center sm:items-start gap-2">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={user?.image || "/team/alex.png"}
                  alt={user?.name || "User"}
                />
                <AvatarFallback>
                  {formData.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="gap-1">
                <Camera className="h-4 w-4" />
                Change
              </Button>
            </div>
            <div className="space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) =>
                      handleSelectChange("timezone", value)
                    }
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america/new_york">
                        Eastern Time (US & Canada)
                      </SelectItem>
                      <SelectItem value="america/chicago">
                        Central Time (US & Canada)
                      </SelectItem>
                      <SelectItem value="america/denver">
                        Mountain Time (US & Canada)
                      </SelectItem>
                      <SelectItem value="america/los_angeles">
                        Pacific Time (US & Canada)
                      </SelectItem>
                      <SelectItem value="europe/london">London</SelectItem>
                      <SelectItem value="europe/paris">Paris</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us about yourself"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="min-h-24"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div />
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleUpdatePassword}>
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>
            Manage your billing details and payment methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-muted rounded-lg">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">Current Plan: Professional</p>
              <p className="text-sm text-muted-foreground">
                $29/month, billed monthly
              </p>
              <p className="text-sm text-muted-foreground">
                Next billing date: Nov 1, 2023
              </p>
            </div>
            <div className="ml-auto">
              <Button variant="outline">Manage Subscription</Button>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="font-medium">Payment Methods</p>
              <p className="text-sm text-muted-foreground">
                Manage your payment methods
              </p>
            </div>
            <Button variant="outline">Add Payment Method</Button>
          </div>
          <div className="border rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="rounded-md bg-muted p-2">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/24</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

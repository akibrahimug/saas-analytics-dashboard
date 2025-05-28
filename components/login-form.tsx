"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, LayoutDashboard } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export function LoginForm() {
  const searchParams = useSearchParams();
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [isGooglePending, setIsGooglePending] = React.useState<boolean>(false);
  const [isGithubPending, setIsGithubPending] = React.useState<boolean>(false);
  const [isDemoPending, setIsDemoPending] = React.useState<boolean>(false);

  // Extract any error from the URL
  React.useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      if (errorParam === "OAuthAccountNotLinked") {
        setError(
          "This email is already associated with another provider. Please use the original sign-in method."
        );
      } else if (errorParam === "OAuthSignin") {
        setError(
          "OAuth sign-in error. Please try again or use another method."
        );
      } else if (errorParam === "OAuthCallback") {
        setError(
          "OAuth callback error. Please try again or use another method."
        );
      } else {
        setError(`Authentication error: ${errorParam}`);
      }
    }
  }, [searchParams]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);
    setError(null);

    try {
      const signInResult = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (!signInResult?.ok) {
        setError(
          signInResult?.error || "Invalid credentials. Please try again."
        );
        return;
      }

      // Redirect to the dashboard or the callbackUrl
      const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
      window.location.href = callbackUrl;
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Sign-in error:", error);
    } finally {
      setIsPending(false);
    }
  }

  const handleProviderSignIn = async (provider: string) => {
    setError(null);

    try {
      if (provider === "google") {
        setIsGooglePending(true);
        console.log("Starting Google authentication process");

        // Use our custom Google sign-in endpoint instead of NextAuth
        const response = await fetch("/api/auth/signin-google");
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Redirect to dashboard on success
            window.location.href =
              searchParams.get("callbackUrl") || "/dashboard";
            return;
          } else {
            throw new Error(data.error || "Google authentication failed");
          }
        } else {
          throw new Error("Failed to connect to Google authentication service");
        }
      } else if (provider === "github") {
        setIsGithubPending(true);

        // For other providers, use the original NextAuth flow
        await signIn(provider, {
          callbackUrl: searchParams.get("callbackUrl") || "/dashboard",
        });
      }
    } catch (error) {
      console.error(`${provider} sign-in error:`, error);
      toast({
        title: "Error",
        description:
          "Something went wrong with the authentication provider. Please try again.",
        variant: "destructive",
      });

      if (provider === "google") {
        setIsGooglePending(false);
      } else if (provider === "github") {
        setIsGithubPending(false);
      }
    }
  };

  // Function to handle demo account login
  const handleDemoLogin = async () => {
    setIsDemoPending(true);
    setError(null);

    try {
      // Redirect to the dashboard with a demo flag - the DemoModeContext will handle setting the session storage
      window.location.href = `/dashboard?demo=true`;
    } catch (error) {
      console.error("Demo login error:", error);
      toast({
        title: "Error",
        description: "Failed to log in with demo account. Please try again.",
        variant: "destructive",
      });
      setIsDemoPending(false);
    }
  };

  return (
    <div className="grid gap-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Regular Sign-in Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={
              isPending || isGooglePending || isGithubPending || isDemoPending
            }
          >
            {isPending ? (
              <React.Fragment>
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </React.Fragment>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social login buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={() => handleProviderSignIn("google")}
          disabled={
            isPending || isGooglePending || isGithubPending || isDemoPending
          }
        >
          {isGooglePending ? (
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              className="mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 24 24"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          Google
        </Button>
        <Button
          variant="outline"
          onClick={() => handleProviderSignIn("github")}
          disabled={
            isPending || isGooglePending || isGithubPending || isDemoPending
          }
        >
          {isGithubPending ? (
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              className="mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 24 24"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          )}
          GitHub
        </Button>
      </div>

      <Separator />

      {/* Demo Account Button */}
      <Button
        variant="secondary"
        className="w-full"
        onClick={handleDemoLogin}
        disabled={
          isPending || isGooglePending || isGithubPending || isDemoPending
        }
      >
        {isDemoPending ? (
          <React.Fragment>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading demo...
          </React.Fragment>
        ) : (
          <>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Use Demo Account
          </>
        )}
      </Button>

      {/* Demo credentials helper - now removed as we have a dedicated button */}
    </div>
  );
}

"use client";

import { CheckCircle, Users, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";
import toast from "react-hot-toast";

import { useAuthContext } from "@/context";
import { Button, Card, CardContent, CardHeader, CardTitle, ThemeToggle } from "@/components";
import { useAuthActions } from "@/hooks";

const features = [
  {
    title: "Task Management",
    description: "Create, assign, and track tasks with ease. Keep your projects organized and on schedule.",
    icon: CheckCircle,
    bgColor: "bg-blue-50 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Team Collaboration",
    description: "Work together seamlessly with real-time updates and communication tools.",
    icon: Users,
    bgColor: "bg-emerald-50 dark:bg-green-900",
    iconColor: "text-emerald-600 dark:text-green-400",
  },
  {
    title: "Progress Tracking",
    description: "Monitor project progress with detailed analytics and visual reports.",
    icon: BarChart3,
    bgColor: "bg-blue-50 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
];

export default function HomePage() {
  const { user, loading } = useAuthContext();
  const { handleGoogleLogin } = useAuthActions();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) return null;

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <div className="bg-linear-to-br relative min-h-screen from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hidden Google One Tap - automatically shows popup in top right */}
        <div style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }}>
          <GoogleLogin
            onSuccess={(credentialResponse: CredentialResponse) => {
              if (credentialResponse.credential) {
                handleGoogleLogin(credentialResponse.credential);
              }
            }}
            onError={() => {
              toast.error("Google Login Failed");
            }}
            useOneTap
            auto_select
          />
        </div>

        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        {/* Hero Section */}
        <div className="container mx-auto px-6 py-16">
          <div className="mb-16 text-center">
            <h1 className="bg-linear-to-r mb-6 from-blue-600 via-blue-600 to-indigo-600 bg-clip-text text-5xl font-bold md:text-6xl">
              TaskFlow
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Streamline your project management with powerful tools designed for teams and individuals. Organize,
              collaborate, and achieve more together.
            </p>

            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                onClick={() => router.push("/login")}
                className="hover:cursor-gray-300 px-8 py-3 text-lg text-gray-300 hover:bg-gray-700"
              >
                Get Started Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/login")}
                className="px-8 py-3 text-lg hover:cursor-pointer hover:bg-gray-700"
              >
                Sign In
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-0 shadow-lg transition-shadow hover:shadow-xl">
                  <CardHeader>
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor}`}>
                      <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pricing Section */}
          <div className="mb-16">
            <h2 className="mb-12 text-center text-3xl font-bold">Simple, Transparent Pricing</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {/* Free Plan */}
              <Card className="border-2 transition-colors hover:border-blue-500">
                <CardHeader>
                  <CardTitle className="text-2xl">Free</CardTitle>
                  <p className="mt-4 text-4xl font-bold">
                    $0
                    <span className="text-sm font-normal text-gray-500">/month</span>
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="mb-6 space-y-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>5 Projects</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>3 Members per Project</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Basic Task Management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Team Collaboration</span>
                    </li>
                  </ul>
                  <Button className="w-full" variant="outline" onClick={() => router.push("/login")}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>

              {/* Starter Plan */}
              <Card className="relative scale-105 transform border-2 border-blue-500 shadow-xl">
                <div className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-blue-500 px-3 py-1 text-sm font-medium text-white">
                  Popular
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">Starter</CardTitle>
                  <p className="mt-4 text-4xl font-bold">
                    $5
                    <span className="text-sm font-normal text-gray-500">/month</span>
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="mb-6 space-y-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>10 Projects</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>10 Members per Project</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Everything in Free</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Basic Support</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/login")}>
                    Subscribe
                  </Button>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="border-2 transition-colors hover:border-blue-500">
                <CardHeader>
                  <CardTitle className="text-2xl">Pro</CardTitle>
                  <p className="mt-4 text-4xl font-bold">
                    $19
                    <span className="text-sm font-normal text-gray-500">/month</span>
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="mb-6 space-y-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Unlimited Projects</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Unlimited Members per Project</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Priority Support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Advanced Analytics</span>
                    </li>
                  </ul>
                  <Button className="w-full" variant="outline" onClick={() => router.push("/login")}>
                    Subscribe
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Moto */}
          <div className="rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-3xl font-bold">Ready to boost your productivity?</h2>
            <p className="mx-auto mb-6 max-w-md text-gray-600 dark:text-gray-300">
              Join teams already using TaskFlow to manage their projects efficiently.
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

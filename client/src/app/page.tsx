"use client";

import { CheckCircle, Users, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/context";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";

const features = [
  {
    title: "Task Management",
    description:
      "Create, assign, and track tasks with ease. Keep your projects organized and on schedule.",
    icon: CheckCircle,
    bgColor: "bg-blue-50 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Team Collaboration",
    description:
      "Work together seamlessly with real-time updates and communication tools.",
    icon: Users,
    bgColor: "bg-emerald-50 dark:bg-green-900",
    iconColor: "text-emerald-600 dark:text-green-400",
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor project progress with detailed analytics and visual reports.",
    icon: BarChart3,
    bgColor: "bg-blue-50 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
];

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-32 h-32 border-b-2 rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container px-6 py-16 mx-auto">
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-5xl font-bold md:text-6xl bg-linear-to-r from-blue-600 via-blue-600 to-indigo-600 bg-clip-text">
            TaskFlow
          </h1>
          <p className="max-w-2xl mx-auto mb-8 text-xl text-gray-600 dark:text-gray-300">
            Streamline your project management with powerful tools designed for
            teams and individuals. Organize, collaborate, and achieve more
            together.
          </p>

          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              onClick={() => router.push("/login")}
              className="px-8 py-3 text-lg text-gray-300 hover:cursor-gray-300 hover:bg-gray-700"
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
        <div className="grid gap-8 mb-16 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="transition-shadow border-0 shadow-lg hover:shadow-xl"
              >
                <CardHeader>
                  <div
                    className={`flex items-center justify-center w-12 h-12 mb-4 rounded-lg ${feature.bgColor}`}
                  >
                    <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pricing Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Simple, Transparent Pricing
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Free Plan */}
            <Card className="border-2 hover:border-blue-500 transition-colors">
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <p className="text-4xl font-bold mt-4">
                  $0
                  <span className="text-sm font-normal text-gray-500">
                    /month
                  </span>
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>5 Projects</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Basic Task Management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Team Collaboration</span>
                  </li>
                </ul>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => router.push("/login")}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Starter Plan */}
            <Card className="border-2 border-blue-500 relative transform scale-105 shadow-xl">
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                Popular
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Starter</CardTitle>
                <p className="text-4xl font-bold mt-4">
                  $9
                  <span className="text-sm font-normal text-gray-500">
                    /month
                  </span>
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>10 Projects</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Basic Support</span>
                  </li>
                </ul>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => router.push("/login")}
                >
                  Subscribe
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 hover:border-blue-500 transition-colors">
              <CardHeader>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <p className="text-4xl font-bold mt-4">
                  $19
                  <span className="text-sm font-normal text-gray-500">
                    /month
                  </span>
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Unlimited Projects</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Priority Support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Advanced Analytics</span>
                  </li>
                </ul>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => router.push("/login")}
                >
                  Subscribe
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Moto */}
        <div className="p-8 text-center bg-white shadow-lg dark:bg-gray-800 rounded-2xl">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to boost your productivity?
          </h2>
          <p className="max-w-md mx-auto mb-6 text-gray-600 dark:text-gray-300">
            Join teams already using TaskFlow to manage their projects
            efficiently.
          </p>
        </div>
      </div>
    </div>
  );
}

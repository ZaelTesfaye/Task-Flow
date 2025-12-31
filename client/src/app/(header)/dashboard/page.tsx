"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

import { projectAPI, stripeAPI } from "@/lib";
import type { Project } from "@/types";
import { useAuth } from "@/context";
import {
  ProjectNavigation,
  CreateProjectModal,
  ProjectsGridSection,
} from "@/components";

interface ProjectGroups {
  owner: Project[];
  admin: Project[];
  member: Project[];
}

export default function Dashboard() {
  const { user, loading: authLoading, checkSession } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    data: projectsData,
    isLoading: projectsLoading,
    refetch: fetchProjects,
  } = useQuery({
    queryKey: ["user-projects"],
    queryFn: () => projectAPI.getUserProjects(),
    enabled: !!user && !authLoading,
  });

  const projects = projectsData?.data || { owner: [], admin: [], member: [] };

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activeView, setActiveView] = useState<
    "all" | "owner" | "admin" | "member"
  >("all");

  // Handle subscription verification
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const success = searchParams.get("success");

    if (success === "true" && sessionId && user) {
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes with 5 second intervals
      const pollInterval = 5000; // 5 seconds

      const verifySubscription = async () => {
        try {
          const result = await stripeAPI.verifySubscriptionStatus(sessionId);

          if (result.isPremium && result.status === "active") {
            // Success - subscription is active
            await checkSession(); // Refresh user data
            toast.success("🎉 Subscription activated successfully!");
            // Remove query params from URL
            router.replace("/dashboard");
            return true;
          } else if (attempts >= maxAttempts) {
            // Timeout after 5 minutes
            toast.error(
              "Subscription verification timed out. Please contact support at support@task-flows.tech if you were charged.",
              { duration: 10000 }
            );
            router.replace("/dashboard");
            return true;
          }
          return false;
        } catch (error) {
          console.error("Subscription verification error:", error);
          if (attempts >= maxAttempts) {
            toast.error(
              "Failed to verify subscription. Please contact support@task-flows.tech",
              { duration: 10000 }
            );
            router.replace("/dashboard");
            return true;
          }
          return false;
        }
      };

      // Show loading toast
      const loadingToast = toast.loading("Verifying your subscription...");

      const interval = setInterval(async () => {
        attempts++;
        const done = await verifySubscription();
        if (done) {
          clearInterval(interval);
          toast.dismiss(loadingToast);
        }
      }, pollInterval);

      // Initial verification
      verifySubscription().then((done) => {
        if (done) {
          clearInterval(interval);
          toast.dismiss(loadingToast);
        }
      });

      // Cleanup
      return () => {
        clearInterval(interval);
        toast.dismiss(loadingToast);
      };
    }
  }, [searchParams, user, checkSession, router]);

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const createdProject = await projectAPI.createProject({
        title,
        description,
      });
      toast.success("Project created successfully!");
      setShowCreateModal(false);
      setTitle("");
      setDescription("");
      if (createdProject?.id) {
        router.push(`/project?id=${createdProject.id}&createCategory=1`);
        return;
      }
      fetchProjects();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create project");
    }
  };

  if (authLoading || projectsLoading) {
    return (
      <>
        <div className="flex items-center justify-center h-[calc(100vh-73px)] text-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-[hsl(var(--muted-foreground))]">
              Loading your projects...
            </p>
          </div>
        </div>
      </>
    );
  }

  const allProjects = [
    ...projects.owner,
    ...projects.admin,
    ...projects.member,
  ];
  return (
    <>
      <div className="px-6 py-16 mx-auto max-w-7xl">
        {/* Hero Section - Only when no projects exist */}
        {allProjects.length === 0 && (
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-3xl font-bold text-[hsl(var(--foreground))] md:text-4xl bg-linear-to-r bg-clip-text">
              Your Projects
            </h1>
          </div>
        )}

        {/* Project Navigation */}
        {(allProjects.length > 0 || activeView !== "all") && (
          <ProjectNavigation
            projects={projects}
            activeView={activeView}
            onViewChange={setActiveView}
          />
        )}

        {/* Projects Section */}
        <ProjectsGridSection
          projects={projects}
          activeView={activeView}
          onCreateProject={() => setShowCreateModal(true)}
        />

        {/* Create Project Modal */}
        <CreateProjectModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title={title}
          description={description}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onSubmit={handleCreateProject}
        />
      </div>
    </>
  );
}

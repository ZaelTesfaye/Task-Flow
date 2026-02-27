"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { useUserProjects, useSubscriptionVerification, useProjectMutations } from "@/hooks";
import { ProjectNavigation, CreateProjectModal, ProjectsGridSection } from "@/components";

export default function Dashboard() {
  const { projects, projectsLoading, authLoading } = useUserProjects();
  useSubscriptionVerification();
  const { createProject } = useProjectMutations("");
  const router = useRouter();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activeView, setActiveView] = useState<"all" | "owner" | "admin" | "member">("all");

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const createdProject = await createProject(title, description);
      toast.success("Project created successfully!");
      setShowCreateModal(false);
      setTitle("");
      setDescription("");
      if (createdProject?.id) {
        router.push(`/project?id=${createdProject.id}&createCategory=1`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create project");
    }
  };

  if (authLoading || projectsLoading) {
    return (
      <>
        <div className="flex h-[calc(100vh-73px)] items-center justify-center text-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-[hsl(var(--muted-foreground))]">Loading your projects...</p>
          </div>
        </div>
      </>
    );
  }

  const allProjects = [...projects.owner, ...projects.admin, ...projects.member];
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Hero Section - Only when no projects exist */}
        {allProjects.length === 0 && (
          <div className="mb-12 text-center">
            <h1 className="bg-linear-to-r mb-4 bg-clip-text text-3xl font-bold text-[hsl(var(--foreground))] md:text-4xl">
              Your Projects
            </h1>
          </div>
        )}

        {/* Project Navigation */}
        {(allProjects.length > 0 || activeView !== "all") && (
          <ProjectNavigation projects={projects} activeView={activeView} onViewChange={setActiveView} />
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

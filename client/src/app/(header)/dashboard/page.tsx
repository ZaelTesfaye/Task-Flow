"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { projectAPI } from "@/lib";
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
  const [projects, setProjects] = useState<ProjectGroups>({
    owner: [],
    admin: [],
    member: [],
  });
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activeView, setActiveView] = useState<
    "all" | "owner" | "admin" | "member"
  >("all");

  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      fetchProjects();
    } else if (!authLoading && !user) {
      setProjectsLoading(false);
    }
  }, [user, authLoading]);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getUserProjects();
      setProjects(response.data || { owner: [], admin: [], member: [] });
    } catch (error) {
      toast.error("Failed to fetch projects");
    } finally {
      setProjectsLoading(false);
    }
  };

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
        router.push(`/project/${createdProject.id}?createCategory=1`);
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

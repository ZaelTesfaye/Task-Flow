import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { projectAPI, taskAPI } from "@/lib";
import { useAuth } from "@/context";
import {
  Project,
  CategoryWithTasks,
  ProjectMember,
  TasksResponse,
  ProjectInvitation,
} from "@/types";

export const useProjectData = (projectId: string | string[] | undefined) => {
  const { user } = useAuth();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [categories, setCategories] = useState<CategoryWithTasks[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [invitations, setInvitations] = useState<ProjectInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<"owner" | "admin" | "member">(
    "member"
  );

  const fetchProjectData = useCallback(async () => {
    if (!projectId || !user) return;

    try {
      const [categoriesRes, membersRes] = await Promise.all([
        taskAPI.getCategories(projectId as string),
        projectAPI.getProjectMembers(projectId as string),
      ]);

      const categoriesData: TasksResponse = categoriesRes.data;
      const membersData: ProjectMember[] = membersRes.data || [];

      setCategories(categoriesData.categories || []);
      setProject(categoriesData.project);
      setMembers(membersData);

      const currentMember = membersData.find(
        (m: ProjectMember) => m.userId === user?.id
      );

      let userRole: "owner" | "admin" | "member" = "member";

      if (currentMember)
        userRole = currentMember.access as "owner" | "admin" | "member";

      setUserRole(userRole);

      if (userRole === "owner" || userRole === "admin") {
        try {
          const invitationResponse = await projectAPI.getProjectInvitations(
            projectId as string
          );
          setInvitations(invitationResponse.data || []);
        } catch (invitationError) {
          console.error(
            "Failed to fetch project invitations:",
            invitationError
          );
          setInvitations([]);
        }
      } else {
        setInvitations([]);
      }
    } catch (error) {
      console.error("Failed to fetch project data:", error);
      toast.error("Failed to fetch project data");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }, [projectId, user, router]);

  useEffect(() => {
    if (projectId && user) {
      fetchProjectData();
    }
  }, [projectId, user, fetchProjectData]);

  useEffect(() => {
    setLoading(true);
  }, [projectId]);

  return {
    project,
    categories,
    members,
    invitations,
    loading,
    userRole,
    refetch: fetchProjectData,
  };
};

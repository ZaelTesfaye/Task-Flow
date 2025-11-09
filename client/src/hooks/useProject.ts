import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { projectAPI, categoryAPI, taskAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import {
  Project,
  CategoryWithTasks,
  ProjectMember,
  TasksResponse,
  ProjectInvitation,
} from "@/types/api";

import {
  TaskStatus,
  DEFAULT_MODAL_STATE,
  DEFAULT_FORM_STATE,
} from "@/constants/project";
// Modal/Form helpers will operate on these shapes defined in constants/project
export const useProject = (projectId: string | string[] | undefined) => {
  const { user } = useAuth();
  const router = useRouter();

  // State
  const [project, setProject] = useState<Project | null>(null);
  const [categories, setCategories] = useState<CategoryWithTasks[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [invitations, setInvitations] = useState<ProjectInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<"owner" | "admin" | "member">(
    "member"
  );
  const [isMembersPaneOpen, setIsMembersPaneOpen] = useState(false);
  const [isSettingsPaneOpen, setIsSettingsPaneOpen] = useState(false);

  // Modal states
  const [modals, setModals] = useState(DEFAULT_MODAL_STATE);

  // Form states
  const [forms, setForms] = useState(DEFAULT_FORM_STATE);

  // Modal handlers
  const openModal = useCallback((key: keyof typeof DEFAULT_MODAL_STATE) => {
    setModals((prev) => ({ ...prev, [key]: true }));
  }, []);

  const closeModal = useCallback((key: keyof typeof DEFAULT_MODAL_STATE) => {
    setModals((prev) => ({ ...prev, [key]: false }));
  }, []);

  // Form helpers
  const updateForm = useCallback(
    (key: keyof typeof DEFAULT_FORM_STATE, value: any) => {
      setForms((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetForm = useCallback((key: keyof typeof DEFAULT_FORM_STATE) => {
    setForms((prev) => ({ ...prev, [key]: DEFAULT_FORM_STATE[key] }));
  }, []);

  const fetchProjectData = useCallback(async () => {
    if (!projectId || !user) return;

    try {
      const [categoriesRes, membersRes] = await Promise.all([
        taskAPI.getCategories(projectId as string),
        projectAPI.getProjectMembers(projectId as string),
      ]);
      // API layer returns ApiResponse<T> directly; payload is in .data
      const categoriesData: TasksResponse = categoriesRes.data;
      const membersData: ProjectMember[] = membersRes.data || [];
      setCategories(categoriesData.categories || []);
      setProject(categoriesData.project);
      setMembers(membersData);

      // Determine user role
      const currentMember = membersData.find(
        (m: ProjectMember) => m.userId === user?.id
      );
      let derivedRole: "owner" | "admin" | "member" = "member";
      if (categoriesData?.project?.ownerId === user?.id) {
        derivedRole = "owner";
      } else if (currentMember) {
        derivedRole = currentMember.access as "owner" | "admin" | "member";
      }

      setUserRole(derivedRole);

      setForms((prev) => ({
        ...prev,
        projectTitle: categoriesData?.project?.title || "",
        projectDescription: categoriesData?.project?.description || "",
      }));

      if (derivedRole === "owner" || derivedRole === "admin") {
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
  }, [projectId, user, router, setForms]);

  useEffect(() => {
    if (projectId && user) {
      fetchProjectData();
    }
  }, [projectId, user, fetchProjectData]);

  useEffect(() => {
    setIsMembersPaneOpen(false);
    setIsSettingsPaneOpen(false);
  }, [projectId]);

  // API methods
  const updateProject = async (data: {
    title: string;
    description: string;
  }) => {
    await projectAPI.updateProject(projectId as string, data);
    toast.success("Project updated!");
    fetchProjectData();
  };

  const deleteProject = async () => {
    await projectAPI.removeProject(projectId as string);
    toast.success("Project deleted!");
    router.push("/dashboard");
  };

  const createCategory = async (name: string) => {
    await categoryAPI.createCategory(projectId as string, { name });
    toast.success("Category created!");
    fetchProjectData();
  };

  const deleteCategory = async (categoryId: string) => {
    await categoryAPI.removeCategory(projectId as string, categoryId);
    toast.success("Category deleted!");
    fetchProjectData();
  };

  const createTask = async (
    categoryId: string,
    data: { title: string; description: string; assignedTo: string }
  ) => {
    await taskAPI.createTask(projectId as string, categoryId, data);
    toast.success("Task created!");
    fetchProjectData();
  };

  const updateTask = async (
    taskId: string,
    data: { title: string; description: string }
  ) => {
    await taskAPI.updateTask(projectId as string, taskId, data);
    toast.success("Task updated!");
    fetchProjectData();
  };

  const deleteTask = async (taskId: string) => {
    await taskAPI.removeTask(projectId as string, taskId);
    toast.success("Task deleted!");
    fetchProjectData();
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    await taskAPI.updateTask(projectId as string, taskId, { status });
    toast.success("Task status updated!");
    fetchProjectData();
  };

  const requestTaskUpdate = async (
    taskId: string,
    updateDescription: string,
    newStatus: TaskStatus
  ) => {
    await taskAPI.requestTaskUpdate(projectId as string, taskId, {
      updateDescription,
      newStatus,
    });
    toast.success("Update request submitted!");
    fetchProjectData();
  };

  const acceptPendingUpdate = async (
    pendingUpdateId: string,
    newStatus: TaskStatus
  ) => {
    await taskAPI.acceptPendingUpdate(projectId as string, pendingUpdateId, {
      newStatus,
    });
    toast.success("Update approved!");
    fetchProjectData();
  };

  const addMember = async (data: {
    email: string;
    access: "admin" | "member";
  }) => {
    await projectAPI.addMember(projectId as string, data);
    toast.success("Invitation sent!");
    fetchProjectData();
  };

  const removeMember = async (userId: string) => {
    await projectAPI.removeProjectMember(projectId as string, userId);
    toast.success("Member removed!");
    fetchProjectData();
  };

  const updateMemberAccess = async (
    userId: string,
    access: "admin" | "member"
  ) => {
    await projectAPI.updateMember(projectId as string, userId, { access });
    toast.success("Member role updated!");
    fetchProjectData();
  };

  return {
    // State
    project,
    categories,
    members,
    invitations,
    loading,
    userRole,
    isMembersPaneOpen,
    setIsMembersPaneOpen,
    isSettingsPaneOpen,
    setIsSettingsPaneOpen,

    // Modal state
    modals,
    forms,

    // Modal handlers
    openModal,
    closeModal,

    // // Form handlers
    updateForm,
    resetForm,

    // Actions
    updateProject,
    deleteProject,
    createCategory,
    deleteCategory,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    requestTaskUpdate,
    acceptPendingUpdate,
    addMember,
    removeMember,
    updateMemberAccess,
    refetch: fetchProjectData,
  };
};

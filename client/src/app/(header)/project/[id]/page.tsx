"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

import { useAuth } from "@/context";
import {
  useProjectData,
  useProjectModals,
  useProjectActions,
  useCategoryActions,
  useTaskActions,
  useMemberActions,
} from "@/hooks";

import {
  ProjectHeader,
  CategoryCard,
  MembersPane,
  ProjectSettingsPane,
  CreateCategoryModal,
  CreateTaskModal,
  ConfirmationModal,
  RequestUpdateModal,
  AllMembersModal,
  EditTaskModal,
  ReviewUpdateModal,
  AddMemberModal,
} from "@/components";

export default function ProjectBoard() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = params.id as string;
  const { user } = useAuth();

  const projectData = useProjectData(projectId);
  const modals = useProjectModals();
  const projectActions = useProjectActions(projectId, projectData.refetch);
  const categoryActions = useCategoryActions(projectId, projectData.refetch);
  const taskActions = useTaskActions(projectId, projectData.refetch);
  const memberActions = useMemberActions(projectId, projectData.refetch);

  const { project, categories, members, invitations, loading, userRole } =
    projectData;

  const {
    isMembersPaneOpen,
    setIsMembersPaneOpen,
    isSettingsPaneOpen,
    setIsSettingsPaneOpen,
    modals: modalStates,
    forms,
    openModal,
    closeModal,
    updateForm,
    resetForm,
  } = modals;

  const { updateProject, deleteProject } = projectActions;
  const { createCategory, deleteCategory } = categoryActions;

  const {
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    requestTaskUpdate,
    acceptPendingUpdate,
    rejectPendingUpdate,
  } = taskActions;

  const { addMember, removeMember, updateMemberAccess } = memberActions;

  const isOwnerOrAdmin = userRole === "owner" || userRole === "admin";
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const hasAutoOpenedCategory = useRef(false);

  const filteredMembers = members.filter((member) => {
    if (forms.memberFilter === "all") return true;
    if (forms.memberFilter === "owner")
      return member.userId === project?.ownerId;
    if (forms.memberFilter === "admin") return member.access === "admin";
    if (forms.memberFilter === "member") return member.access === "member";
    return true;
  });

  const closeSettingsPane = () => {
    setIsSettingsPaneOpen(false);
    if (project) {
      updateForm("projectTitle", project.title || "");
      updateForm("projectDescription", project.description || "");
    }
  };

  const handleToggleSettings = () => {
    setIsSettingsPaneOpen(!isSettingsPaneOpen);
  };

  const handleToggleMembers = () => {
    setIsMembersPaneOpen(!isMembersPaneOpen);
  };

  const handleSaveProject = async () => {
    if (!forms.projectTitle.trim()) {
      toast.error("Project title is required");
      return;
    }

    try {
      setIsSavingSettings(true);
      await updateProject({
        title: forms.projectTitle,
        description: forms.projectDescription,
      });
      closeSettingsPane();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to update project";
      toast.error(message);
    } finally {
      setIsSavingSettings(false);
    }
  };

  useEffect(() => {
    if (userRole !== "owner" && isSettingsPaneOpen) {
      setIsSettingsPaneOpen(false);
      if (project) {
        updateForm("projectTitle", project.title || "");
        updateForm("projectDescription", project.description || "");
      }
    }
  }, [
    userRole,
    isSettingsPaneOpen,
    setIsSettingsPaneOpen,
    project,
    updateForm,
  ]);

  useEffect(() => {
    if (loading || hasAutoOpenedCategory.current) {
      return;
    }

    const createCategoryQuery = searchParams.get("createCategory");
    const shouldOpenCategory = createCategoryQuery === "1";

    if (shouldOpenCategory && isOwnerOrAdmin) {
      hasAutoOpenedCategory.current = true;
      openModal("showCategoryModal");
      router.replace(`/project/${projectId}`);
    }
  }, [searchParams, projectId, openModal, loading, isOwnerOrAdmin, router]);

  const handleSubmitTaskUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forms.taskToDelete || !forms.updateDescription.trim()) return;

    try {
      await requestTaskUpdate(
        forms.taskToDelete,
        forms.updateDescription,
        forms.updateStatus
      );
      closeModal("showUpdateTaskModal");
      resetForm("updateDescription");
      resetForm("updateStatus");
      resetForm("taskToDelete");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to request update");
    }
  };

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center h-96">
          <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        <ProjectHeader
          project={project!}
          userRole={userRole}
          isSettingsPaneOpen={isSettingsPaneOpen}
          onToggleSettings={handleToggleSettings}
          isMembersPaneOpen={isMembersPaneOpen}
          onToggleMembers={handleToggleMembers}
        />{" "}
        <div className="px-6 py-8 mx-auto max-w-7xl">
          <div className="flex gap-8">
            <div className="flex-1">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-16 bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))]">
                  <p className="text-[hsl(var(--muted-foreground))] mb-4">
                    No categories yet
                  </p>
                  {isOwnerOrAdmin && (
                    <button
                      onClick={() => openModal("showCategoryModal")}
                      className="inline-flex items-center gap-2 px-4 py-2 dark:text-white text-[hsl(var(--primary-foreground))] transition bg-blue-600 rounded-lg hover:cursor-pointer hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                      Create Category
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
                      Categories
                    </h2>
                    {isOwnerOrAdmin && (
                      <button
                        onClick={() => openModal("showCategoryModal")}
                        className="dark:text-white flex items-center gap-2 px-4 py-2 text-sm text-[hsl(var(--primary-foreground))] transition bg-blue-600 rounded-lg hover:cursor-pointer hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4" />
                        Add Category
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                      <CategoryCard
                        key={category.id}
                        category={category}
                        userRole={userRole}
                        currentUserId={user?.id || ""}
                        onCreateTask={(category) => {
                          updateForm("selectedCategory", category);
                          openModal("showTaskModal");
                        }}
                        onDeleteCategory={(categoryId, categoryName) => {
                          updateForm("categoryToDelete", categoryId);
                          openModal("showDeleteCategoryModal");
                        }}
                        onUpdateTaskStatus={updateTaskStatus}
                        onRequestUpdate={(taskId, description, status) => {
                          updateForm("taskToDelete", taskId);
                          updateForm("updateDescription", description);
                          updateForm("updateStatus", status);
                          openModal("showUpdateTaskModal");
                        }}
                        onReviewUpdate={(task) => {
                          updateForm("reviewingTask", task);
                          openModal("showReviewUpdateModal");
                        }}
                        onEditTask={(task) => {
                          updateForm("editingTask", task);
                          updateForm("editTaskTitle", task.title);
                          updateForm("editTaskDescription", task.description);
                          updateForm("editTaskStatus", task.status);
                          openModal("showEditTaskModal");
                        }}
                        onDeleteTask={(taskId) => {
                          updateForm("taskToDelete", taskId);
                          openModal("showDeleteTaskModal");
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <MembersPane
            isOpen={isMembersPaneOpen}
            members={filteredMembers}
            project={project!}
            userRole={userRole}
            memberFilter={forms.memberFilter}
            invitations={invitations}
            onClose={() => setIsMembersPaneOpen(false)}
            onFilterChange={(filter) => updateForm("memberFilter", filter)}
            onAddMember={() => openModal("showAddMemberModal")}
            onViewAllMembers={() => openModal("showMembersModal")}
            onManageInvitations={() => router.push("/invitations")}
          />

          <ProjectSettingsPane
            isOpen={isSettingsPaneOpen}
            onClose={closeSettingsPane}
            title={forms.projectTitle}
            description={forms.projectDescription}
            onTitleChange={(value) => updateForm("projectTitle", value)}
            onDescriptionChange={(value) =>
              updateForm("projectDescription", value)
            }
            onSave={handleSaveProject}
            onDelete={() => openModal("showDeleteProjectModal")}
            isSaving={isSavingSettings}
          />
        </div>
        {/* Modals */}
        <CreateCategoryModal
          isOpen={modalStates.showCategoryModal}
          onClose={() => closeModal("showCategoryModal")}
          onSubmit={createCategory}
        />
        <CreateTaskModal
          isOpen={modalStates.showTaskModal}
          onClose={() => closeModal("showTaskModal")}
          selectedCategory={forms.selectedCategory}
          members={members}
          onSubmit={(data) => {
            if (forms.selectedCategory) {
              createTask(forms.selectedCategory.id, {
                title: data.title,
                description: data.description,
                assignedTo: data.assignee,
              });
            }
          }}
        />
        {/* Delete Project Confirmation */}
        <ConfirmationModal
          isOpen={modalStates.showDeleteProjectModal}
          title="Delete Project"
          message="Are you sure? This cannot be undone."
          confirmText="Delete"
          onConfirm={() => {
            deleteProject();
            closeModal("showDeleteProjectModal");
          }}
          onCancel={() => closeModal("showDeleteProjectModal")}
          confirmButtonColor="red"
        />
        {/* Members Modal */}
        <AllMembersModal
          isOpen={modalStates.showMembersModal}
          onClose={() => closeModal("showMembersModal")}
          members={members}
          project={project!}
          userRole={userRole}
          invitations={invitations}
          onAddMember={() => openModal("showAddMemberModal")}
          onUpdateMemberAccess={updateMemberAccess}
          onRemoveMember={(userId, memberName) => {
            updateForm("memberToRemove", { id: userId, name: memberName });
            openModal("showRemoveMemberModal");
          }}
          updateForm={updateForm}
          openModal={openModal}
        />
        {/* Edit Task Modal */}
        <EditTaskModal
          isOpen={modalStates.showEditTaskModal}
          onClose={() => closeModal("showEditTaskModal")}
          task={forms.editingTask}
          forms={forms}
          updateForm={updateForm}
          resetForm={resetForm}
          updateTask={updateTask}
          updateTaskStatus={updateTaskStatus}
          isOwnerOrAdmin={isOwnerOrAdmin}
        />
        {/* Delete Task Confirmation Modal */}
        <ConfirmationModal
          isOpen={modalStates.showDeleteTaskModal}
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          confirmText="Delete"
          onConfirm={() => {
            deleteTask(forms.taskToDelete);
            closeModal("showDeleteTaskModal");
            resetForm("taskToDelete");
          }}
          onCancel={() => {
            closeModal("showDeleteTaskModal");
            resetForm("taskToDelete");
          }}
          confirmButtonColor="red"
        />
        {/* Update Task Modal */}
        <RequestUpdateModal
          isOpen={modalStates.showUpdateTaskModal}
          onClose={() => {
            closeModal("showUpdateTaskModal");
            resetForm("updateDescription");
            resetForm("updateStatus");
            resetForm("taskToDelete");
          }}
          onSubmit={handleSubmitTaskUpdate}
          updateDescription={forms.updateDescription}
          updateStatus={forms.updateStatus}
          onUpdateDescriptionChange={(value) =>
            updateForm("updateDescription", value)
          }
          onUpdateStatusChange={(value) =>
            updateForm(
              "updateStatus",
              value as "active" | "complete" | "canceled"
            )
          }
        />
        {/* Review Update Modal */}
        <ReviewUpdateModal
          isOpen={modalStates.showReviewUpdateModal}
          onClose={() => closeModal("showReviewUpdateModal")}
          task={forms.reviewingTask}
          forms={forms}
          resetForm={resetForm}
          acceptPendingUpdate={acceptPendingUpdate}
          rejectPendingUpdate={rejectPendingUpdate}
        />
        {/* Delete Category Confirmation */}
        <ConfirmationModal
          isOpen={modalStates.showDeleteCategoryModal}
          title="Delete Category"
          message={`Are you sure you want to delete the "${forms.categoryToDelete}" category? This will also delete all tasks in this category. This action cannot be undone.`}
          confirmText="Delete Category"
          onConfirm={() => {
            deleteCategory(forms.categoryToDelete);
            closeModal("showDeleteCategoryModal");
            resetForm("categoryToDelete");
          }}
          onCancel={() => {
            closeModal("showDeleteCategoryModal");
            resetForm("categoryToDelete");
          }}
          confirmButtonColor="red"
        />
        {/* Remove Member Confirmation */}
        <ConfirmationModal
          isOpen={modalStates.showRemoveMemberModal}
          title="Remove Member"
          message={`Are you sure you want to remove ${forms.memberToRemove?.name} from this project? They will lose access to all project resources.`}
          confirmText="Remove Member"
          onConfirm={() => {
            removeMember(forms.memberToRemove?.id);
            closeModal("showRemoveMemberModal");
            resetForm("memberToRemove");
          }}
          onCancel={() => {
            closeModal("showRemoveMemberModal");
            resetForm("memberToRemove");
          }}
          confirmButtonColor="red"
        />
        {/* Add Member Modal */}
        <AddMemberModal
          isOpen={modalStates.showAddMemberModal}
          onClose={() => closeModal("showAddMemberModal")}
          forms={forms}
          updateForm={updateForm}
          addMember={addMember}
        />
      </div>
    </>
  );
}

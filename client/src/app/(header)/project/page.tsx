"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

import { useAuthContext } from "@/context";
import {
  useProjectData,
  useProjectMutations,
  usePhaseMutations,
  useTaskMutations,
  useMemberMutations,
  useProjectModals,
} from "@/hooks";

import {
  ProjectHeader,
  PhaseCard,
  MembersPane,
  ProjectSettingsPane,
  CreatePhaseModal,
  CreateTaskModal,
  ConfirmationModal,
  RequestUpdateModal,
  AllMembersModal,
  EditTaskModal,
  ReviewUpdateModal,
  AddMemberModal,
} from "@/components";

function ProjectBoard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id") as string;
  const { user } = useAuthContext();

  const { project, phases, members, invitations, loading, userRole, refetch } = useProjectData(projectId);

  const { updateProject, deleteProject } = useProjectMutations(projectId as string);
  const { createPhase, deletePhase } = usePhaseMutations(projectId as string);
  const {
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    requestTaskUpdate,
    acceptPendingUpdate,
    rejectPendingUpdate,
  } = useTaskMutations(projectId as string);
  const { addMember, removeMember, updateMemberAccess, leaveProject } = useMemberMutations(projectId as string);

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
  } = useProjectModals();

  const isOwnerOrAdmin = userRole === "owner" || userRole === "admin";
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const hasAutoOpenedCategory = useRef(false);

  const filteredMembers = members.filter((member) => {
    if (forms.memberFilter === "all") return true;
    if (forms.memberFilter === "owner") return member.userId === project?.ownerId;
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

  const handleLeaveProject = () => {
    openModal("showLeaveProjectModal");
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
      const message = error?.response?.data?.message || "Failed to update project";
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
  }, [userRole, isSettingsPaneOpen, setIsSettingsPaneOpen, project, updateForm]);

  useEffect(() => {
    if (loading || hasAutoOpenedCategory.current) {
      return;
    }

    const createCategoryQuery = searchParams.get("createCategory");
    const shouldOpenCategory = createCategoryQuery === "1";

    if (shouldOpenCategory && isOwnerOrAdmin) {
      hasAutoOpenedCategory.current = true;
      openModal("showPhaseModal");
      router.replace(`/project?id=${projectId}`);
    }
  }, [searchParams, projectId, openModal, loading, isOwnerOrAdmin, router]);

  const handleSubmitTaskUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forms.taskToDelete || !forms.updateDescription.trim()) return;

    try {
      await requestTaskUpdate(forms.taskToDelete, forms.updateDescription, forms.updateStatus);
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
        <div className="flex h-96 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <ProjectHeader
        project={project!}
        userRole={userRole}
        isSettingsPaneOpen={isSettingsPaneOpen}
        onToggleSettings={handleToggleSettings}
        isMembersPaneOpen={isMembersPaneOpen}
        onToggleMembers={handleToggleMembers}
        onLeaveProject={handleLeaveProject}
      />{" "}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex gap-8">
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
              </div>
            ) : phases.length === 0 ? (
              <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-16 text-center">
                <p className="mb-4 text-[hsl(var(--muted-foreground))]">No phases yet</p>
                {isOwnerOrAdmin && (
                  <button
                    onClick={() => openModal("showPhaseModal")}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-[hsl(var(--primary-foreground))] transition hover:cursor-pointer hover:bg-blue-700 dark:text-white"
                  >
                    <Plus className="h-4 w-4" />
                    Create Phase
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">Phases</h2>
                  {isOwnerOrAdmin && (
                    <button
                      onClick={() => openModal("showPhaseModal")}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-[hsl(var(--primary-foreground))] transition hover:cursor-pointer hover:bg-blue-700 dark:text-white"
                    >
                      <Plus className="h-4 w-4" />
                      Add Phase
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {phases.map((phase) => (
                    <PhaseCard
                      key={phase.id}
                      phase={phase}
                      userRole={userRole}
                      currentUserId={user?.id || ""}
                      onCreateTask={(phase) => {
                        updateForm("selectedPhase", phase);
                        openModal("showTaskModal");
                      }}
                      onDeletePhase={(phaseId, phaseName) => {
                        updateForm("phaseToDelete", phaseId);
                        updateForm("phaseName", phaseName);
                        openModal("showDeletePhaseModal");
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
          onRefresh={refetch}
        />

        <ProjectSettingsPane
          isOpen={isSettingsPaneOpen}
          onClose={closeSettingsPane}
          title={forms.projectTitle}
          description={forms.projectDescription}
          onTitleChange={(value) => updateForm("projectTitle", value)}
          onDescriptionChange={(value) => updateForm("projectDescription", value)}
          onSave={handleSaveProject}
          onDelete={() => openModal("showDeleteProjectModal")}
          isSaving={isSavingSettings}
        />
      </div>
      {/* Modals */}
      <CreatePhaseModal
        isOpen={modalStates.showPhaseModal}
        onClose={() => closeModal("showPhaseModal")}
        onSubmit={createPhase}
      />
      <CreateTaskModal
        isOpen={modalStates.showTaskModal}
        onClose={() => closeModal("showTaskModal")}
        selectedPhase={forms.selectedPhase}
        members={members}
        onSubmit={(data) => {
          if (forms.selectedPhase) {
            createTask(forms.selectedPhase.id, {
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
        onConfirm={async () => {
          await deleteProject();
          closeModal("showDeleteProjectModal");
          router.push("/dashboard");
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
        onUpdateDescriptionChange={(value) => updateForm("updateDescription", value)}
        onUpdateStatusChange={(value) => updateForm("updateStatus", value as "active" | "complete" | "canceled")}
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
        isOpen={modalStates.showDeletePhaseModal}
        title="Delete Phase"
        message={`Are you sure you want to delete the "${forms.phaseName}" phase? This will also delete all tasks in this phase. This action cannot be undone.`}
        confirmText="Delete Phase"
        onConfirm={() => {
          deletePhase(forms.phaseToDelete);
          closeModal("showDeletePhaseModal");
          resetForm("phaseToDelete");
          resetForm("phaseName");
        }}
        onCancel={() => {
          closeModal("showDeletePhaseModal");
          resetForm("phaseToDelete");
          resetForm("phaseName");
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
      {/* Leave Project Confirmation */}
      <ConfirmationModal
        isOpen={modalStates.showLeaveProjectModal}
        title="Leave Project"
        message="Are you sure you want to leave this project? You will lose access to all project resources."
        confirmText="Leave Project"
        onConfirm={async () => {
          await leaveProject(user?.id || "");
          closeModal("showLeaveProjectModal");
          router.push("/dashboard");
        }}
        onCancel={() => closeModal("showLeaveProjectModal")}
        confirmButtonColor="red"
      />
    </div>
  );
}

export default ProjectBoard;

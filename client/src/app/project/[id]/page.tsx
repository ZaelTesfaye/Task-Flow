'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import Modal from '@/components/Modal';
import ConfirmationModal from '@/components/ConfirmationModal';
import { useProject } from '@/hooks/useProject';
import {
  ProjectHeader,
  CategoryCard,
  MembersPane,
  ProjectSettingsPane,
  CreateCategoryModal,
  CreateTaskModal,
} from '@/components/project';
import { Trash2, Crown, Plus, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { INVITATION_STATUS_COLORS } from '@/constants/project';

export default function ProjectBoard() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = params.id as string;
  const { user } = useAuth();

  const {
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

    // Form handlers
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
  } = useProject(projectId);

  const isOwnerOrAdmin = userRole === 'owner' || userRole === 'admin';
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const hasAutoOpenedCategory = useRef(false);

  const filteredMembers = members.filter((member) => {
    if (forms.memberFilter === 'all') return true;
    if (forms.memberFilter === 'owner') return member.userId === project?.ownerId;
    if (forms.memberFilter === 'admin') return member.access === 'admin';
    if (forms.memberFilter === 'member') return member.access === 'member';
    return true;
  });

  const closeSettingsPane = () => {
    setIsSettingsPaneOpen(false);
    if (project) {
      updateForm('projectTitle', project.title || '');
      updateForm('projectDescription', project.description || '');
    }
  };

  const handleToggleSettings = () => {
    if (isSettingsPaneOpen) {
      closeSettingsPane();
    } else {
      setIsSettingsPaneOpen(true);
    }
  };

  const handleSaveProject = async () => {
    if (!forms.projectTitle.trim()) {
      toast.error('Project title is required');
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
      const message = error?.response?.data?.message || 'Failed to update project';
      toast.error(message);
    } finally {
      setIsSavingSettings(false);
    }
  };

  useEffect(() => {
    if (userRole !== 'owner' && isSettingsPaneOpen) {
      setIsSettingsPaneOpen(false);
      if (project) {
        updateForm('projectTitle', project.title || '');
        updateForm('projectDescription', project.description || '');
      }
    }
  }, [userRole, isSettingsPaneOpen, setIsSettingsPaneOpen, project, updateForm]);

  useEffect(() => {
    if (loading || hasAutoOpenedCategory.current) {
      return;
    }

    const createCategoryQuery = searchParams.get('createCategory');
    const shouldOpenCategory = createCategoryQuery === '1';

    if (shouldOpenCategory && isOwnerOrAdmin) {
      hasAutoOpenedCategory.current = true;
      openModal('showCategoryModal');
      router.replace(`/project/${projectId}`);
    }
  }, [searchParams, projectId, openModal, loading, isOwnerOrAdmin, router]);

  const handleSubmitTaskUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forms.taskToDelete || !forms.updateDescription.trim()) return;

    try {
      await requestTaskUpdate(forms.taskToDelete, forms.updateDescription, forms.updateStatus);
      closeModal('showUpdateTaskModal');
      // Reset update-related form fields
      resetForm('updateDescription');
      resetForm('updateStatus');
      resetForm('taskToDelete');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to request update');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
  <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        <ProjectHeader
          project={project!}
          userRole={userRole}
          isSettingsPaneOpen={isSettingsPaneOpen}
          isMembersPaneOpen={isMembersPaneOpen}
          onToggleMembers={() => setIsMembersPaneOpen(!isMembersPaneOpen)}
          onToggleSettings={handleToggleSettings}
        />

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div
            className={`flex gap-8 transition-all duration-300 ${
              isMembersPaneOpen ? 'mr-80' : ''
            } ${isSettingsPaneOpen ? 'ml-80' : ''}`}
          >
            <div className="flex-1">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-16 bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))]">
                  <p className="text-[hsl(var(--muted-foreground))] mb-4">No categories yet</p>
                  {isOwnerOrAdmin && (
                    <button
                      onClick={() => openModal('showCategoryModal')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Plus className="w-4 h-4" />
                      Create Category
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">Categories</h2>
                    {isOwnerOrAdmin && (
                      <button
                        onClick={() => openModal('showCategoryModal')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add Category
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                      <CategoryCard
                        key={category.id}
                        category={category}
                        userRole={userRole}
                        currentUserId={user?.id || ''}
                        onCreateTask={(category) => {
                          updateForm('selectedCategory', category);
                          openModal('showTaskModal');
                        }}
                        onDeleteCategory={(categoryId, categoryName) => {
                          updateForm('categoryToDelete', categoryId);
                          openModal('showDeleteCategoryModal');
                        }}
                        onUpdateTaskStatus={updateTaskStatus}
                        onRequestUpdate={(taskId, description, status) => {
                          updateForm('taskToDelete', taskId);
                          updateForm('updateDescription', description);
                          updateForm('updateStatus', status);
                          openModal('showUpdateTaskModal');
                        }}
                        onReviewUpdate={(task) => {
                          updateForm('reviewingTask', task);
                          openModal('showReviewUpdateModal');
                        }}
                        onEditTask={(task) => {
                          updateForm('editingTask', task);
                          updateForm('editTaskTitle', task.title);
                          updateForm('editTaskDescription', task.description);
                          openModal('showEditTaskModal');
                        }}
                        onDeleteTask={(taskId) => {
                          updateForm('taskToDelete', taskId);
                          openModal('showDeleteTaskModal');
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
            onFilterChange={(filter) => updateForm('memberFilter', filter)}
            onAddMember={() => openModal('showAddMemberModal')}
            onViewAllMembers={() => openModal('showMembersModal')}
            onManageInvitations={() => router.push('/invitations')}
            onPromoteMember={updateMemberAccess}
            onRemoveMember={(userId, memberName) => {
              updateForm('memberToRemove', { id: userId, name: memberName });
              openModal('showRemoveMemberModal');
            }}
          />

          <ProjectSettingsPane
            isOpen={isSettingsPaneOpen}
            onClose={closeSettingsPane}
            title={forms.projectTitle}
            description={forms.projectDescription}
            onTitleChange={(value) => updateForm('projectTitle', value)}
            onDescriptionChange={(value) => updateForm('projectDescription', value)}
            onSave={handleSaveProject}
            onDelete={() => openModal('showDeleteProjectModal')}
            isSaving={isSavingSettings}
          />
        </div>

        {/* Modals */}
        <CreateCategoryModal
          isOpen={modals.showCategoryModal}
          onClose={() => closeModal('showCategoryModal')}
          onSubmit={createCategory}
        />

        <CreateTaskModal
          isOpen={modals.showTaskModal}
          onClose={() => closeModal('showTaskModal')}
          selectedCategory={forms.selectedCategory}
          members={members}
          onSubmit={(data) => {
            if (forms.selectedCategory) {
              createTask(forms.selectedCategory.id, {
                title: data.title,
                description: data.description,
                assignedTo: data.assignee
              });
            }
          }}
        />

        {/* Delete Project Confirmation */}
        <ConfirmationModal
          isOpen={modals.showDeleteProjectModal}
          title="Delete Project"
          message="Are you sure? This cannot be undone."
          confirmText="Delete"
          onConfirm={deleteProject}
          onCancel={() => closeModal('showDeleteProjectModal')}
          confirmButtonColor="red"
        />

        {/* Members Modal */}
        <Modal isOpen={modals.showMembersModal} onClose={() => closeModal('showMembersModal')} className="max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">Project Members</h2>
            {userRole === 'owner' && (
              <button
                onClick={() => openModal('showAddMemberModal')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <UserPlus className="w-4 h-4" />
                Add Member
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--card))]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {member.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-[hsl(var(--foreground))]">{member.user.name}</p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">{member.user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {userRole === 'owner' && member.userId !== project?.ownerId ? (
                    <select
                      value={member.access}
                      onChange={(e) => updateMemberAccess(member.userId, e.target.value as 'admin' | 'member')}
                      className="px-3 py-1 border border-[hsl(var(--input))] rounded-lg text-sm outline-none bg-[hsl(var(--card))] text-[hsl(var(--foreground))]"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className="px-3 py-1 bg-[hsl(var(--accent))] rounded-full text-sm capitalize flex items-center gap-1 text-[hsl(var(--foreground))]">
                      {member.userId === project?.ownerId && <Crown className="w-3 h-3 text-yellow-500" />}
                      {member.userId === project?.ownerId ? 'Owner' : member.access}
                    </span>
                  )}

                  {userRole === 'owner' && member.userId !== project?.ownerId && (
                    <button
                      onClick={() => {
                        updateForm('memberToRemove', { id: member.userId, name: member.user.name });
                        openModal('showRemoveMemberModal');
                      }}
                      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {(userRole === 'owner' || userRole === 'admin') && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                  Pending Invitations
                </h3>
                <button
                  onClick={() => router.push('/invitations')}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Manage invitations
                </button>
              </div>
              {invitations.length === 0 ? (
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  No pending invitations.
                </p>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {invitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="p-4 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--card))]"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[hsl(var(--foreground))]">
                            {invitation.email}
                          </p>
                          <p className="text-xs text-[hsl(var(--muted-foreground))]">
                            Invited by {invitation.inviter?.name || 'Unknown'} •{' '}
                            {new Date(invitation.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span
                          className={`${INVITATION_STATUS_COLORS[invitation.status]} px-2 py-1 rounded-full text-xs capitalize`}
                        >
                          {invitation.status}
                        </span>
                      </div>
                      <div className="text-xs text-[hsl(var(--muted-foreground))] mt-2">
                        Intended role: {invitation.access}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => closeModal('showMembersModal')}
            className="w-full mt-6 px-4 py-2 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--accent))] transition text-[hsl(var(--foreground))]"
          >
            Close
          </button>
        </Modal>

        {/* Edit Task Modal */}
        <Modal isOpen={modals.showEditTaskModal} onClose={() => {
          closeModal('showEditTaskModal');
          // Reset edit task fields
          resetForm('editingTask');
          resetForm('editTaskTitle');
          resetForm('editTaskDescription');
        }}>
          <h2 className="text-2xl font-bold mb-6 text-[hsl(var(--foreground))]">Edit Task</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (forms.editingTask) {
              updateTask(forms.editingTask.id, {
                title: forms.editTaskTitle,
                description: forms.editTaskDescription
              });
            }
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Title</label>
              <input
                type="text"
                value={forms.editTaskTitle}
                onChange={(e) => updateForm('editTaskTitle', e.target.value)}
                required
                className="w-full px-4 py-2 border border-[hsl(var(--input))] rounded-lg focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent outline-none bg-[hsl(var(--card))] text-[hsl(var(--foreground))]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Description</label>
              <textarea
                value={forms.editTaskDescription}
                onChange={(e) => updateForm('editTaskDescription', e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-2 border border-[hsl(var(--input))] rounded-lg focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent outline-none resize-none bg-[hsl(var(--card))] text-[hsl(var(--foreground))]"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  closeModal('showEditTaskModal');
                  resetForm('editingTask');
                  resetForm('editTaskTitle');
                  resetForm('editTaskDescription');
                }}
                className="flex-1 px-4 py-2 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--accent))] transition text-[hsl(var(--foreground))]"
              >
                Cancel
              </button>
              <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Update
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Task Confirmation Modal */}
        <ConfirmationModal
          isOpen={modals.showDeleteTaskModal}
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          confirmText="Delete"
          onConfirm={() => deleteTask(forms.taskToDelete)}
          onCancel={() => {
            closeModal('showDeleteTaskModal');
            resetForm('taskToDelete');
          }}
          confirmButtonColor="red"
        />

        {/* Update Task Modal */}
        <Modal isOpen={modals.showUpdateTaskModal} onClose={() => {
          closeModal('showUpdateTaskModal');
          resetForm('updateDescription');
          resetForm('updateStatus');
          resetForm('taskToDelete');
        }}>
          <h2 className="text-2xl font-bold mb-6 text-[hsl(var(--foreground))]">Request Task Update</h2>
          <form onSubmit={handleSubmitTaskUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Update Description</label>
              <textarea
                value={forms.updateDescription}
                onChange={(e) => updateForm('updateDescription', e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-2 border border-[hsl(var(--input))] rounded-lg focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent outline-none resize-none bg-[hsl(var(--card))] text-[hsl(var(--foreground))]"
                placeholder="Describe the changes you want to make..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">New Status</label>
              <select
                value={forms.updateStatus}
                onChange={(e) => updateForm('updateStatus', e.target.value as 'active' | 'complete' | 'canceled')}
                className="w-full px-4 py-2 border border-[hsl(var(--input))] rounded-lg focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent outline-none bg-[hsl(var(--card))] text-[hsl(var(--foreground))]"
              >
                <option value="active">Active</option>
                <option value="complete">Complete</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  closeModal('showUpdateTaskModal');
                  resetForm('updateDescription');
                  resetForm('updateStatus');
                  resetForm('taskToDelete');
                }}
                className="flex-1 px-4 py-2 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--accent))] transition text-[hsl(var(--foreground))]"
              >
                Cancel
              </button>
              <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Request Update
              </button>
            </div>
          </form>
        </Modal>

        {/* Review Update Modal */}
        <Modal isOpen={modals.showReviewUpdateModal} onClose={() => {
          closeModal('showReviewUpdateModal');
          resetForm('reviewingTask');
        }} className="max-w-lg">
          <h2 className="text-2xl font-bold mb-6 text-[hsl(var(--foreground))]">Review Task Update</h2>

          <div className="space-y-4">
            {/* Task Info */}
            <div className="rounded-lg p-4 bg-[hsl(var(--accent))]">
              <h3 className="font-semibold text-[hsl(var(--foreground))] mb-2">{forms.reviewingTask?.title}</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">{forms.reviewingTask?.description}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[hsl(var(--muted-foreground))]">Assigned to:</span>
                <span className="font-medium text-[hsl(var(--foreground))]">{forms.reviewingTask?.assignedUser?.name}</span>
              </div>
            </div>

            {/* Update Details */}
            {forms.reviewingTask?.pendingUpdates && forms.reviewingTask.pendingUpdates.length > 0 && (
              <div className="border border-[hsl(var(--border))] rounded-lg p-4 bg-[hsl(var(--card))]">
                <h4 className="font-semibold text-[hsl(var(--foreground))] mb-3">Update Request</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1">Description</label>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] bg-[hsl(var(--accent))] p-3 rounded">
                      {forms.reviewingTask.pendingUpdates[forms.reviewingTask.pendingUpdates.length - 1].updateDescription}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1">Requested Status</label>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      forms.reviewingTask.pendingUpdates[forms.reviewingTask.pendingUpdates.length - 1].newStatus === 'complete'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : forms.reviewingTask.pendingUpdates[forms.reviewingTask.pendingUpdates.length - 1].newStatus === 'canceled'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {forms.reviewingTask.pendingUpdates[forms.reviewingTask.pendingUpdates.length - 1].newStatus}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  closeModal('showReviewUpdateModal');
                  resetForm('reviewingTask');
                }}
                className="flex-1 px-4 py-2 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--accent))] transition text-[hsl(var(--foreground))]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const pendingUpdates = forms.reviewingTask?.pendingUpdates;
                  if (!pendingUpdates || pendingUpdates.length === 0) {
                    toast.error('No pending updates to approve.');
                    return;
                  }
                  const latestUpdate = pendingUpdates[pendingUpdates.length - 1];
                  acceptPendingUpdate(latestUpdate.id, latestUpdate.newStatus as 'active' | 'complete' | 'canceled');
                  closeModal('showReviewUpdateModal');
                  resetForm('reviewingTask');
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Approve Update
              </button>
            </div>
          </div>
        </Modal>

        {/* Delete Category Confirmation */}
        <ConfirmationModal
          isOpen={modals.showDeleteCategoryModal}
          title="Delete Category"
          message={`Are you sure you want to delete the "${forms.categoryToDelete}" category? This will also delete all tasks in this category. This action cannot be undone.`}
          confirmText="Delete Category"
          onConfirm={() => deleteCategory(forms.categoryToDelete)}
          onCancel={() => {
            closeModal('showDeleteCategoryModal');
            resetForm('categoryToDelete');
          }}
          confirmButtonColor="red"
        />

        {/* Remove Member Confirmation */}
        <ConfirmationModal
          isOpen={modals.showRemoveMemberModal}
          title="Remove Member"
          message={`Are you sure you want to remove ${forms.memberToRemove?.name} from this project? They will lose access to all project resources.`}
          confirmText="Remove Member"
          onConfirm={() => removeMember(forms.memberToRemove?.id)}
          onCancel={() => {
            closeModal('showRemoveMemberModal');
            resetForm('memberToRemove');
          }}
          confirmButtonColor="red"
        />

        {/* Add Member Modal */}
        <Modal isOpen={modals.showAddMemberModal} onClose={() => closeModal('showAddMemberModal')}>
          <h2 className="text-2xl font-bold mb-6 text-[hsl(var(--foreground))]">Add Member</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            addMember({
              email: forms.newMemberEmail,
              access: forms.newMemberAccess
            });
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Email</label>
              <input
                type="email"
                value={forms.newMemberEmail}
                onChange={(e) => updateForm('newMemberEmail', e.target.value)}
                required
                className="w-full px-4 py-2 border border-[hsl(var(--input))] rounded-lg focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent outline-none bg-[hsl(var(--card))] text-[hsl(var(--foreground))]"
                placeholder="member@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Role</label>
              <select
                value={forms.newMemberAccess}
                onChange={(e) => updateForm('newMemberAccess', e.target.value as 'admin' | 'member')}
                className="w-full px-4 py-2 border border-[hsl(var(--input))] rounded-lg focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent outline-none bg-[hsl(var(--card))] text-[hsl(var(--foreground))]"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => closeModal('showAddMemberModal')}
                className="flex-1 px-4 py-2 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--accent))] transition text-[hsl(var(--foreground))]"
              >
                Cancel
              </button>
              <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Add Member
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}
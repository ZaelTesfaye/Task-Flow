import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import ConfirmationModal from '@/components/ConfirmationModal';
import Modal from '@/components/Modal';
import { projectAPI, categoryAPI, taskAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  Plus, Settings, Trash2, Users, ArrowLeft, Edit2,
  CheckCircle, Circle, XCircle, Clock, UserPlus, Shield, Crown, FolderOpen, X, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  Project,
  CategoryWithTasks,
  ProjectMember,
  TasksResponse,
  CreateCategoryRequest,
  CreateTaskRequest,
  UpdateProjectRequest,
  AddMemberRequest,
  UpdateMemberRequest,
  UpdateTaskRequest,
  RequestUpdateRequest,
  AcceptUpdateRequest
} from '@/types/api';

interface TaskStatusSelectProps {
  value: 'active' | 'complete' | 'canceled';
  onChange: (status: 'active' | 'complete' | 'canceled') => void;
}

const TaskStatusSelect: React.FC<TaskStatusSelectProps> = ({ value, onChange }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'canceled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as 'active' | 'complete' | 'canceled')}
      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(value)} border-0 outline-none cursor-pointer bg-transparent`}
    >
      <option value="active">Active</option>
      <option value="complete">Complete</option>
      <option value="canceled">Canceled</option>
    </select>
  );
};

export default function ProjectBoard() {
  const router = useRouter();
  const { id: projectId } = router.query;
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [categories, setCategories] = useState<CategoryWithTasks[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'owner' | 'admin' | 'member'>('member');

  // Modals
  const [showProjectSettings, setShowProjectSettings] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [showUpdateTaskModal, setShowUpdateTaskModal] = useState(false);
  const [showReviewUpdateModal, setShowReviewUpdateModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
  const [isMembersPaneOpen, setIsMembersPaneOpen] = useState(false);

  // Forms
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithTasks | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [editingTask, setEditingTask] = useState<any>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDescription, setEditTaskDescription] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberAccess, setNewMemberAccess] = useState<'admin' | 'member'>('member');
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [updateDescription, setUpdateDescription] = useState('');
  const [updateStatus, setUpdateStatus] = useState<'active' | 'complete' | 'canceled'>('active');
  const [memberFilter, setMemberFilter] = useState<'all' | 'owner' | 'admin' | 'member'>('all');
  const [reviewingTask, setReviewingTask] = useState<any>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<{ id: string; name: string } | null>(null);

  const fetchProjectData = useCallback(async () => {
    if (!projectId || !user) return;

    try {
      let [CategoriesRes, membersRes] = await Promise.all([
        taskAPI.getCategories(projectId as string),
        projectAPI.getProjectMembers(projectId as string)
      ]);
    
      const categoriessData: TasksResponse = (CategoriesRes as any).data.data;
      setCategories(categoriessData.categories || []);
      setProject(categoriessData.project);
      setMembers((membersRes as any).data.data || []);

      console.log('Fetched categories:', categoriessData.categories);
      console.log('Categories length:', categoriessData.categories?.length);
      console.log('Categories data:', JSON.stringify(categoriessData.categories, null, 2));

      // Determine user role

      const currentMember = (membersRes as any).data.data.find((m: ProjectMember) => m.userId === user?.id);
      console.log("task data:", categoriessData);
      if (categoriessData?.project?.ownerId === user?.id) {
        setUserRole('owner');
      } else if (currentMember) {
        setUserRole(currentMember.access);
      }

      setProjectTitle(categoriessData?.project?.title);
      setProjectDescription(categoriessData?.project?.description);
    } catch (error) {
      console.error('Failed to fetch project data:', error);
      toast.error('Failed to fetch project data');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [projectId, user, router]);

  useEffect(() => {
    if (projectId && user) {
      fetchProjectData();
    }
  }, [projectId, user, fetchProjectData]);

  // Early return if no user or projectId
  if (!user || !projectId) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  const isOwnerOrAdmin = userRole === 'owner' || userRole === 'admin';

  const filteredMembers = members.filter((member) => {
    if (memberFilter === 'all') return true;
    if (memberFilter === 'owner') return member.userId === project?.ownerId;
    if (memberFilter === 'admin') return member.access === 'admin';
    if (memberFilter === 'member') return member.access === 'member';
    return true;
  });

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: UpdateProjectRequest = {
        title: projectTitle,
        description: projectDescription
      };
      await projectAPI.updateProject(projectId as string, data);
      toast.success('Project updated!');
      setShowProjectSettings(false);
      fetchProjectData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update project');
    }
  };

  const handleDeleteProject = async () => {
    try {
      await projectAPI.removeProject(projectId as string);
      toast.success('Project deleted!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete project');
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: CreateCategoryRequest = { name: categoryName };
      await categoryAPI.createCategory(projectId as string, data);
      toast.success('Category created!');
      setCategoryName('');
      setShowCategoryModal(false);
      fetchProjectData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create category');
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    setCategoryToDelete(categoryId);
    setShowDeleteCategoryModal(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await categoryAPI.removeCategory(projectId as string, categoryToDelete);
      toast.success('Category deleted!');
      setShowDeleteCategoryModal(false);
      setCategoryToDelete(null);
      fetchProjectData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;

    try {
      const data: CreateTaskRequest = {
        title: taskTitle,
        description: taskDescription,
        assignedTo: taskAssignee
      };
      await taskAPI.createTask(projectId as string, selectedCategory.id, data);
      toast.success('Task created!');
      setTaskTitle('');
      setTaskDescription('');
      setTaskAssignee('');
      setSelectedCategory(null);
      setShowTaskModal(false);
      fetchProjectData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setTaskToDelete(taskId);
    setShowDeleteTaskModal(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await taskAPI.removeTask(projectId as string, taskToDelete);
      toast.success('Task deleted!');
      setShowDeleteTaskModal(false);
      setTaskToDelete(null);
      fetchProjectData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const openUpdateTaskModal = (task: any) => {
    setTaskToDelete(task.id); // reusing taskToDelete for the task being updated
    setUpdateDescription('');
    setUpdateStatus(task.status);
    setShowUpdateTaskModal(true);
  };

  const handleSubmitTaskUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskToDelete || !updateDescription.trim()) return;

    try {
      await handleRequestTaskUpdate(taskToDelete, updateDescription, updateStatus);
      setShowUpdateTaskModal(false);
      setTaskToDelete(null);
      setUpdateDescription('');
      setUpdateStatus('active');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to request update');
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    try {
      const data: UpdateTaskRequest = {
        title: editTaskTitle,
        description: editTaskDescription
      };
      await taskAPI.updateTask(projectId as string, editingTask.id, data);
      toast.success('Task updated!');
      setShowEditTaskModal(false);
      setEditingTask(null);
      fetchProjectData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update task');
    }
  };

  const openEditTaskModal = (task: any) => {
    setEditingTask(task);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description);
    setShowEditTaskModal(true);
  };

  const handleUpdateTaskStatus = async (taskId: string, status: 'active' | 'complete' | 'canceled') => {
    try {
      const data: UpdateTaskRequest = { status };
      await taskAPI.updateTask(projectId as string, taskId, data);
      toast.success('Task status updated!');
      fetchProjectData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update task status');
    }
  };

  const handleRequestTaskUpdate = async (taskId: string, updateDescription: string, newStatus: 'active' | 'complete' | 'canceled') => {
    try {
      const data: RequestUpdateRequest = {
        updateDescription,
        newStatus
      };
      await taskAPI.requestTaskUpdate(projectId as string, taskId, data);
      toast.success('Update request submitted!');
      fetchProjectData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to request update');
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: AddMemberRequest = {
        email: newMemberEmail,
        access: newMemberAccess
      };
      await projectAPI.addMember(projectId as string, data);
      toast.success('Member added!');
      setNewMemberEmail('');
      setNewMemberAccess('member');
      setShowAddMemberModal(false);
      fetchProjectData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId: string, memberName: string) => {
    setMemberToRemove({ id: userId, name: memberName });
    setShowRemoveMemberModal(true);
  };

  const confirmRemoveMember = async () => {
    if (!memberToRemove) return;
    try {
      await projectAPI.removeProjectMember(projectId as string, memberToRemove.id);
      toast.success('Member removed!');
      setShowRemoveMemberModal(false);
      setMemberToRemove(null);
      fetchProjectData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove member');
    }
  };

  const handlePromoteMember = async (userId: string, newAccess: 'admin' | 'member') => {
    try {
      const data: UpdateMemberRequest = { access: newAccess };
      await projectAPI.updateMember(projectId as string, userId, data);
      toast.success('Member role updated!');
      fetchProjectData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update member');
    }
  };

  const handleAcceptPendingUpdate = async (pendingUpdateId: string, newStatus: 'active' | 'complete' | 'canceled') => {
    try {
      const data: AcceptUpdateRequest = { newStatus };
      await taskAPI.acceptPendingUpdate(projectId as string, pendingUpdateId, data);
      toast.success('Update approved!');
      fetchProjectData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve update');
    }
  };

  const getStatusIcon = (status: 'active' | 'complete' | 'canceled') => {
    switch (status) {
      case 'complete': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'canceled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Circle className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: 'active' | 'complete' | 'canceled') => {
    switch (status) {
      case 'complete': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Project Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-gray-700 dark:text-gray-300"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project?.title}</h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{project?.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isOwnerOrAdmin && (
                  <>
                    <button
                      onClick={() => setShowCategoryModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Plus className="w-4 h-4" />
                      Add Category
                    </button>
                    {userRole === 'owner' && (
                      <button
                        onClick={() => setShowProjectSettings(true)}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                    )}
                  </>
                )}
                <button
                  onClick={() => setIsMembersPaneOpen(!isMembersPaneOpen)}
                  className={`p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300 ${
                    isMembersPaneOpen ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  title={isMembersPaneOpen ? 'Hide Members' : 'Show Members'}
                >
                  <Users className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className={`flex gap-8 transition-all duration-300 ${isMembersPaneOpen ? 'mr-80' : ''}`}>
            {/* Categories Section */}
            <div className="flex-1">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No categories yet</p>
                  {isOwnerOrAdmin && (
                    <button
                      onClick={() => setShowCategoryModal(true)}
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
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Categories</h2>
                    {isOwnerOrAdmin && (
                      <button
                        onClick={() => setShowCategoryModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add Category
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                      <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                              <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{category.name}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            {isOwnerOrAdmin && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedCategory(category);
                                    setShowTaskModal(true);
                                  }}
                                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-blue-600 dark:text-blue-400"
                                  title="Add Task"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(category.id, category.name)}
                                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition text-red-600 dark:text-red-400"
                                  title="Delete Category"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>{category.tasks?.length || 0} tasks</span>
                            <span className="text-xs">
                              {category.tasks?.filter(t => t.status === 'complete').length || 0} completed
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {category.tasks?.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                              <p className="text-sm">No tasks yet</p>
                              {isOwnerOrAdmin && (
                                <button
                                  onClick={() => {
                                    setSelectedCategory(category);
                                    setShowTaskModal(true);
                                  }}
                                  className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                                >
                                  Add first task
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {category.tasks?.slice(0, 3).map((task) => (
                                <div key={task.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                  {/* Task Header */}
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                      <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                                        task.status === 'complete'
                                          ? 'bg-green-500'
                                          : task.status === 'canceled'
                                          ? 'bg-red-500'
                                          : 'border-2 border-gray-300 dark:border-gray-500'
                                      }`}>
                                        {task.status === 'complete' && (
                                          <CheckCircle className="w-3 h-3 text-white" />
                                        )}
                                        {task.status === 'canceled' && (
                                          <XCircle className="w-3 h-3 text-white" />
                                        )}
                                      </div>
                                      <h4 className={`font-medium text-sm truncate ${
                                        task.status === 'complete'
                                          ? 'text-gray-500 dark:text-gray-400 line-through'
                                          : task.status === 'canceled'
                                          ? 'text-red-500 dark:text-red-400 line-through'
                                          : 'text-gray-900 dark:text-white'
                                      }`}>
                                        {task.title}
                                      </h4>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                                        {task.assignedUser?.name?.charAt(0).toUpperCase()}
                                      </div>
                                      <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-16">
                                        {task.assignedUser?.name}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Status and Pending Updates */}
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        task.status === 'complete'
                                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                          : task.status === 'canceled'
                                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                      }`}>
                                        {task.status}
                                      </span>
                                      {task.pendingUpdates && task.pendingUpdates.length > 0 && (
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-xs font-medium">
                                          {task.pendingUpdates.length} pending
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex items-center justify-end gap-1">
                                    {/* Request Update Button - for assigned user */}
                                    {task.assignedTo === user?.id && (
                                      <button
                                        onClick={() => openUpdateTaskModal(task)}
                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-600 dark:text-gray-400"
                                        title="Request Update"
                                      >
                                        <Clock className="w-3 h-3" />
                                      </button>
                                    )}

                                    {/* Review Update Button - for admin/owner */}
                                    {isOwnerOrAdmin && task.pendingUpdates && task.pendingUpdates.length > 0 && (
                                      <button
                                        onClick={() => {
                                          setReviewingTask(task);
                                          setShowReviewUpdateModal(true);
                                        }}
                                        className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400"
                                        title="Review Update"
                                      >
                                        <Eye className="w-3 h-3" />
                                      </button>
                                    )}

                                    {/* Edit Button - for admin/owner */}
                                    {isOwnerOrAdmin && (
                                      <button
                                        onClick={() => openEditTaskModal(task)}
                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-600 dark:text-gray-400"
                                        title="Edit Task"
                                      >
                                        <Edit2 className="w-3 h-3" />
                                      </button>
                                    )}

                                    {/* Delete Button - for admin/owner */}
                                    {isOwnerOrAdmin && (
                                      <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400"
                                        title="Delete Task"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {category.tasks && category.tasks.length > 3 && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">
                                  +{category.tasks.length - 3} more tasks
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Members Sidebar - Collapsible Side Pane */}
          <div className={`fixed right-0 top-18 h-full w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${
            isMembersPaneOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Members ({filteredMembers.length})
                </h3>
                <button
                  onClick={() => setIsMembersPaneOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-gray-600 dark:text-gray-400"
                  title="Close Members"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Member Filter */}
              <div className="mb-4">
                <select
                  value={memberFilter}
                  onChange={(e) => setMemberFilter(e.target.value as 'all' | 'owner' | 'admin' | 'member')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="all">All Members</option>
                  <option value="owner">Owners</option>
                  <option value="admin">Admins</option>
                  <option value="member">Members</option>
                </select>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {member.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{member.user.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{member.user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {userRole === 'owner' && member.userId !== project?.ownerId ? (
                        <select
                          value={member.access}
                          onChange={(e) => handlePromoteMember(member.userId, e.target.value as 'admin' | 'member')}
                          className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs capitalize flex items-center gap-1 text-gray-700 dark:text-gray-300">
                          {member.userId === project?.ownerId && <Crown className="w-3 h-3 text-yellow-500" />}
                          {member.userId === project?.ownerId ? 'Owner' : member.access}
                        </span>
                      )}

                      {userRole === 'owner' && member.userId !== project?.ownerId && (
                        <button
                          onClick={() => handleRemoveMember(member.userId, member.user.name)}
                          className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-1 rounded transition"
                          title="Remove Member"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {userRole === 'owner' && (
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="w-full mt-4 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <UserPlus className="w-4 h-4 inline mr-2" />
                  Add Member
                </button>
              )}

              <button
                onClick={() => setShowMembersModal(true)}
                className="w-full mt-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
              >
                View All Members
              </button>
            </div>
          </div>
        </div>

        {/* Project Settings Modal */}
        <Modal isOpen={showProjectSettings} onClose={() => setShowProjectSettings(false)}>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Project Settings</h2>
          <form onSubmit={handleUpdateProject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowProjectSettings(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Save
              </button>
            </div>
          </form>
          <hr className="my-4 border-gray-200 dark:border-gray-700" />
          <button
            onClick={() => setShowDeleteProjectModal(true)}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Delete Project
          </button>
        </Modal>

        {/* Delete Project Confirmation */}
        <ConfirmationModal
          isOpen={showDeleteProjectModal}
          title="Delete Project"
          message="Are you sure? This cannot be undone."
          confirmText="Delete"
          onConfirm={handleDeleteProject}
          onCancel={() => setShowDeleteProjectModal(false)}
          confirmButtonColor="red"
        />

        {/* Create Category Modal */}
        <Modal isOpen={showCategoryModal} onClose={() => setShowCategoryModal(false)}>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create Category</h2>
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category Name</label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="To Do, In Progress, Done..."
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Create
              </button>
            </div>
          </form>
        </Modal>

        {/* Create Task Modal */}
        <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)}>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create Task</h2>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assign To</label>
              <select
                value={taskAssignee}
                onChange={(e) => setTaskAssignee(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select member...</option>
                {members.map((member) => (
                  <option key={member.userId} value={member.userId}>
                    {member.user.name} ({member.access})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowTaskModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Create
              </button>
            </div>
          </form>
        </Modal>

        {/* Members Modal */}
        <Modal isOpen={showMembersModal} onClose={() => setShowMembersModal(false)} className="max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Project Members</h2>
            {userRole === 'owner' && (
              <button
                onClick={() => setShowAddMemberModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <UserPlus className="w-4 h-4" />
                Add Member
              </button>
            )}
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {member.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{member.user.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{member.user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {userRole === 'owner' && member.userId !== project?.ownerId ? (
                    <select
                      value={member.access}
                      onChange={(e) => handlePromoteMember(member.userId, e.target.value as 'admin' | 'member')}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm outline-none bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-600 rounded-full text-sm capitalize flex items-center gap-1 text-gray-700 dark:text-gray-300">
                      {member.userId === project?.ownerId && <Crown className="w-3 h-3 text-yellow-500" />}
                      {member.userId === project?.ownerId ? 'Owner' : member.access}
                    </span>
                  )}
                  
                  {userRole === 'owner' && member.userId !== project?.ownerId && (
                    <button
                      onClick={() => handleRemoveMember(member.userId)}
                      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={() => setShowMembersModal(false)}
            className="w-full mt-6 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
          >
            Close
          </button>
        </Modal>

        {/* Edit Task Modal */}
        <Modal isOpen={showEditTaskModal} onClose={() => {
          setShowEditTaskModal(false);
          setEditingTask(null);
        }}>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Task</h2>
          <form onSubmit={handleUpdateTask} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={editTaskTitle}
                onChange={(e) => setEditTaskTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea
                value={editTaskDescription}
                onChange={(e) => setEditTaskDescription(e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowEditTaskModal(false);
                  setEditingTask(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
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
          isOpen={showDeleteTaskModal}
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          confirmText="Delete"
          onConfirm={confirmDeleteTask}
          onCancel={() => {
            setShowDeleteTaskModal(false);
            setTaskToDelete(null);
          }}
          confirmButtonColor="red"
        />

        {/* Update Task Modal */}
        <Modal isOpen={showUpdateTaskModal} onClose={() => {
          setShowUpdateTaskModal(false);
          setTaskToDelete(null);
          setUpdateDescription('');
          setUpdateStatus('active');
        }}>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Request Task Update</h2>
          <form onSubmit={handleSubmitTaskUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Update Description</label>
              <textarea
                value={updateDescription}
                onChange={(e) => setUpdateDescription(e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Describe the changes you want to make..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Status</label>
              <select
                value={updateStatus}
                onChange={(e) => setUpdateStatus(e.target.value as 'active' | 'complete' | 'canceled')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  setShowUpdateTaskModal(false);
                  setTaskToDelete(null);
                  setUpdateDescription('');
                  setUpdateStatus('active');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
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
        <Modal isOpen={showReviewUpdateModal} onClose={() => {
          setShowReviewUpdateModal(false);
          setReviewingTask(null);
        }} className="max-w-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Review Task Update</h2>

          <div className="space-y-4">
            {/* Task Info */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{reviewingTask?.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{reviewingTask?.description}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 dark:text-gray-400">Assigned to:</span>
                <span className="font-medium text-gray-900 dark:text-white">{reviewingTask?.assignedUser?.name}</span>
              </div>
            </div>

            {/* Update Details */}
            {reviewingTask?.pendingUpdates && reviewingTask.pendingUpdates.length > 0 && (
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Update Request</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      {reviewingTask.pendingUpdates[reviewingTask.pendingUpdates.length - 1].updateDescription}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Requested Status</label>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      reviewingTask.pendingUpdates[reviewingTask.pendingUpdates.length - 1].newStatus === 'complete'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : reviewingTask.pendingUpdates[reviewingTask.pendingUpdates.length - 1].newStatus === 'canceled'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {reviewingTask.pendingUpdates[reviewingTask.pendingUpdates.length - 1].newStatus}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowReviewUpdateModal(false);
                  setReviewingTask(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const latestUpdate = reviewingTask?.pendingUpdates[reviewingTask.pendingUpdates.length - 1];
                  handleAcceptPendingUpdate(latestUpdate.id, latestUpdate.newStatus as 'active' | 'complete' | 'canceled');
                  setShowReviewUpdateModal(false);
                  setReviewingTask(null);
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
          isOpen={showDeleteCategoryModal}
          title="Delete Category"
          message={`Are you sure you want to delete the "${categoryToDelete}" category? This will also delete all tasks in this category. This action cannot be undone.`}
          confirmText="Delete Category"
          onConfirm={confirmDeleteCategory}
          onCancel={() => {
            setShowDeleteCategoryModal(false);
            setCategoryToDelete(null);
          }}
          confirmButtonColor="red"
        />

        {/* Remove Member Confirmation */}
        <ConfirmationModal
          isOpen={showRemoveMemberModal}
          title="Remove Member"
          message={`Are you sure you want to remove ${memberToRemove?.name} from this project? They will lose access to all project resources.`}
          confirmText="Remove Member"
          onConfirm={confirmRemoveMember}
          onCancel={() => {
            setShowRemoveMemberModal(false);
            setMemberToRemove(null);
          }}
          confirmButtonColor="red"
        />

      </div>
    </Layout>
  );
}

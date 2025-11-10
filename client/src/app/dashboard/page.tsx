'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { projectAPI } from '@/lib/api';
import { Plus, FolderOpen, Crown, Shield, Users, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';

interface Project {
  id: string;
  title: string;
  description: string;
}

interface ProjectGroups {
  owner: Project[];
  admin: Project[];
  member: Project[];
}

export default function Dashboard() {
  const [projects, setProjects] = useState<ProjectGroups>({ owner: [], admin: [], member: [] });
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activeView, setActiveView] = useState<'all' | 'owner' | 'admin' | 'member'>('all');
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      fetchProjects();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchProjects = async () => {
    try {
  const response = await projectAPI.getUserProjects();
  // API layer already returns ApiResponse<UserProjectsResponse>
  setProjects(response.data || { owner: [], admin: [], member: [] });
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const createdProject = await projectAPI.createProject({ title, description });
      toast.success('Project created successfully!');
      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      if (createdProject?.id) {
        router.push(`/project/${createdProject.id}?createCategory=1`);
        return;
      }
      fetchProjects();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 'admin':
        return <Shield className="w-5 h-5 text-purple-500" />;
      default:
        return <Users className="w-5 h-5 text-green-500" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'admin':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
    }
  };

  const ProjectCard = ({ project, role }: { project: Project; role: string }) => (
    <Card
      onClick={() => router.push(`/project/${project.id}`)}
      className="group cursor-pointer hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl border-2"
    >
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {project.title}
            </CardTitle>
          </div>
          {getRoleIcon(role)}
        </div>
        <CardDescription className="line-clamp-2 min-h-10">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border ${getRoleBadgeColor(role)}`}>
            {role}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Click to open →
          </span>
        </div>
      </CardContent>
    </Card>
  );

  const CreateProjectCard = ({ isFirst }: { isFirst?: boolean }) => (
    <Card
      onClick={() => setShowCreateModal(true)}
      className="group cursor-pointer hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
    >
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 shadow-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
              <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
            <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {isFirst ? 'Create your first project' : 'Add Project'}
            </CardTitle>
          </div>
        </div>
        <CardDescription className="min-h-10">
          {isFirst
            ? 'Start organizing your tasks and collaborating with your team'
            : 'Create a new project to organize tasks and collaborate'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
            New Project
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Click to create →
          </span>
        </div>
      </CardContent>
    </Card>
  );

  if (authLoading || loading) {
    return (
    <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-73px)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading your projects...</p>
          </div>
        </div>
    </Layout>
    );
  }


  console.log("Projects:", projects)
  const allProjects = [...projects.owner, ...projects.admin, ...projects.member];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section - Only show when no projects exist */}
        {allProjects.length === 0 && (
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Your Projects
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] text-lg max-w-2xl mx-auto">
              Manage and organize your tasks efficiently
            </p>
          </div>
        )}

        {/* Navigation Buttons - Show when projects exist or when in filtered view */}
        {(allProjects.length > 0 || activeView !== 'all') && (
          <div className="flex justify-center mb-8">
            <div className="flex gap-2 p-1 rounded-lg bg-[hsl(var(--accent))]">
              <button
                onClick={() => setActiveView('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                  activeView === 'all'
                    ? 'bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm border-[hsl(var(--border))]'
                    : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]'
                }`}
              >
                All Projects ({projects.owner.length + projects.admin.length + projects.member.length})
              </button>
              <button
                onClick={() => setActiveView('owner')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 border ${
                  activeView === 'owner'
                    ? 'bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm border-[hsl(var(--border))]'
                    : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]'
                }`}
              >
                <Crown className="w-4 h-4 text-yellow-500" />
                Own ({projects.owner.length})
              </button>
              <button
                onClick={() => setActiveView('admin')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 border ${
                  activeView === 'admin'
                    ? 'bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm border-[hsl(var(--border))]'
                    : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]'
                }`}
              >
                <Shield className="w-4 h-4 text-purple-500" />
                Admin ({projects.admin.length})
              </button>
              <button
                onClick={() => setActiveView('member')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 border ${
                  activeView === 'member'
                    ? 'bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm border-[hsl(var(--border))]'
                    : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]'
                }`}
              >
                <Users className="w-4 h-4 text-green-500" />
                Member ({projects.member.length})
              </button>
            </div>
          </div>
        )}

        {/* Projects Grid - Always show grid layout */}
        <div className="space-y-8">
          {/* Active View Content */}
          {activeView === 'all' ? (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">All Projects</h2>
                <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold">
                  {allProjects.length}
                </span>
              </div>
              {allProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allProjects.map((project) => {
                    const role = projects.owner.find(p => p.id === project.id)
                      ? 'owner'
                      : projects.admin.find(p => p.id === project.id)
                        ? 'admin'
                        : 'member';
                    return (
                      <ProjectCard key={project.id} project={project} role={role} />
                    );
                  })}
                  <CreateProjectCard />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <CreateProjectCard isFirst={true} />
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-6">
                {activeView === 'owner' && <Crown className="w-6 h-6 text-yellow-500" />}
                {activeView === 'admin' && <Shield className="w-6 h-6 text-purple-500" />}
                {activeView === 'member' && <Users className="w-6 h-6 text-green-500" />}
                <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] capitalize">
                  {activeView === 'owner' ? 'Own Projects' : activeView === 'admin' ? 'Admin Projects' : 'Member Projects'}
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  activeView === 'owner' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                  activeView === 'admin' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                  'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                }`}>
                  {activeView === 'owner' ? projects.owner.length :
                   activeView === 'admin' ? projects.admin.length :
                   projects.member.length}
                </span>
              </div>
              {(activeView === 'owner' ? projects.owner.length :
                activeView === 'admin' ? projects.admin.length :
                projects.member.length) > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(activeView === 'owner' ? projects.owner :
                    activeView === 'admin' ? projects.admin :
                    projects.member).map((project) => (
                    <ProjectCard key={project.id} project={project} role={activeView} />
                  ))}
                  {activeView === 'owner' && <CreateProjectCard />}
                </div>
              ) : (
                <div className="text-center py-12">
                  {activeView === 'owner' ? (
                    <>
                      <Crown className="w-16 h-16 text-yellow-300 dark:text-yellow-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                        No Projects Created Yet
                      </h3>
                      <p className="text-[hsl(var(--muted-foreground))] max-w-md mx-auto mb-6">
                        Start your first project to organize your tasks and collaborate with your team.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <CreateProjectCard isFirst={true} />
                      </div>
                    </>
                  ) : activeView === 'admin' ? (
                    <>
                      <Shield className="w-16 h-16 text-purple-300 dark:text-purple-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                        No Projects Where You Are Admin
                      </h3>
                      <p className="text-[hsl(var(--muted-foreground))] max-w-md mx-auto">
                        Projects appear here when others add you as an admin or when you are granted admin access to existing projects.
                      </p>
                    </>
                  ) : (
                    <>
                      <Users className="w-16 h-16 text-green-300 dark:text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                        No Projects Where You Are Member
                      </h3>
                      <p className="text-[hsl(var(--muted-foreground))] max-w-md mx-auto">
                        Projects appear here when others add you as a member to their projects.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Create Project Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Start a new project to organize your tasks and collaborate with your team
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="My Awesome Project"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="flex w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))] disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none"
                  placeholder="Describe your project..."
                />
              </div>
              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Project</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
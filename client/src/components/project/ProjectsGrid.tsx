import React from "react";
import { Shield, Users } from "lucide-react";
import type { Project } from "@/types/index";
import { ProjectCard, CreateProjectCard } from "@/components";

interface ProjectGroups {
  owner: Project[];
  admin: Project[];
  member: Project[];
}

interface ProjectsGridSectionProps {
  projects: ProjectGroups;
  activeView: "all" | "owner" | "admin" | "member";
  onCreateProject: () => void;
}

const ProjectsGridSection: React.FC<ProjectsGridSectionProps> = ({ projects, activeView, onCreateProject }) => {
  const allProjects = [...projects.owner, ...projects.admin, ...projects.member];

  const emptySectionContent = [
    {
      view: "owner" as const,
      showCreateCard: true,
    },
    {
      view: "admin" as const,
      icon: Shield,
      iconClass: "text-blue-300 dark:text-blue-600",
      title: "No Projects Where You Are Admin",
      description:
        "Projects appear here when others add you as an admin or when you are granted admin access to existing projects.",
      showCreateCard: false,
    },
    {
      view: "member" as const,
      icon: Users,
      iconClass: "text-green-600 dark:text-green-600",
      title: "No Projects Where You Are Member",
      description: "Projects appear here when others add you as a member to their projects.",
      showCreateCard: false,
    },
  ] as const;

  return (
    <div className="space-y-8">
      {activeView === "all" ? (
        <div>
          {/* All Projects Section Content */}
          <div className="mb-6 flex items-center gap-3">
            <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">All Projects</h2>
            <span className="rounded-full border border-blue-300 bg-blue-200 px-3 py-1 text-sm font-semibold text-blue-900 dark:border-blue-800/60 dark:bg-blue-900/30 dark:text-blue-400">
              {allProjects.length}
            </span>
          </div>
          {allProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allProjects.map((project) => {
                const role = projects.owner.find((p) => p.id === project.id)
                  ? "owner"
                  : projects.admin.find((p) => p.id === project.id)
                    ? "admin"
                    : "member";
                return <ProjectCard key={project.id} project={project} role={role} />;
              })}
              <CreateProjectCard setShowCreateModal={onCreateProject} />
            </div>
          ) : (
            // Show create project card only if no project found
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <CreateProjectCard isFirst={true} setShowCreateModal={onCreateProject} />
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Other sections */}
          <div className="mb-6 flex items-center gap-3">
            <h2 className="text-2xl font-bold capitalize text-[hsl(var(--foreground))]">
              {activeView === "owner" ? "Own Projects" : activeView === "admin" ? "Admin Projects" : "Member Projects"}
            </h2>
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                activeView === "owner"
                  ? "badge-role-owner"
                  : activeView === "admin"
                    ? "badge-role-admin"
                    : "badge-role-member"
              }`}
            >
              {activeView === "owner"
                ? projects.owner.length
                : activeView === "admin"
                  ? projects.admin.length
                  : projects.member.length}
            </span>
          </div>

          {(activeView === "owner"
            ? projects.owner.length
            : activeView === "admin"
              ? projects.admin.length
              : projects.member.length) > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(activeView === "owner"
                ? projects.owner
                : activeView === "admin"
                  ? projects.admin
                  : projects.member
              ).map((project) => (
                <ProjectCard key={project.id} project={project} role={activeView} />
              ))}
              {/* Show create project card only inside own projects section. */}
              {activeView === "owner" && <CreateProjectCard setShowCreateModal={onCreateProject} />}
            </div>
          ) : (
            // If no projects in the section
            <div className="py-12 text-center">
              {(() => {
                const content = emptySectionContent.find((c) => c.view === activeView);

                if (!content) return null;

                return (
                  <>
                    {content.view !== "owner" && (
                      <content.icon className={`mx-auto mb-4 h-16 w-16 ${content.iconClass}`} />
                    )}
                    {content.view !== "owner" && (
                      <h3 className="mb-2 text-xl font-semibold text-[hsl(var(--foreground))]">{content.title}</h3>
                    )}
                    {content.view !== "owner" && (
                      <p
                        className={`mx-auto max-w-md text-[hsl(var(--muted-foreground))] ${
                          content.showCreateCard ? "mb-6" : ""
                        }`}
                      >
                        {content.description}
                      </p>
                    )}
                    {content.showCreateCard && (
                      <div className="mx-auto grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <CreateProjectCard isFirst={true} setShowCreateModal={onCreateProject} />
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectsGridSection;

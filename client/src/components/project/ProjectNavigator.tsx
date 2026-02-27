import React from "react";
import { Folder, Shield, Users } from "lucide-react";
import type { Project } from "@/types/index";

interface ProjectGroups {
  owner: Project[];
  admin: Project[];
  member: Project[];
}

interface ProjectNavigationProps {
  projects: ProjectGroups;
  activeView: "all" | "owner" | "admin" | "member";
  onViewChange: (view: "all" | "owner" | "admin" | "member") => void;
}

const ProjectNavigation: React.FC<ProjectNavigationProps> = ({ projects, activeView, onViewChange }) => {
  const allProjects = [...projects.owner, ...projects.admin, ...projects.member];

  const navItems = [
    {
      key: "all" as const,
      label: "All Projects",
      count: allProjects.length,
      icon: null,
    },
    {
      key: "owner" as const,
      label: "Own",
      count: projects.owner.length,
      icon: <Folder className="h-4 w-4 text-yellow-500" />,
    },
    {
      key: "admin" as const,
      label: "Admin",
      count: projects.admin.length,
      icon: <Shield className="h-4 w-4 text-blue-500" />,
    },
    {
      key: "member" as const,
      label: "Member",
      count: projects.member.length,
      icon: <Users className="h-4 w-4 text-green-500" />,
    },
  ];

  return (
    <div className="mb-8 flex justify-center">
      <div className="flex gap-2 rounded-lg bg-[hsl(var(--accent))] p-1">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onViewChange(item.key)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors hover:cursor-pointer ${
              item.icon ? "flex items-center gap-2" : ""
            } border ${
              activeView === item.key
                ? "border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm"
                : "border-transparent text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
            }`}
          >
            {item.icon}
            {item.label} ({item.count})
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectNavigation;

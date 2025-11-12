import React from "react";
import { Folder, Shield, Users } from "lucide-react";
import type { Project } from "@/types/api";

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

const ProjectNavigation: React.FC<ProjectNavigationProps> = ({
  projects,
  activeView,
  onViewChange,
}) => {
  const allProjects = [
    ...projects.owner,
    ...projects.admin,
    ...projects.member,
  ];

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
      icon: <Folder className="w-4 h-4 text-yellow-500" />,
    },
    {
      key: "admin" as const,
      label: "Admin",
      count: projects.admin.length,
      icon: <Shield className="w-4 h-4 text-blue-500" />,
    },
    {
      key: "member" as const,
      label: "Member",
      count: projects.member.length,
      icon: <Users className="w-4 h-4 text-green-500" />,
    },
  ];

  return (
    <div className="flex justify-center mb-8">
      <div className="flex gap-2 p-1 rounded-lg bg-[hsl(var(--accent))]">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onViewChange(item.key)}
            className={`hover:cursor-pointer px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              item.icon ? "flex items-center gap-2" : ""
            } border ${
              activeView === item.key
                ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm border-[hsl(var(--border))]"
                : "border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]"
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

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Settings, Users, LogOut } from "lucide-react";
import { Project, UserRole } from "@/types";

export interface ProjectHeaderProps {
  project: Project;
  userRole: UserRole;
  onToggleSettings: () => void;
  isSettingsPaneOpen: boolean;
  onToggleMembers: () => void;
  isMembersPaneOpen: boolean;
  onLeaveProject: () => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  userRole,
  onToggleSettings,
  isSettingsPaneOpen,
  onToggleMembers,
  isMembersPaneOpen,
  onLeaveProject,
}) => {
  const router = useRouter();

  return (
    <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]">
      <div className={`mx-auto max-w-7xl px-6 py-3 ${isMembersPaneOpen || isSettingsPaneOpen ? "pr-80" : ""}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="rounded-lg p-2 transition hover:cursor-pointer hover:bg-[hsl(var(--accent))]"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">{project?.title}</h1>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">{project?.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMembers();
              }}
              className={`rounded-lg border p-2 transition hover:cursor-pointer ${
                isMembersPaneOpen
                  ? "border-[hsl(var(--ring))] bg-[hsl(var(--accent))]"
                  : "border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]"
              }`}
              title="Show Members"
            >
              <Users className="h-5 w-5" />
            </button>
            {userRole !== "owner" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLeaveProject();
                }}
                className="rounded-lg border border-[hsl(var(--border))] p-2 transition hover:cursor-pointer hover:bg-red-500/10"
                title="Leave Project"
              >
                <LogOut className="h-5 w-5" />
              </button>
            )}
            {userRole === "owner" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSettings();
                }}
                className={`rounded-lg border p-2 transition hover:cursor-pointer ${
                  isSettingsPaneOpen
                    ? "border-[hsl(var(--ring))] bg-[hsl(var(--accent))]"
                    : "border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]"
                }`}
                title="Show Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;

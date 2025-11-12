import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Settings, Users } from "lucide-react";
import { ProjectHeaderProps } from "@/types/component.type";

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  userRole,
  onToggleSettings,
  isSettingsPaneOpen,
  onToggleMembers,
  isMembersPaneOpen,
}) => {
  const router = useRouter();

  return (
    <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border-b border-[hsl(var(--border))]">
      <div
        className={`max-w-7xl mx-auto px-6 py-6 ${
          isMembersPaneOpen || isSettingsPaneOpen ? "pr-80" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="p-2 hover:bg-[hsl(var(--accent))] rounded-lg transition hover:cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                {project?.title}
              </h1>
              <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                {project?.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMembers();
              }}
              className={`p-2 border rounded-lg transition hover:cursor-pointer ${
                isMembersPaneOpen
                  ? "border-[hsl(var(--ring))] bg-[hsl(var(--accent))]"
                  : "border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]"
              }`}
              title="Show Members"
            >
              <Users className="w-5 h-5" />
            </button>
            {userRole === "owner" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSettings();
                }}
                className={`p-2 border rounded-lg transition hover:cursor-pointer ${
                  isSettingsPaneOpen
                    ? "border-[hsl(var(--ring))] bg-[hsl(var(--accent))]"
                    : "border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]"
                }`}
                title="Show Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;

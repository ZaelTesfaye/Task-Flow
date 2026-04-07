"use client";

import { Folder, FolderOpen, Shield, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components";
import { useProjectNotifications, useNotificationMutations } from "@/hooks";

export interface ProjectProps {
  id: string;
  title: string;
  description: string;
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case "owner":
      return <Folder className="w-5 h-5 text-yellow-500" />;
    case "admin":
      return <Shield className="w-5 h-5 text-blue-500" />;
    default:
      return <Users className="w-5 h-5 text-green-500" />;
  }
};

const ProjectCard = ({ project, role }: { project: ProjectProps; role: string }) => {
  const router = useRouter();
  const { notificationCount } = useProjectNotifications(project.id);
  const { markProjectNotificationsAsRead } = useNotificationMutations(project.id);

  const badgeClasses =
    role === "owner"
      ? "badge-role-owner"
      : role === "admin"
        ? "badge-role-admin"
        : role === "member"
          ? "badge-role-member"
          : "bg-muted text-foreground border border-border";

  const handleCardClick = async () => {
    await markProjectNotificationsAsRead();
    router.push(`/project?id=${project.id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      className="group relative cursor-pointer border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
    >
      {/* Notification Badge */}
      {notificationCount > 0 && (
        <div className="absolute z-10 -right-2 -top-2">
          <div className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-red-500 px-2 shadow-lg">
            <span className="text-xs font-bold text-white">{notificationCount > 99 ? "99+" : notificationCount}</span>
          </div>
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg shadow-sm bg-gradient-to-br from-blue-200 to-indigo-300 dark:from-blue-800 dark:to-indigo-800">
              <FolderOpen className="w-5 h-5 text-blue-500" />
            </div>
            <CardTitle className="text-xl text-[hsl(var(--foreground))] transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {project.title}
            </CardTitle>
          </div>
          {getRoleIcon(role)}
        </div>
        <CardDescription className="pmin-h-10 text-[hsl(var(--muted-foreground))]">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${badgeClasses}`}
            aria-label={`${role} role`}
          >
            {role}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;

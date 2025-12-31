"use client";

import { Folder, FolderOpen, Shield, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui";
import { ROLE_BADGE_COLORS } from "@/constants";
import { notificationAPI } from "@/lib/api";
import { useEffect } from "react";

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

const ProjectCard = ({
  project,
  role,
}: {
  project: ProjectProps;
  role: string;
}) => {
  console.log("ProjectCard role:", role);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch notification count for this project
  const { data: notificationData } = useQuery({
    queryKey: ["project-notifications", project.id],
    queryFn: () => notificationAPI.getProjectNotificationCount(project.id),
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
  });

  const notificationCount = notificationData?.data?.count || 0;

  const badgeClasses =
    ROLE_BADGE_COLORS[role as keyof typeof ROLE_BADGE_COLORS] ||
    "bg-gray-100 text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-gray-100";

  const handleCardClick = async () => {
    // Mark project notifications as read when navigating to project
    if (notificationCount > 0) {
      try {
        await notificationAPI.markProjectNotificationsAsRead(project.id);
        // Invalidate the query to immediately update the UI
        await queryClient.invalidateQueries({
          queryKey: ["project-notifications", project.id],
        });
      } catch (error) {
        console.error("Failed to mark notifications as read:", error);
      }
    }
    router.push(`/project?id=${project.id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      className="group cursor-pointer hover:scale-[1.02] transition-all duration-300 hover:shadow-sm
       border dark:border-gray-600 dark:shadow-gray-700 hover:dark:shadow-md relative"
    >
      {/* Notification Badge */}
      {notificationCount > 0 && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="flex items-center justify-center min-w-[24px] h-6 px-2 bg-red-500 rounded-full shadow-lg">
            <span className="text-xs font-bold text-white">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          </div>
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg shadow-sm bg-gradient-to-br from-blue-200 to-indigo-300 dark:from-blue-800 dark:to-indigo-800">
              <FolderOpen className="w-5 h-5 text-blue-500" />
            </div>
            <CardTitle className="text-xl transition-colors text-[hsl(var(--foreground))] group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {project.title}
            </CardTitle>
          </div>
          {getRoleIcon(role)}
        </div>
        <CardDescription className="text-[hsl(var(--muted-foreground))] pmin-h-10">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border ${badgeClasses}`}
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

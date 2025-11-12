import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Folder, FolderOpen, Shield, Users } from "lucide-react";
import type { ProjectProps } from "@/types/component.type";

const getRoleIcon = (role: string) => {
  switch (role) {
    case "owner":
      return <Folder className="w-5 h-5 text-yellow-500" />;
    case "admin":
      return <Shield className="w-5 h-5 text-purple-500" />;
    default:
      return <Users className="w-5 h-5 text-green-500" />;
  }
};
const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "owner":
      return "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
    case "admin":
      return "bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 border-purple-200 dark:border-purple-800";
    default:
      return "bg-emerald-50 dark:bg-green-900/30 text-emerald-800 dark:text-green-400 border-emerald-200 dark:border-green-800";
  }
};

const ProjectCard = ({
  project,
  role,
}: {
  project: ProjectProps;
  role: string;
}) => {
  const router = useRouter();
  return (
    <Card
      onClick={() => router.push(`/project/${project.id}`)}
      className="group cursor-pointer hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl border dark:border-gray-600 dark:shadow-gray-700 hover:dark:shadow-lg"
    >
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg shadow-lg bg-linear-to-br from-blue-500 to-indigo-600">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-xl transition-colors text-[hsl(var(--foreground))] group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {project.title}
            </CardTitle>
          </div>
          {getRoleIcon(role)}
        </div>
        <CardDescription className="text-[hsl(var(--muted-foreground))] line-clamp-2 min-h-10">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border ${getRoleBadgeColor(
              role
            )}`}
          >
            {role}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;

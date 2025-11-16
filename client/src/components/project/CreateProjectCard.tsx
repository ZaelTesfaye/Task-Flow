import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui";

const AddProjectCard = ({
  isFirst,
  setShowCreateModal,
}: {
  isFirst?: boolean;
  setShowCreateModal: (show: boolean) => void;
}) => (
  <Card
    onClick={() => setShowCreateModal(true)}
    className="group cursor-pointer hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl border-2 border-dashed border-[hsl(var(--border))] hover:border-blue-400 dark:hover:border-blue-500"
  >
    <CardHeader>
      <div className="flex items-center gap-2">
        <div className="p-2 transition-colors bg-[hsl(var(--muted))] rounded-lg shadow-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30">
          <Plus className="w-5 h-5 text-[hsl(var(--muted-foreground))] transition-colors " />
        </div>
        <CardTitle className="text-xl transition-colors ">
          {isFirst ? "Create your first project" : "Add Project"}
        </CardTitle>
      </div>
      <CardDescription className="min-h-10">
        {isFirst
          ? "Start organizing your tasks and collaborating with your team"
          : "Create a new project to organize tasks and collaborate"}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <span className="px-3 py-1.5 text-xs font-semibold text-[hsl(var(--foreground))] bg-[hsl(var(--muted))] dark:bg-gray-900/50 border border-[hsl(var(--border))] rounded-full">
        New Project
      </span>
    </CardContent>
  </Card>
);

export default AddProjectCard;

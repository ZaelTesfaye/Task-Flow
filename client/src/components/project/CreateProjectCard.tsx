import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components";

const AddProjectCard = ({
  isFirst,
  setShowCreateModal,
}: {
  isFirst?: boolean;
  setShowCreateModal: (show: boolean) => void;
}) => (
  <Card
    onClick={() => setShowCreateModal(true)}
    className="group cursor-pointer border-2 border-dashed border-[hsl(var(--border))] transition-all duration-300 hover:scale-[1.02] hover:border-blue-400 hover:shadow-2xl dark:hover:border-blue-500"
  >
    <CardHeader>
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-[hsl(var(--muted))] p-2 shadow-lg transition-colors group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30">
          <Plus className="h-5 w-5 text-[hsl(var(--muted-foreground))] transition-colors" />
        </div>
        <CardTitle className="text-xl transition-colors">
          {isFirst ? "Create your first project" : "Add Project"}
        </CardTitle>
      </div>
      <CardDescription className="min-h-10 text-left">
        {isFirst
          ? "Start organizing your tasks and collaborating with your team"
          : "Create a new project to organize tasks and collaborate"}
      </CardDescription>
    </CardHeader>
    <CardContent className="flex justify-start">
      <span className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-3 py-1.5 text-xs font-semibold text-[hsl(var(--foreground))]">
        New Project
      </span>
    </CardContent>
  </Card>
);

export default AddProjectCard;

import React from "react";
import { X, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui";

export interface ProjectSettingsPaneProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSave: () => void | Promise<void>;
  onDelete: () => void;
  isSaving?: boolean;
}

const ProjectSettingsPane: React.FC<ProjectSettingsPaneProps> = ({
  isOpen,
  onClose,
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onSave,
  onDelete,
  isSaving = false,
}) => {
  return (
    <div
      // Ensure this side pane aligns beneath the page header. `top-18` is not a
      // default Tailwind spacing key; use explicit value to avoid layout issues.
      className={`fixed right-0 top-[72px] h-full w-80 bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border-l border-[hsl(var(--border))] shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--border))]">
        <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">
          Project Settings
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-[hsl(var(--accent))] rounded-lg transition"
          title="Close Settings"
        >
          <X className="w-4 h-4 hover:cursor-pointer" />
        </button>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void onSave();
        }}
        className="flex flex-col gap-4 p-6"
      >
        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-[hsl(var(--foreground))]"
            htmlFor="project-title"
          >
            Title
          </label>
          <input
            id="project-title"
            type="text"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            className="w-full px-3 py-2 outline-1 focus:outline-none border border-[hsl(var(--input))] rounded-lg focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent outline bg-[hsl(var(--card))] text-[hsl(var(--foreground))]"
            placeholder="Project title"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-[hsl(var(--foreground))]"
            htmlFor="project-description"
          >
            Description
          </label>
          <textarea
            id="project-description"
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            rows={5}
            className="w-full px-3 py-2 outline-1 focus:outline-none  border border-[hsl(var(--input))] outline rounded-lg focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent resize-none bg-[hsl(var(--card))] text-[hsl(var(--foreground))]"
            placeholder="Describe your project"
          />
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full px-4 py-2 text-[hsl(var(--primary-foreground))] transition bg-blue-600 rounded-lg hover:cursor-pointer hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Spinner className="text-white" />
                <span>Saving...</span>
              </>
            ) : (
              "Save Changes"
            )}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="w-full px-4 py-2 text-red-600 transition border border-red-200 rounded-lg hover:cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="inline w-4 h-4 mr-2" />
            Delete Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectSettingsPane;

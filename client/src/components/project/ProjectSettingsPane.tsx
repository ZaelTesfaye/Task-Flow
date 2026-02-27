import React from "react";
import { X, Trash2 } from "lucide-react";
import { Spinner } from "@/components";

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
      className={`fixed right-0 top-[72px] z-40 h-full w-80 transform border-l border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-xl transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between border-b border-[hsl(var(--border))] p-6">
        <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">Project Settings</h3>
        <button
          onClick={onClose}
          className="rounded-lg p-2 transition hover:bg-[hsl(var(--accent))]"
          title="Close Settings"
        >
          <X className="h-4 w-4 hover:cursor-pointer" />
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
          <label className="block text-sm font-medium text-[hsl(var(--foreground))]" htmlFor="project-title">
            Title
          </label>
          <input
            id="project-title"
            type="text"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-3 py-2 text-[hsl(var(--foreground))] outline outline-1 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
            placeholder="Project title"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[hsl(var(--foreground))]" htmlFor="project-description">
            Description
          </label>
          <textarea
            id="project-description"
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            rows={5}
            className="w-full resize-none rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-3 py-2 text-[hsl(var(--foreground))] outline outline-1 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
            placeholder="Describe your project"
          />
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-[hsl(var(--primary-foreground))] transition hover:cursor-pointer hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
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
            className="w-full rounded-lg border border-red-200 px-4 py-2 text-red-600 transition hover:cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="mr-2 inline h-4 w-4" />
            Delete Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectSettingsPane;

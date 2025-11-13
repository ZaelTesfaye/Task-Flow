import React from "react";
import { Modal } from "@/components/modals";
import toast from "react-hot-toast";

interface ReviewUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  forms: any;
  resetForm: (
    key: keyof typeof import("@/constants/project").DEFAULT_FORM_STATE
  ) => void;
  acceptPendingUpdate: (
    pendingUpdateId: string,
    newStatus: import("@/constants/project").TaskStatus
  ) => void;
  rejectPendingUpdate: (pendingUpdateId: string) => void;
}

const ReviewUpdateModal: React.FC<ReviewUpdateModalProps> = ({
  isOpen,
  onClose,
  task,
  forms,
  resetForm,
  acceptPendingUpdate,
  rejectPendingUpdate,
}) => {
  const handleClose = () => {
    onClose();
    resetForm("reviewingTask");
  };

  const handleReject = () => {
    const pendingUpdates = forms.reviewingTask?.pendingUpdates;
    if (!pendingUpdates || pendingUpdates.length === 0) {
      toast.error("No pending updates to reject.");
      return;
    }
    const latestUpdate = pendingUpdates[pendingUpdates.length - 1];
    rejectPendingUpdate(latestUpdate.id);
    handleClose();
  };

  const handleApprove = () => {
    const pendingUpdates = forms.reviewingTask?.pendingUpdates;
    if (!pendingUpdates || pendingUpdates.length === 0) {
      toast.error("No pending updates to approve.");
      return;
    }
    const latestUpdate = pendingUpdates[pendingUpdates.length - 1];
    acceptPendingUpdate(
      latestUpdate.id,
      latestUpdate.newStatus as "active" | "complete" | "canceled"
    );
    handleClose();
  };

  const latestUpdate =
    forms.reviewingTask?.pendingUpdates?.[
      forms.reviewingTask.pendingUpdates.length - 1
    ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-lg">
      <h2 className="text-2xl font-bold mb-6 text-[hsl(var(--foreground))]">
        Review Task Update
      </h2>

      <div className="space-y-4">
        {/* Task Info */}
        <div className="rounded-lg p-4 bg-[hsl(var(--accent))]">
          <h3 className="font-semibold text-[hsl(var(--foreground))] mb-4">
            Task
          </h3>
          <div className="flex gap-3">
            <label htmlFor="task-title">Title:</label>
            <h3
              id="task-title"
              className="font-semibold text-[hsl(var(--muted-foreground))] mb-2"
            >
              {forms.reviewingTask?.title}
            </h3>
          </div>
          <div className="flex gap-4">
            <label htmlFor="task-description">Description: </label>
            <p
              id="task-description"
              className="text-[hsl(var(--muted-foreground))] mb-3"
            >
              {forms.reviewingTask?.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span>Assigned to:</span>
            <span className="text-[hsl(var(--muted-foreground))] ]">
              {forms.reviewingTask?.assignedUser?.name}
            </span>
          </div>
        </div>

        {/* Update Details */}
        {latestUpdate && (
          <div className="border border-[hsl(var(--border))] rounded-lg p-4 bg-[hsl(var(--card))]">
            <h4 className="font-semibold text-[hsl(var(--foreground))] mb-4">
              Update Request
            </h4>
            <div className="space-y-4">
              <div className="space-x-4">
                <label className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">
                  Description
                </label>
                <span className="text-sm text-[hsl(var(--muted-foreground))] bg-[hsl(var(--accent))] py-2 rounded">
                  {latestUpdate.updateDescription}
                </span>
              </div>
              <div className="space-x-4">
                <label className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">
                  Requested Status
                </label>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    latestUpdate.newStatus === "complete"
                      ? "bg-emerald-50 text-emerald-800 dark:bg-green-900/30 dark:text-green-400"
                      : latestUpdate.newStatus === "canceled"
                      ? "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}
                >
                  {latestUpdate.newStatus}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-12 ">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-[hsl(var(--primary-foreground))] dark:text-white transition bg-red-600 rounded-lg hover:cursor-pointer hover:bg-red-700"
          >
            Reject Update
          </button>
          <button
            onClick={handleApprove}
            className="px-4 py-2 text-[hsl(var(--primary-foreground))] dark:text-white transition bg-green-600 rounded-lg hover:cursor-pointer hover:bg-green-700"
          >
            Approve Update
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReviewUpdateModal;

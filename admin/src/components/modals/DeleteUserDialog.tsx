import React from "react";
import { Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import type { AdminUser } from "../../types";

interface DeleteUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userToDelete: AdminUser | null;
  onConfirmDelete: () => void;
  loading?: boolean;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  isOpen,
  onClose,
  userToDelete,
  onConfirmDelete,
  loading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg font-semibold">
            <Shield className="w-5 h-5 mr-2 text-red-600" />
            Delete User
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {userToDelete?.name}
            </span>
            ? This action cannot be undone.
          </p>
        </div>
        <DialogFooter className="flex space-x-2">
          <Button
            onClick={() => {
              onClose();
            }}
            variant="outline"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirmDelete}
            variant="destructive"
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <Spinner className="text-white" />
                <span>Deleting...</span>
              </>
            ) : (
              "Delete User"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserDialog;

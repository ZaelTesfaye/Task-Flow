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
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { AdminUser } from "../../types";

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: AdminUser | null;
  newPassword: string;
  setNewPassword: (password: string) => void;
  onUpdatePassword: () => void;
}

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  isOpen,
  onClose,
  selectedUser,
  newPassword,
  setNewPassword,
  onUpdatePassword,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg font-semibold">
            <Shield className="w-5 h-5 mr-2 text-blue-600" />
            Change Password
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Change password for{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {selectedUser?.name}
            </span>
          </p>
          <div>
            <Label
              htmlFor="newPassword"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewPassword(e.target.value)
              }
              placeholder="Enter new password"
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter className="flex space-x-2">
          <Button
            onClick={() => {
              onClose();
              setNewPassword("");
            }}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onClick={onUpdatePassword}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Update Password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;

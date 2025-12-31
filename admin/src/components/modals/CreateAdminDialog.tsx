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
import { Spinner } from "../ui/spinner";

interface CreateAdminDialogProps {
  isOpen: boolean;
  onClose: () => void;
  adminUsername: string;
  setAdminUsername: (username: string) => void;
  adminName: string;
  setAdminName: (name: string) => void;
  adminPassword: string;
  setAdminPassword: (password: string) => void;
  onCreateAdmin: () => void;
  loading?: boolean;
}

const CreateAdminDialog: React.FC<CreateAdminDialogProps> = ({
  isOpen,
  onClose,
  adminUsername,
  setAdminUsername,
  adminName,
  setAdminName,
  adminPassword,
  setAdminPassword,
  onCreateAdmin,
  loading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg font-semibold">
            <Shield className="w-5 h-5 mr-2 text-green-600" />
            Create New Admin
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label
              htmlFor="adminUsername"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Username
            </Label>
            <Input
              id="adminUsername"
              type="text"
              value={adminUsername}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAdminUsername(e.target.value)
              }
              placeholder="Enter username"
              className="w-full"
            />
          </div>
          <div>
            <Label
              htmlFor="adminName"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Full Name
            </Label>
            <Input
              id="adminName"
              type="text"
              value={adminName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAdminName(e.target.value)
              }
              placeholder="Enter full name"
              className="w-full"
            />
          </div>
          <div>
            <Label
              htmlFor="adminPassword"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </Label>
            <Input
              id="adminPassword"
              type="password"
              value={adminPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAdminPassword(e.target.value)
              }
              placeholder="Enter password"
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter className="flex space-x-2">
          <Button
            onClick={() => {
              setAdminUsername("");
              setAdminName("");
              setAdminPassword("");
              onClose();
            }}
            variant="outline"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={onCreateAdmin}
            className="text-white bg-green-600 hover:bg-green-700 flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner className="text-white" />
                <span>Creating...</span>
              </>
            ) : (
              "Create Admin"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdminDialog;

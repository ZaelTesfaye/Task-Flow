import React from "react";
import Modal from "./Modal";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonColor?: "red" | "blue" | "green";
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  confirmButtonColor = "red",
  isLoading = false,
}) => {
  const getConfirmButtonClasses = () => {
    const baseClasses =
      "flex-1 px-4 py-2 text-[hsl(var(--primary-foreground))] rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed";

    switch (confirmButtonColor) {
      case "red":
        return `${baseClasses} bg-red-600 hover:bg-red-700  dark:text-white`;
      case "blue":
        return `${baseClasses} bg-blue-600 hover:bg-blue-700  dark:text-white`;
      case "green":
        return `${baseClasses} bg-green-600 hover:bg-green-700 dark:text-white`;
      default:
        return `${baseClasses} bg-red-600 hover:bg-red-700 text-black dark:text-white`;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <h2
        className={`text-2xl font-bold mb-4 ${
          confirmButtonColor === "red"
            ? "text-red-600 dark:text-red-400"
            : "text-[hsl(var(--foreground))]"
        }`}
      >
        {title}
      </h2>
      <p className="mb-6 text-[hsl(var(--muted-foreground))]">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-2 text-[hsl(var(--foreground))] transition border border-[hsl(var(--border))] rounded-lg hover:cursor-pointer hover:bg-[hsl(var(--muted))] dark:hover:bg-gray-7S00 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`${getConfirmButtonClasses()} hover:cursor-pointer `}
        >
          {isLoading ? "Processing..." : confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;

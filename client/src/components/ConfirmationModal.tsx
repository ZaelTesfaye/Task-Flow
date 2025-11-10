import React from 'react';
import Modal from './Modal';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonColor?: 'red' | 'blue' | 'green';
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmButtonColor = 'red',
  isLoading = false,
}) => {
  const getConfirmButtonClasses = () => {
    const baseClasses = 'flex-1 px-4 py-2 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed';

    switch (confirmButtonColor) {
      case 'red':
        return `${baseClasses} bg-red-600 hover:bg-red-700`;
      case 'blue':
        return `${baseClasses} bg-blue-600 hover:bg-blue-700`;
      case 'green':
        return `${baseClasses} bg-green-600 hover:bg-green-700`;
      default:
        return `${baseClasses} bg-red-600 hover:bg-red-700`;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <h2 className={`text-2xl font-bold mb-4 ${
        confirmButtonColor === 'red' ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
      }`}>
        {title}
      </h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-2 text-gray-700 transition border border-gray-300 rounded-lg dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={getConfirmButtonClasses()}
        >
          {isLoading ? 'Processing...' : confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
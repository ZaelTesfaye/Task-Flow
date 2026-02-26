import React from "react";
import Modal from "./Modal";
import { Check, Loader2 } from "lucide-react";
import { useSubscription } from "@/hooks";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { subscribe, loading } = useSubscription();

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[36rem]">
      <h2 className="mb-8 text-2xl font-bold text-center">Upgrade your Plan</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Starter Plan */}
        <div className="flex flex-col p-6 border rounded-xl dark:border-gray-700">
          <h3 className="mb-2 text-xl font-semibold">Starter</h3>
          <p className="mb-6 text-3xl font-bold">
            $5<span className="text-sm font-normal text-gray-500">/month</span>
          </p>
          <ul className="flex-1 mb-10 space-y-3">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500 shrink-0" /> 10 Projects
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500 shrink-0" /> 10 Members
              per Project
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500 shrink-0" /> Basic
              Support
            </li>
          </ul>
          <button
            onClick={() => subscribe("starter")}
            disabled={loading}
            className="flex items-center justify-center w-full py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Subscribe"
            )}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="flex flex-col p-6 border border-blue-200 rounded-xl bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <h3 className="mb-2 text-xl font-semibold">Pro</h3>
          <p className="mb-6 text-3xl font-bold">
            $10<span className="text-sm font-normal text-gray-500">/month</span>
          </p>
          <ul className="flex-1 mb-10 space-y-3">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500 shrink-0" /> Unlimited
              Projects
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500 shrink-0" /> Unlimited
              Members per Project
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500 shrink-0" /> Priority
              Support
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500 shrink-0" /> Advanced
              Analytics
            </li>
          </ul>
          <button
            onClick={() => subscribe("pro")}
            disabled={loading}
            className="flex items-center justify-center w-full py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Subscribe"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SubscriptionModal;

import React from "react";
import { Modal } from "@/components/ui";
import { Check, Loader2 } from "lucide-react";
import { useSubscription } from "@/hooks";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const { subscribe, loading } = useSubscription();

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[36rem]">
      <h2 className="mb-8 text-center text-2xl font-bold">Upgrade your Plan</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Starter Plan */}
        <div className="flex flex-col rounded-xl border p-6 dark:border-gray-700">
          <h3 className="mb-2 text-xl font-semibold">Starter</h3>
          <p className="mb-6 text-3xl font-bold">
            $5<span className="text-sm font-normal text-gray-500">/month</span>
          </p>
          <ul className="mb-10 flex-1 space-y-3">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-green-500" /> 10 Projects
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-green-500" /> 10 Members per Project
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-green-500" /> Basic Support
            </li>
          </ul>
          <button
            onClick={() => subscribe("starter")}
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-blue-600 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="flex flex-col rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
          <h3 className="mb-2 text-xl font-semibold">Pro</h3>
          <p className="mb-6 text-3xl font-bold">
            $10<span className="text-sm font-normal text-gray-500">/month</span>
          </p>
          <ul className="mb-10 flex-1 space-y-3">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-green-500" /> Unlimited Projects
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-green-500" /> Unlimited Members per Project
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-green-500" /> Priority Support
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-green-500" /> Advanced Analytics
            </li>
          </ul>
          <button
            onClick={() => subscribe("pro")}
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-blue-600 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SubscriptionModal;

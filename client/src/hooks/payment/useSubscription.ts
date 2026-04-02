import { useState } from "react";
import toast from "react-hot-toast";

import { paymentApi } from "@/lib";

export const useSubscription = () => {
  const [loading, setLoading] = useState(false);

  const subscribe = async (plan: string) => {
    try {
      setLoading(true);
      const response = await paymentApi.post<{ url: string }>({ plan }, "subscribe");
      if (response.url) {
        window.location.href = response.url;
      }
    } catch {
      toast.error("Failed to start subscription process");
    } finally {
      setLoading(false);
    }
  };

  return { subscribe, loading };
};

// Domain - Task, Project, User, Subscrition
// Type - Multations, Query, Ui

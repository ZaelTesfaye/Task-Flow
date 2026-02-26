import { useState } from "react";
import toast from "react-hot-toast";

import { stripeAPI } from "@/services";

export const useSubscription = () => {
  const [loading, setLoading] = useState(false);

  const subscribe = async (plan: string) => {
    try {
      setLoading(true);
      const response = await stripeAPI.post<{ url: string }>(
        { plan },
        "subscribe",
      );
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      toast.error("Failed to start subscription process");
    } finally {
      setLoading(false);
    }
  };

  return { subscribe, loading };
};

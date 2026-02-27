import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { paymentApiClient } from "@/lib";

interface CheckoutResponse {
  sessionId: string;
}

interface BillingPortalResponse {
  url: string;
}

export const usePayment = () => {
  const queryClient = useQueryClient();

  const createCheckoutSession = async (data: { priceId: string; projectId?: string }) => {
    const response = await paymentApiClient.post<CheckoutResponse>(data, "checkout");
    if (response?.sessionId) {
      window.location.href = response.sessionId;
    }
    return response;
  };

  const createBillingPortalSession = async () => {
    const response = await paymentApiClient.post<BillingPortalResponse>({}, "billing-portal");
    if (response?.url) {
      window.location.href = response.url;
    }
    return response;
  };

  const updateSubscription = async (data: { priceId: string }) => {
    await paymentApiClient.patch(data, "subscription");
    toast.success("Subscription updated!");
    await queryClient.invalidateQueries({ queryKey: ["user-subscription"] });
  };

  const cancelSubscription = async () => {
    await paymentApiClient.delete("subscription");
    toast.success("Subscription cancelled!");
    await queryClient.invalidateQueries({ queryKey: ["user-subscription"] });
  };

  return {
    createCheckoutSession,
    createBillingPortalSession,
    updateSubscription,
    cancelSubscription,
  };
};

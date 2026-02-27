import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { paymentApiClient } from "@/lib";
import { useAuthContext } from "@/context";
import { useAuthActions } from "./useAuthActions";

export const useSubscriptionVerification = () => {
  const { user } = useAuthContext();
  const { checkSession } = useAuthActions();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const success = searchParams.get("success");

    if (success === "true" && sessionId && user) {
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes with 5 second intervals
      const pollInterval = 5000; // 5 seconds

      const verifySubscription = async () => {
        try {
          const result = await paymentApiClient.get<{
            isPremium: boolean;
            status: string;
            message: string;
            priceId?: string;
            subscriptionId?: string;
          }>("verify-subscription", { params: { sessionId } });

          if (result.isPremium && result.status === "active") {
            await checkSession();
            toast.success("Subscription activated successfully!");
            router.replace("/dashboard");
            return true;
          } else if (attempts >= maxAttempts) {
            toast.error(
              "Subscription verification timed out. Please contact support at support@task-flows.tech if you were charged.",
              { duration: 10000 },
            );
            router.replace("/dashboard");
            return true;
          }
          return false;
        } catch (error) {
          console.error("Subscription verification error:", error);
          if (attempts >= maxAttempts) {
            toast.error(
              "Failed to verify subscription. Please try again after a while. If issues persist, contact support@task-flows.tech",
              { duration: 10000 },
            );
            router.replace("/dashboard");
            return true;
          }
          return false;
        }
      };

      const loadingToast = toast.loading("Verifying your subscription...");

      const interval = setInterval(async () => {
        attempts++;
        const done = await verifySubscription();
        if (done) {
          clearInterval(interval);
          toast.dismiss(loadingToast);
        }
      }, pollInterval);

      // Initial verification
      verifySubscription().then((done) => {
        if (done) {
          clearInterval(interval);
          toast.dismiss(loadingToast);
        }
      });

      return () => {
        clearInterval(interval);
        toast.dismiss(loadingToast);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, user, router]);
};

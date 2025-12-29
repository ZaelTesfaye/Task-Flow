import Stripe from "stripe";
import config from "../config/config.js";
import { APIError } from "../utils/index.js";
import { prisma } from "../lib/index.js";
import httpStatus from "http-status";

const stripe = new Stripe(config.stripe.apiKey);

export const createCheckoutSession = async (
  userId: string,
  email: string,
  plan: string,
) => {
  const userRecord = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userRecord) {
    throw new APIError("User not found", httpStatus.NOT_FOUND);
  }

  let priceId;
  plan = plan.toLowerCase();
  switch (plan) {
    case "starter":
      priceId = config.stripe.starter.priceId;
      break;
    case "pro":
      priceId = config.stripe.pro.priceId;
      break;
    default:
      throw new APIError("Invalid plan selected", httpStatus.BAD_REQUEST);
  }

  const isSubscribed =
    userRecord.stripePriceId &&
    userRecord.stripeCurrentPeriodEnd &&
    userRecord.stripeCurrentPeriodEnd > new Date();

  if (isSubscribed) {
    const currentPriceId = userRecord.stripePriceId!;

    // Define plan ranks
    const planRanks: Record<string, number> = {
      [config.stripe.starter.priceId]: 1,
      [config.stripe.pro.priceId]: 2,
    };

    const currentRank = planRanks[currentPriceId] || 0;
    const newRank = planRanks[priceId] || 0;

    if (newRank < currentRank) {
      throw new APIError(
        "You cannot downgrade your plan here. Please manage your subscription in the billing portal.",
        httpStatus.BAD_REQUEST,
      );
    }

    if (newRank === currentRank) {
      throw new APIError(
        "You are already subscribed to this plan.",
        httpStatus.BAD_REQUEST,
      );
    }

    // Upgrade logic
    if (newRank > currentRank) {
      if (!userRecord.stripeSubscriptionId) {
        throw new APIError(
          "Subscription ID missing for upgrade.",
          httpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const subscription = await stripe.subscriptions.retrieve(
        userRecord.stripeSubscriptionId,
      );

      const subscriptionItem = subscription.items.data?.[0];
      if (!subscriptionItem) {
        throw new APIError(
          "Subscription item not found",
          httpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      const itemId = subscriptionItem.id;

      const updatedSubscription = await stripe.subscriptions.update(
        userRecord.stripeSubscriptionId,
        {
          items: [
            {
              id: itemId,
              price: priceId,
            },
          ],
          proration_behavior: "always_invoice",
        },
      );

      const invoice = await stripe.invoices.retrieve(
        updatedSubscription.latest_invoice as string,
      );

      if (invoice.status === "paid") {
        let currentPeriodEnd = (updatedSubscription as any).current_period_end;

        if (!currentPeriodEnd) {
          currentPeriodEnd = (updatedSubscription as any).items?.data?.[0]
            ?.current_period_end;
        }

        const updateData: any = {
          stripePriceId: priceId,
        };

        if (currentPeriodEnd && typeof currentPeriodEnd === "number") {
          updateData.stripeCurrentPeriodEnd = new Date(currentPeriodEnd * 1000);
        }

        await prisma.user.update({
          where: { id: userId },
          data: updateData,
        });

        return { url: `${config.frontEndUrl}/dashboard?success=true` };
      }

      return { url: invoice.hosted_invoice_url };
    }
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${config.frontEndUrl}/dashboard?success=true`,
    cancel_url: `${config.frontEndUrl}/dashboard`,
    customer_email: email,
    metadata: {
      userId: userId,
      plan,
    },
  });

  return { url: session.url };
};

export const createPortalSession = async (userId: string) => {
  const userRecord = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userRecord?.stripeCustomerId) {
    throw new APIError("No stripe customer found", httpStatus.BAD_REQUEST);
  }

  const frontEndUrl = config.frontEndUrl.split(",")[0];

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: userRecord.stripeCustomerId,
    return_url: `${frontEndUrl}/dashboard`,
  });

  return { url: portalSession.url };
};

export const constructEvent = (
  body: string | Buffer,
  signature: string,
  secret: string,
) => {
  return stripe.webhooks.constructEvent(body, signature, secret);
};

export const handleCheckoutSessionCompleted = async (
  session: Stripe.Checkout.Session,
) => {
  if (!session.subscription) {
    console.error("No subscription in session");
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string,
  );

  if (!session?.metadata?.userId) {
    console.error("No userId in session metadata");
    throw new APIError("User id is required", httpStatus.BAD_REQUEST);
  }

  const priceId = (subscription as any).items?.data?.[0]?.price?.id;
  if (!priceId) {
    console.error("No priceId found in subscription");
    throw new APIError(
      "Subscription price id not found",
      httpStatus.BAD_REQUEST,
    );
  }

  console.log("Subscription object:", JSON.stringify(subscription, null, 2));

  let currentPeriodEnd = (subscription as any).current_period_end;
  if (!currentPeriodEnd) {
    currentPeriodEnd = (subscription as any).items?.data?.[0]
      ?.current_period_end;
  }
  const updateData: any = {
    stripeSubscriptionId: subscription.id,
    stripeCustomerId: subscription.customer as string,
    stripePriceId: priceId,
  };
  if (currentPeriodEnd && typeof currentPeriodEnd === "number") {
    updateData.stripeCurrentPeriodEnd = new Date(currentPeriodEnd * 1000);
  }

  console.log(
    `Updating user ${session.metadata.userId} with subscription data`,
  );
  await prisma.user.update({
    where: {
      id: session.metadata.userId,
    },
    data: updateData,
  });
  console.log("User updated successfully");
};

export const handleInvoicePaid = async (invoice: Stripe.Invoice) => {
  if (!(invoice as any).subscription) {
    console.error("No subscription in invoice");
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(
    (invoice as any).subscription as string,
  );

  const priceId = (subscription as any).items?.data?.[0]?.price?.id;
  if (!priceId) {
    console.error("No priceId found in subscription for invoice");
    throw new APIError(
      "Subscription price id not found",
      httpStatus.BAD_REQUEST,
    );
  }

  console.log(
    "Subscription object (invoice):",
    JSON.stringify(subscription, null, 2),
  );

  let currentPeriodEnd = (subscription as any).current_period_end;
  if (!currentPeriodEnd) {
    currentPeriodEnd = (subscription as any).items?.data?.[0]
      ?.current_period_end;
  }
  const updateData: any = {
    stripePriceId: priceId,
  };
  if (currentPeriodEnd && typeof currentPeriodEnd === "number") {
    updateData.stripeCurrentPeriodEnd = new Date(currentPeriodEnd * 1000);
  }

  console.log(`Updating subscription ${subscription.id} with payment data`);
  await prisma.user.update({
    where: {
      stripeSubscriptionId: subscription.id,
    },
    data: updateData,
  });
  console.log("Subscription updated successfully");
};

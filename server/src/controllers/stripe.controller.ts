import Stripe from "stripe";
import config from "../config/config.js";
import { APIError } from "../utils/index.js";
import { asyncWrapper } from "../lib/index.js";
import httpStatus from "http-status";
import type { Request, Response } from "express";
import { stripeServices } from "../services/index.js";

export const createCheckoutSession = asyncWrapper(
  async (req: Request, res: Response) => {
    console.log("Creating checkout session");
    const { plan } = req.body;
    const user = req.user;

    if (!user) {
      throw new APIError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const result = await stripeServices.createCheckoutSession(
      user.id,
      user.email,
      plan,
    );

    res.status(httpStatus.OK).json(result);
  },
);

export const webhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];

  let event: Stripe.Event;

  try {
    event = stripeServices.constructEvent(
      req.body,
      sig as string,
      config.stripe.webhookSecret,
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    throw new APIError(`Webhook Error: ${err.message}`, httpStatus.BAD_REQUEST);
  }

  console.log(`Received webhook event: ${event.type}`);

  switch (event.type) {
    case "checkout.session.completed": {
      console.log("Processing checkout.session.completed");
      const session = event.data.object as Stripe.Checkout.Session;
      await stripeServices.handleCheckoutSessionCompleted(session);
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      await stripeServices.handleInvoicePaid(invoice);
      break;
    }

    default: {
      console.log(`Unhandled event type: ${event.type}`);
      break;
    }
  }

  res.status(httpStatus.OK).send();
};

export const createPortalSession = asyncWrapper(
  async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new APIError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const result = await stripeServices.createPortalSession(user.id);

    res.status(httpStatus.OK).json(result);
  },
);

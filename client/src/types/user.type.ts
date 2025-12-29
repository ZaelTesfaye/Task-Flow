export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  stripePriceId?: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  stripeCurrentPeriodEnd?: string;
}

export type UserRole = "owner" | "admin" | "member";

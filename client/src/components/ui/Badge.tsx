import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        blue: "bg-blue-200 text-blue-900 border border-blue-300 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30",
        green:
          "bg-green-200 text-green-900 border border-green-300 dark:bg-green-500/15 dark:text-green-400 dark:border-green-500/30",
        yellow:
          "bg-yellow-200 text-yellow-900 border border-yellow-300 dark:bg-yellow-500/15 dark:text-yellow-400 dark:border-yellow-500/30",
        purple:
          "bg-purple-200 text-purple-900 border border-purple-300 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/30",
        red: "bg-red-200 text-red-900 border border-red-300 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30",
        gray: "bg-muted text-muted-foreground border border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

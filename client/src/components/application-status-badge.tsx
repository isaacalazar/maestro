import type React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        applied: "bg-blue-500/10 text-blue-400",
        screening: "bg-purple-500/10 text-purple-400",
        interview: "bg-amber-500/10 text-amber-400",
        assessment: "bg-cyan-500/10 text-cyan-400",
        offer: "bg-green-500/10 text-green-400",
        rejected: "bg-red-500/10 text-red-400",
        withdrawn: "bg-zinc-500/10 text-zinc-400",
      },
    },
    defaultVariants: {
      variant: "applied",
    },
  }
);

export interface ApplicationStatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  status: string;
}

export function ApplicationStatusBadge({
  status,
  variant,
  className,
  ...props
}: ApplicationStatusBadgeProps) {
  const getVariant = () => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("applied")) return "applied";
    if (statusLower.includes("screen")) return "screening";
    if (statusLower.includes("interview")) return "interview";
    if (statusLower.includes("assessment") || statusLower.includes("test"))
      return "assessment";
    if (statusLower.includes("offer")) return "offer";
    if (statusLower.includes("reject")) return "rejected";
    if (statusLower.includes("withdraw")) return "withdrawn";
    return "applied";
  };

  return (
    <div
      className={cn(
        badgeVariants({ variant: variant || getVariant() }),
        className
      )}
      {...props}
    >
      {status}
    </div>
  );
}

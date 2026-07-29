import * as React from "react";
import { cn, statusStyle } from "@/lib/utils";

export function Badge({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[12.5px] font-medium leading-none",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge className={cn(statusStyle(status), className)}>
      {status}
    </Badge>
  );
}

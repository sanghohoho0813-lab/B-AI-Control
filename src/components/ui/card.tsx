import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[10px] border border-ink-200/70 bg-white shadow-card",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  title,
  desc,
  action,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  title?: React.ReactNode;
  desc?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-ink-200/60 px-4 py-3",
        className,
      )}
      {...props}
    >
      <div className="min-w-0">
        {title ? (
          <h3 className="truncate text-[19px] font-semibold text-ink-800">{title}</h3>
        ) : null}
        {desc ? <p className="mt-0.5 truncate text-[15.5px] text-ink-400">{desc}</p> : null}
      </div>
      {action ? <div className="max-w-full shrink-0">{action}</div> : null}
    </div>
  );
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)} {...props} />;
}

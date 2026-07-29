import * as React from "react";
import { cn } from "@/lib/utils";

export function Bar({
  value,
  className,
  barClassName,
  color,
}: {
  value: number;
  className?: string;
  barClassName?: string;
  color?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-ink-100", className)}>
      <div
        className={cn("h-full rounded-full transition-[width] duration-500", barClassName)}
        style={{ width: `${v}%`, backgroundColor: color }}
      />
    </div>
  );
}

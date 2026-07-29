"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-ink-800 text-white hover:bg-ink-700",
        outline: "border border-ink-200 bg-white text-ink-700 hover:bg-ink-50",
        ghost: "text-ink-600 hover:bg-ink-100 hover:text-ink-800",
        soft: "bg-ink-100 text-ink-700 hover:bg-ink-200",
        tailor: "bg-tailor-600 text-white hover:bg-tailor-700",
        corp: "bg-corp-600 text-white hover:bg-corp-700",
        link: "text-ink-600 underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-7 px-2.5 text-[12px]",
        default: "h-8 px-3",
        lg: "h-10 px-4 text-sm",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

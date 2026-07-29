"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    title: string;
    desc?: string;
    side?: "right" | "left";
  }
>(({ className, children, title, desc, side = "right", ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="overlay-anim fixed inset-0 z-50 bg-ink-900/40" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-y-0 z-50 flex w-[380px] max-w-[92vw] flex-col border-ink-200 bg-white shadow-panel",
        side === "right" ? "right-0 border-l" : "left-0 border-r",
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3 border-b border-ink-200/70 px-4 py-3.5">
        <div>
          <DialogPrimitive.Title className="text-[16px] font-semibold text-ink-800">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-0.5 text-[13px] text-ink-400">
            {desc ?? ""}
          </DialogPrimitive.Description>
        </div>
        <DialogPrimitive.Close className="rounded p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700">
          <X className="h-4 w-4" />
          <span className="sr-only">닫기</span>
        </DialogPrimitive.Close>
      </div>
      <div className="thin-scroll flex-1 overflow-y-auto">{children}</div>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
SheetContent.displayName = "SheetContent";

export { Sheet, SheetTrigger, SheetContent, SheetClose };

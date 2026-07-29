"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { title: string; desc?: string }
>(({ className, children, title, desc, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="overlay-anim fixed inset-0 z-50 bg-ink-900/40 backdrop-blur-[1px]" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "panel-anim fixed left-1/2 top-1/2 z-50 max-h-[88vh] w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[12px] border border-ink-200 bg-white shadow-panel",
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-4 border-b border-ink-200/70 px-5 py-4">
        <div className="min-w-0">
          <DialogPrimitive.Title className="truncate text-[17px] font-semibold text-ink-800">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-0.5 text-[13.5px] text-ink-400">
            {desc ?? ""}
          </DialogPrimitive.Description>
        </div>
        <DialogPrimitive.Close className="rounded p-1 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700">
          <X className="h-4 w-4" />
          <span className="sr-only">닫기</span>
        </DialogPrimitive.Close>
      </div>
      <div className="thin-scroll max-h-[calc(88vh-64px)] overflow-y-auto">{children}</div>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = "DialogContent";

export { Dialog, DialogTrigger, DialogContent, DialogClose };

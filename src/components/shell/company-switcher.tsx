"use client";

import { useApp } from "@/components/app-store";
import { COMPANIES } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Scope } from "@/lib/types";

const OPTIONS: { value: Scope; label: string; mark: string }[] = [
  { value: "all", label: "통합", mark: "ALL" },
  { value: "tailor", label: COMPANIES.tailor.name, mark: COMPANIES.tailor.mark },
  { value: "corp", label: COMPANIES.corp.name, mark: COMPANIES.corp.mark },
];

export function CompanySwitcher({ compact = false }: { compact?: boolean }) {
  const { scope, setScope } = useApp();

  return (
    <div className="flex items-center gap-2">
      {!compact ? (
        <span className="mr-0.5 text-[12px] font-medium text-ink-400">Company</span>
      ) : null}
      <div className="flex items-center gap-1 rounded-md border border-ink-200 bg-white p-0.5">
        {OPTIONS.map((opt) => {
          const active = scope === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setScope(opt.value)}
              className={cn(
                "flex items-center gap-1.5 rounded px-2.5 py-1.5 text-[12.5px] font-medium transition-colors",
                active
                  ? opt.value === "tailor"
                    ? "bg-tailor-600 text-white"
                    : opt.value === "corp"
                      ? "bg-corp-700 text-white"
                      : "bg-ink-800 text-white"
                  : "text-ink-500 hover:bg-ink-50 hover:text-ink-700",
              )}
            >
              <span
                className={cn(
                  "flex h-[17px] min-w-[17px] items-center justify-center rounded-[3px] px-1 text-[8.5px] font-bold",
                  active
                    ? "bg-white/20 text-white"
                    : opt.value === "tailor"
                      ? "bg-tailor-50 text-tailor-700"
                      : opt.value === "corp"
                        ? "bg-corp-50 text-corp-700"
                        : "bg-ink-100 text-ink-500",
                )}
              >
                {opt.mark}
              </span>
              <span className={compact ? "hidden sm:inline" : ""}>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

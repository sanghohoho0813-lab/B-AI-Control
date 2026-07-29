"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/components/app-store";
import { Icon } from "@/components/icon";
import { NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { scope, setScope } = useApp();

  return (
    <div className="flex h-full flex-col">
      {/* 로고 */}
      <div className="border-b border-white/8 px-5 py-4">
        <Link href="/dashboard" onClick={onNavigate} className="block">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[21px] font-semibold tracking-tight text-white">B&amp;AI</span>
            <span className="text-[21px] font-light tracking-[0.16em] text-white/70">CONTROL</span>
          </div>
          <p className="mt-1 text-[11.5px] leading-snug tracking-wide text-white/40">
            비앤테일러샵 · AI 소프트웨어 법인 통합 경영 OS
          </p>
        </Link>
      </div>

      {/* 회사 요약 표시 */}
      <div className="grid grid-cols-2 gap-1.5 px-3 py-2.5">
        <button
          onClick={() => setScope(scope === "tailor" ? "all" : "tailor")}
          className={cn(
            "rounded-md border px-2 py-2 text-left transition-colors",
            scope === "tailor"
              ? "border-tailor-400/60 bg-tailor-600/25"
              : "border-white/8 bg-white/[0.03] hover:bg-white/[0.07]",
          )}
        >
          <span className="block text-[11.5px] font-medium tracking-tight text-white/70">
            비앤테일러샵
          </span>
          <span className="mt-1 flex items-center gap-1">
            <span className="flex h-[13px] w-[13px] shrink-0 items-center justify-center rounded-[2px] bg-tailor-500 text-[7px] font-bold text-white">
              B&amp;
            </span>
            <span className="text-[12.5px] font-semibold text-white/95 num">1억 2,845만</span>
          </span>
        </button>
        <button
          onClick={() => setScope(scope === "corp" ? "all" : "corp")}
          className={cn(
            "rounded-md border px-2 py-2 text-left transition-colors",
            scope === "corp"
              ? "border-corp-300/60 bg-corp-500/30"
              : "border-white/8 bg-white/[0.03] hover:bg-white/[0.07]",
          )}
        >
          <span className="block text-[11.5px] font-medium tracking-tight text-white/70">
            AI 법인
          </span>
          <span className="mt-1 flex items-center gap-1">
            <span className="flex h-[13px] w-[13px] shrink-0 items-center justify-center rounded-[2px] bg-corp-400 text-[7px] font-bold text-white">
              AI
            </span>
            <span className="text-[12.5px] font-semibold text-white/95 num">8,732만</span>
          </span>
        </button>
      </div>

      {/* 메뉴 */}
      <nav className="thin-scroll flex-1 overflow-y-auto px-3 pb-4">
        {NAV.map((group) => (
          <div key={group.title ?? "common"} className="mb-1">
            {group.title ? (
              <div className="mb-1 mt-2.5 flex items-center gap-1.5 px-2">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-[2px]",
                    group.tone === "tailor"
                      ? "bg-tailor-400"
                      : group.tone === "corp"
                        ? "bg-corp-300"
                        : "bg-white/25",
                  )}
                />
                <span className="text-[12px] font-medium tracking-wide text-white/40">
                  {group.title}
                </span>
              </div>
            ) : null}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    item.href !== "/tailor" &&
                    item.href !== "/ai" &&
                    pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[14px] transition-colors",
                        active
                          ? group.tone === "tailor"
                            ? "bg-tailor-600/30 text-white"
                            : group.tone === "corp"
                              ? "bg-corp-500/35 text-white"
                              : "bg-white/10 text-white"
                          : "text-white/55 hover:bg-white/[0.06] hover:text-white/90",
                      )}
                    >
                      <Icon
                        name={item.icon}
                        className={cn(
                          "h-[15px] w-[15px] shrink-0",
                          active ? "opacity-100" : "opacity-70",
                        )}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge ? (
                        <span
                          className={cn(
                            "rounded px-1 py-px text-[11.5px] font-semibold",
                            group.tone === "tailor"
                              ? "bg-tailor-500 text-white"
                              : "bg-white/15 text-white/80",
                          )}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                      {active ? (
                        <span
                          className={cn(
                            "h-3.5 w-[2px] rounded-full",
                            group.tone === "tailor"
                              ? "bg-tailor-300"
                              : group.tone === "corp"
                                ? "bg-corp-200"
                                : "bg-white/60",
                          )}
                        />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

    </div>
  );
}

export function Sidebar() {
  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 hidden w-[248px] lg:block"
      style={{ background: "var(--sidebar)" }}
    >
      <SidebarContent />
    </aside>
  );
}

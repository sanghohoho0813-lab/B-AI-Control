"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Banknote, CalendarDays, CheckSquare, Home, LayoutGrid } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContent } from "@/components/shell/sidebar";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "홈", href: "/mobile", icon: Home },
  { label: "업무", href: "/tasks", icon: CheckSquare },
  { label: "일정", href: "/schedule", icon: CalendarDays },
  { label: "자금", href: "/finance", icon: Banknote },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-200 bg-white/97 backdrop-blur lg:hidden">
      <ul className="mx-auto flex max-w-md items-stretch">
        {TABS.map((t) => {
          const active = pathname === t.href;
          const I = t.icon;
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10.5px] transition-colors",
                  active ? "text-tailor-700" : "text-ink-400",
                )}
              >
                <I className={cn("h-[18px] w-[18px]", active && "text-tailor-600")} />
                {t.label}
              </Link>
            </li>
          );
        })}
        <li className="flex-1">
          <Sheet>
            <SheetTrigger className="flex w-full flex-col items-center gap-1 py-2.5 text-[10.5px] text-ink-400">
              <LayoutGrid className="h-[18px] w-[18px]" />
              메뉴
            </SheetTrigger>
            <SheetContent
              title="전체 메뉴"
              desc="B&AI Control"
              side="left"
              className="w-[268px] border-0 p-0"
              style={{ background: "var(--sidebar)" }}
            >
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </li>
      </ul>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}

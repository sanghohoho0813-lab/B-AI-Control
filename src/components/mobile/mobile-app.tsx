"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Banknote,
  Bell,
  CalendarDays,
  ChevronLeft,
  CircleCheck,
  Home,
  LayoutGrid,
} from "lucide-react";
import { useApp } from "@/components/app-store";
import { MobileNavProvider } from "@/components/mobile/nav-context";
import { MobileHome } from "@/components/mobile/screens/home";
import {
  MobileFinance,
  MobileMore,
  MobileSchedule,
  MobileTasks,
} from "@/components/mobile/screens/tabs";
import { MobileFabricsRich, MobileProducts } from "@/components/mobile/screens/products";
import {
  MobileAiHome,
  MobileAlerts,
  MobileApprovals,
  MobileBiz,
  MobileCompanies,
  MobileCompanySales,
  MobileCustomers,
  MobileOrders,
  MobilePeople,
  MobileProduction,
  MobileProjects,
  MobileReports,
  MobileRevenue,
  MobileRnd,
  MobileTailorAnalytics,
  MobileTailorHome,
  MobileTech,
} from "@/components/mobile/screens/detail";
import { cn } from "@/lib/utils";
import type { Scope } from "@/lib/types";

/* ── 화면 정의 ──────────────────────────────── */

interface ScreenDef {
  title: string;
  /** 탭 화면은 회사 전환 탭을 노출하고, 상세 화면은 뒤로가기를 노출한다 */
  tab?: boolean;
  render: () => React.ReactNode;
}

const SCREENS: Record<string, ScreenDef> = {
  "/dashboard": { title: "오늘 브리핑", tab: true, render: () => <MobileHome /> },
  "/tasks": { title: "업무", tab: true, render: () => <MobileTasks /> },
  "/schedule": { title: "일정", tab: true, render: () => <MobileSchedule /> },
  "/finance": { title: "자금", tab: true, render: () => <MobileFinance /> },
  "/more": { title: "더보기", tab: true, render: () => <MobileMore /> },

  "/approvals": { title: "승인 업무", render: () => <MobileApprovals /> },
  "/revenue": { title: "회사별 매출", render: () => <MobileRevenue /> },
  "/notifications": { title: "알림", render: () => <MobileAlerts /> },
  "/companies": { title: "회사 전환", render: () => <MobileCompanies /> },
  "/reports": { title: "보고서", render: () => <MobileReports /> },

  "/tailor": { title: "비앤테일러샵", render: () => <MobileTailorHome /> },
  "/tailor/orders": { title: "주문", render: () => <MobileOrders /> },
  "/tailor/products": { title: "상품 라인업", render: () => <MobileProducts /> },
  "/tailor/fabrics": { title: "원단 재고", render: () => <MobileFabricsRich /> },
  "/tailor/production": { title: "제작·납기", render: () => <MobileProduction /> },
  "/tailor/customers": { title: "고객", render: () => <MobileCustomers /> },
  "/tailor/sales": { title: "비앤테일러샵 매출", render: () => <MobileCompanySales company="tailor" /> },
  "/tailor/analytics": { title: "고객 분석", render: () => <MobileTailorAnalytics /> },

  "/ai": { title: "AI 소프트웨어 법인", render: () => <MobileAiHome /> },
  "/ai/projects": { title: "프로젝트", render: () => <MobileProjects /> },
  "/ai/rnd": { title: "R&D 과제", render: () => <MobileRnd /> },
  "/ai/people": { title: "인력", render: () => <MobilePeople /> },
  "/ai/tech": { title: "기술·데이터", render: () => <MobileTech /> },
  "/ai/biz": { title: "사업화·계약", render: () => <MobileBiz /> },
  "/ai/sales": { title: "AI 법인 매출", render: () => <MobileCompanySales company="corp" /> },
};

const TABS = [
  { label: "홈", href: "/dashboard", icon: Home },
  { label: "업무", href: "/tasks", icon: CircleCheck },
  { label: "일정", href: "/schedule", icon: CalendarDays },
  { label: "자금", href: "/finance", icon: Banknote },
  { label: "더보기", href: "/more", icon: LayoutGrid },
];

const SCOPE_TABS: { value: Scope; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "tailor", label: "비앤테일러샵" },
  { value: "corp", label: "AI 법인" },
];

/* ── 셸 ─────────────────────────────────────── */

export function MobileApp({ embedded = false }: { embedded?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { scope, setScope, unread } = useApp();

  const [innerPath, setInnerPath] = React.useState("/dashboard");
  const [history, setHistory] = React.useState<string[]>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const path = embedded ? innerPath : pathname;
  const screen = SCREENS[path] ?? SCREENS["/dashboard"];
  const accent = scope === "corp" ? "corp" : "tailor";

  const go = React.useCallback(
    (href: string) => {
      if (href === path) return;
      setHistory((h) => [...h, path]);
      if (embedded) setInnerPath(href);
      else router.push(href);
    },
    [embedded, path, router],
  );

  const back = React.useCallback(() => {
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    if (embedded) setInnerPath(prev ?? "/dashboard");
    else if (prev) router.push(prev);
    else router.push("/dashboard");
  }, [embedded, history, router]);

  // 화면이 바뀌면 스크롤을 위로 되돌린다
  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [path]);

  return (
    <MobileNavProvider value={{ path, go, back, embedded }}>
      <div className={cn("flex flex-col bg-ivory-100", embedded ? "h-full" : "h-[100dvh]")}>
        {/* 헤더 : 최대 56px */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-ink-200/70 bg-white px-4">
          {screen.tab ? (
            <button
              onClick={() => go("/dashboard")}
              className="flex items-baseline gap-1 py-2 text-left"
            >
              <span className="text-[20.5px] font-semibold tracking-tight text-ink-900">B&amp;AI</span>
              <span className="text-[20.5px] font-light tracking-[0.14em] text-ink-400">CONTROL</span>
            </button>
          ) : (
            <>
              <button
                onClick={back}
                aria-label="뒤로"
                className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-ink-600 active:bg-ink-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h1 className="min-w-0 flex-1 truncate text-[21.5px] font-semibold tracking-tight text-ink-900">
                {screen.title}
              </h1>
            </>
          )}

          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => go("/notifications")}
              aria-label="알림"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink-600 active:bg-ink-100"
            >
              <Bell className="h-[19px] w-[19px]" />
              {unread > 0 ? (
                <span className="absolute right-1.5 top-1.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-rose-500 px-1 text-[12.5px] font-semibold text-white">
                  {unread}
                </span>
              ) : null}
            </button>
            <button
              onClick={() => go("/more")}
              aria-label="대표자 프로필"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-800 text-[16px] font-semibold text-white active:opacity-80"
            >
              박
            </button>
          </div>
        </header>

        {/* 회사 전환 탭 : 탭 화면에서만 노출 (중복 방지) */}
        {screen.tab ? (
          <div className="shrink-0 border-b border-ink-200/70 bg-white px-4 pb-2.5">
            <div className="flex gap-1.5">
              {SCOPE_TABS.map((t) => {
                const active = scope === t.value;
                return (
                  <button
                    key={String(t.value)}
                    onClick={() => setScope(t.value)}
                    className={cn(
                      "flex-1 whitespace-nowrap rounded-[9px] border px-1 py-2 text-[17px] font-medium transition-colors",
                      active
                        ? t.value === "tailor"
                          ? "border-tailor-600 bg-tailor-600 text-white"
                          : t.value === "corp"
                            ? "border-corp-700 bg-corp-700 text-white"
                            : "border-ink-800 bg-ink-800 text-white"
                        : "border-ink-200 bg-white text-ink-500",
                    )}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* 본문 */}
        <div
          ref={scrollRef}
          className="thin-scroll flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-4 pt-4"
        >
          <div key={path} className="animate-fade-in">
            {screen.render()}
          </div>
          <div className="h-[84px]" />
        </div>

        {/* 하단 고정 내비게이션 */}
        <nav className="shrink-0 border-t border-ink-200 bg-white/98 backdrop-blur">
          <ul className="flex">
            {TABS.map((t) => {
              const active = path === t.href;
              const I = t.icon;
              return (
                <li key={t.href} className="flex-1">
                  <button
                    onClick={() => go(t.href)}
                    className="flex w-full flex-col items-center gap-1 py-2 active:bg-ivory-100"
                  >
                    <I
                      className={cn(
                        "h-[21px] w-[21px]",
                        active
                          ? accent === "corp"
                            ? "text-corp-700"
                            : "text-tailor-600"
                          : "text-ink-400",
                      )}
                      strokeWidth={active ? 2.2 : 1.8}
                    />
                    <span
                      className={cn(
                        "text-[14.5px] leading-none",
                        active
                          ? cn(
                              "font-semibold",
                              accent === "corp" ? "text-corp-700" : "text-tailor-700",
                            )
                          : "text-ink-400",
                      )}
                    >
                      {t.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div style={{ height: "env(safe-area-inset-bottom)" }} />
        </nav>
      </div>
    </MobileNavProvider>
  );
}

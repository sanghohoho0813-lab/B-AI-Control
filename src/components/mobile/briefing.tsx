"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Banknote,
  Bell,
  CalendarDays,
  CheckSquare,
  ChevronRight,
  Home,
  LayoutGrid,
  Menu,
} from "lucide-react";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Bar } from "@/components/ui/progress";
import {
  AI_PROJECTS,
  BUDGET_LINES,
  COMPANIES,
  SCHEDULES,
  SUMMARY,
  TODAY,
  URGENT_TASKS,
} from "@/lib/data";
import { cn, num, pct, won, wonShort } from "@/lib/utils";
import type { Scope } from "@/lib/types";

const SCOPES: { value: Scope; label: string; mark: string }[] = [
  { value: "all", label: "통합", mark: "ALL" },
  { value: "tailor", label: "비앤테일러샵", mark: "B&" },
  { value: "corp", label: "AI 법인", mark: "AI" },
];

const TODAY_D = TODAY.replace(/-/g, ".");

function ScopeTabs({ value, onChange }: { value: Scope; onChange: (s: Scope) => void }) {
  return (
    <div className="flex gap-1.5">
      {SCOPES.map((s) => {
        const active = value === s.value;
        return (
          <button
            key={s.value}
            onClick={() => onChange(s.value)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-md border px-1.5 py-2 text-[11.5px] font-medium transition-colors",
              active
                ? s.value === "tailor"
                  ? "border-tailor-600 bg-tailor-600 text-white"
                  : s.value === "corp"
                    ? "border-corp-700 bg-corp-700 text-white"
                    : "border-ink-800 bg-ink-800 text-white"
                : "border-ink-200 bg-white text-ink-500",
            )}
          >
            <span
              className={cn(
                "flex h-[15px] min-w-[15px] items-center justify-center rounded-[3px] px-0.5 text-[8px] font-bold",
                active ? "bg-white/20 text-white" : "bg-ink-100 text-ink-500",
              )}
            >
              {s.mark}
            </span>
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

function SummaryCards({ scope }: { scope: Scope }) {
  const showTailor = scope === "all" || scope === "tailor";
  const showCorp = scope === "all" || scope === "corp";

  return (
    <div className="space-y-2.5">
      {showTailor ? (
        <div className="stripe-tailor overflow-hidden rounded-[10px] border border-ink-200/70 bg-white shadow-card">
          <div className="flex items-center gap-1.5 border-b border-ink-100 px-3.5 py-2.5">
            <span className="flex h-[17px] w-[17px] items-center justify-center rounded-[3px] bg-tailor-600 text-[8.5px] font-bold text-white">
              B&amp;
            </span>
            <span className="text-[12.5px] font-semibold text-tailor-700">비앤테일러샵</span>
            <Link href="/tailor" className="ml-auto text-[11px] text-ink-400">
              상세 <ChevronRight className="inline h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-3 divide-x divide-ink-100">
            <div className="px-3 py-3">
              <p className="text-[10.5px] text-ink-400">오늘 매출</p>
              <p className="mt-1 text-[15px] font-semibold text-ink-900 num">
                ₩{(SUMMARY.tailor.todayRevenue / 10000).toLocaleString("ko-KR")}만
              </p>
            </div>
            <div className="px-3 py-3">
              <p className="text-[10.5px] text-ink-400">납품 예정</p>
              <p className="mt-1 text-[15px] font-semibold text-ink-900 num">
                {SUMMARY.tailor.delivery}
                <span className="ml-0.5 text-[10.5px] font-normal text-ink-400">건</span>
              </p>
            </div>
            <div className="px-3 py-3">
              <p className="text-[10.5px] text-ink-400">이번 달 매출</p>
              <p className="mt-1 text-[15px] font-semibold text-ink-900 num">
                {wonShort(SUMMARY.tailor.revenue)}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {showCorp ? (
        <div className="stripe-corp overflow-hidden rounded-[10px] border border-ink-200/70 bg-white shadow-card">
          <div className="flex items-center gap-1.5 border-b border-ink-100 px-3.5 py-2.5">
            <span className="flex h-[17px] w-[17px] items-center justify-center rounded-[3px] bg-corp-700 text-[8.5px] font-bold text-white">
              AI
            </span>
            <span className="text-[12.5px] font-semibold text-corp-700">AI 소프트웨어 법인</span>
            <Link href="/ai" className="ml-auto text-[11px] text-ink-400">
              상세 <ChevronRight className="inline h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-3 divide-x divide-ink-100">
            <div className="px-3 py-3">
              <p className="text-[10.5px] text-ink-400">진행 프로젝트</p>
              <p className="mt-1 text-[15px] font-semibold text-ink-900 num">
                {SUMMARY.corp.projects}
                <span className="ml-0.5 text-[10.5px] font-normal text-ink-400">개</span>
              </p>
            </div>
            <div className="px-3 py-3">
              <p className="text-[10.5px] text-ink-400">신규 계약</p>
              <p className="mt-1 text-[15px] font-semibold text-ink-900 num">
                {SUMMARY.corp.newContract}
                <span className="ml-0.5 text-[10.5px] font-normal text-ink-400">건</span>
              </p>
            </div>
            <div className="px-3 py-3">
              <p className="text-[10.5px] text-ink-400">이번 달 매출</p>
              <p className="mt-1 text-[15px] font-semibold text-ink-900 num">
                {wonShort(SUMMARY.corp.revenue)}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <Link
        href="/finance"
        className="flex items-center justify-between rounded-[10px] border border-ink-200/70 bg-ink-800 px-3.5 py-3 text-white shadow-card"
      >
        <div>
          <p className="text-[10.5px] text-white/55">
            {scope === "tailor" ? "비앤테일러샵 가용자금" : scope === "corp" ? "AI 법인 가용자금" : "통합 가용자금"}
          </p>
          <p className="mt-1 text-[19px] font-semibold num">
            {won(
              scope === "tailor"
                ? SUMMARY.cash.tailorAvailable
                : scope === "corp"
                  ? SUMMARY.cash.corpAvailable
                  : SUMMARY.cash.available,
            )}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10.5px] text-white/55">이번 달 예상 지출</p>
          <p className="mt-1 text-[12.5px] font-medium text-white/90 num">
            {wonShort(SUMMARY.cash.plannedSpend)}
          </p>
        </div>
      </Link>
    </div>
  );
}

function UrgentList({ scope }: { scope: Scope }) {
  const items = URGENT_TASKS.filter((t) => scope === "all" || t.company === scope);
  return (
    <div className="overflow-hidden rounded-[10px] border border-ink-200/70 bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-ink-100 px-3.5 py-2.5">
        <span className="text-[12.5px] font-semibold text-ink-800">긴급 확인 업무</span>
        <Link href="/tasks" className="text-[11px] text-ink-400">
          전체 보기 <ChevronRight className="inline h-3 w-3" />
        </Link>
      </div>
      <ul>
        {items.map((t) => (
          <li key={t.id}>
            <Link
              href={t.href}
              className="flex items-center gap-2.5 border-b border-ink-100 px-3.5 py-2.5 last:border-b-0"
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                  t.company === "tailor"
                    ? "bg-tailor-50 text-tailor-600"
                    : "bg-corp-50 text-corp-600",
                )}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] font-medium text-ink-800">
                  {t.title}
                </span>
                <span className="block truncate text-[10.5px] text-ink-400">{t.detail}</span>
              </span>
              <span
                className={cn(
                  "flex h-[22px] min-w-[22px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold text-white",
                  t.level === "긴급" ? "bg-rose-500" : "bg-amber-500",
                )}
              >
                {t.count}
              </span>
            </Link>
          </li>
        ))}
        {items.length === 0 ? (
          <li className="px-3.5 py-6 text-center text-[12px] text-ink-400">
            확인이 필요한 업무가 없습니다.
          </li>
        ) : null}
      </ul>
    </div>
  );
}

function TodaySchedule({ scope }: { scope: Scope }) {
  const items = SCHEDULES.filter(
    (s) => s.date === TODAY_D && (scope === "all" || s.company === scope),
  );
  return (
    <div className="overflow-hidden rounded-[10px] border border-ink-200/70 bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-ink-100 px-3.5 py-2.5">
        <span className="text-[12.5px] font-semibold text-ink-800">오늘 일정</span>
        <Link href="/schedule" className="text-[11px] text-ink-400">
          전체 보기 <ChevronRight className="inline h-3 w-3" />
        </Link>
      </div>
      <ul>
        {items.map((s) => (
          <li
            key={s.id}
            className="flex items-center gap-3 border-b border-ink-100 px-3.5 py-2.5 last:border-b-0"
          >
            <span className="w-10 shrink-0 text-[12px] font-medium text-ink-700 num">{s.time}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12.5px] text-ink-800">{s.title}</span>
              <span className="block truncate text-[10.5px] text-ink-400">
                {COMPANIES[s.company].shortName} · {s.owner}
              </span>
            </span>
            <Badge
              className={
                s.company === "tailor"
                  ? "border-tailor-200 bg-tailor-50 text-tailor-700"
                  : "border-corp-200 bg-corp-50 text-corp-700"
              }
            >
              {s.kind}
            </Badge>
          </li>
        ))}
        {items.length === 0 ? (
          <li className="px-3.5 py-6 text-center text-[12px] text-ink-400">오늘 일정이 없습니다.</li>
        ) : null}
      </ul>
    </div>
  );
}

function TasksTab({ scope }: { scope: Scope }) {
  const projects = AI_PROJECTS.filter((p) => p.status !== "정상").slice(0, 3);
  return (
    <div className="space-y-2.5">
      <UrgentList scope={scope} />
      {scope !== "tailor" ? (
        <div className="overflow-hidden rounded-[10px] border border-ink-200/70 bg-white shadow-card">
          <div className="border-b border-ink-100 px-3.5 py-2.5 text-[12.5px] font-semibold text-ink-800">
            점검이 필요한 프로젝트
          </div>
          <ul>
            {projects.map((p) => (
              <li key={p.id} className="border-b border-ink-100 px-3.5 py-2.5 last:border-b-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[12.5px] text-ink-800">{p.name}</span>
                  <StatusBadge status={p.status} />
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <Bar value={p.progress} color="#234084" />
                  <span className="shrink-0 text-[11px] text-ink-500 num">{p.progress}%</span>
                </div>
                {p.issue ? (
                  <p className="mt-1 text-[10.5px] text-ink-400">{p.issue}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function ScheduleTab({ scope }: { scope: Scope }) {
  const days = Array.from(new Set(SCHEDULES.map((s) => s.date))).slice(0, 4);
  return (
    <div className="space-y-2.5">
      {days.map((d) => {
        const items = SCHEDULES.filter(
          (s) => s.date === d && (scope === "all" || s.company === scope),
        );
        if (items.length === 0) return null;
        return (
          <div
            key={d}
            className="overflow-hidden rounded-[10px] border border-ink-200/70 bg-white shadow-card"
          >
            <div className="flex items-center justify-between border-b border-ink-100 px-3.5 py-2">
              <span className="text-[12px] font-semibold text-ink-700 num">{d}</span>
              {d === TODAY_D ? (
                <Badge className="border-ink-800 bg-ink-800 text-white">오늘</Badge>
              ) : null}
            </div>
            <ul>
              {items.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center gap-3 border-b border-ink-100 px-3.5 py-2.5 last:border-b-0"
                >
                  <span className="w-10 shrink-0 text-[12px] font-medium text-ink-700 num">
                    {s.time}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink-800">
                    {s.title}
                  </span>
                  <Badge
                    className={
                      s.company === "tailor"
                        ? "border-tailor-200 bg-tailor-50 text-tailor-700"
                        : "border-corp-200 bg-corp-50 text-corp-700"
                    }
                  >
                    {s.kind}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function CashTab({ scope }: { scope: Scope }) {
  const lines = BUDGET_LINES.filter((b) => scope === "all" || b.company === scope);
  const planned = lines.reduce((s, b) => s + b.planned, 0);
  const executed = lines.reduce((s, b) => s + b.executed, 0);
  return (
    <div className="space-y-2.5">
      <div className="rounded-[10px] border border-ink-200/70 bg-ink-800 px-3.5 py-3 text-white shadow-card">
        <p className="text-[10.5px] text-white/55">가용자금</p>
        <p className="mt-1 text-[21px] font-semibold num">
          {won(
            scope === "tailor"
              ? SUMMARY.cash.tailorAvailable
              : scope === "corp"
                ? SUMMARY.cash.corpAvailable
                : SUMMARY.cash.available,
          )}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/10 pt-2.5 text-center">
          <div>
            <p className="text-[10px] text-white/50">계획</p>
            <p className="mt-0.5 text-[12px] font-medium num">{wonShort(planned)}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/50">집행</p>
            <p className="mt-0.5 text-[12px] font-medium num">{wonShort(executed)}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/50">집행률</p>
            <p className="mt-0.5 text-[12px] font-medium num">{pct(executed, planned)}%</p>
          </div>
        </div>
      </div>
      <div className="overflow-hidden rounded-[10px] border border-ink-200/70 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-ink-100 px-3.5 py-2.5">
          <span className="text-[12.5px] font-semibold text-ink-800">항목별 집행</span>
          <Link href="/finance" className="text-[11px] text-ink-400">
            자금 관리 <ChevronRight className="inline h-3 w-3" />
          </Link>
        </div>
        <ul className="px-3.5 py-1">
          {lines.slice(0, 7).map((b) => (
            <li key={b.id} className="border-b border-ink-100 py-2.5 last:border-b-0">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-[12px] text-ink-700">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      b.company === "tailor" ? "bg-tailor-600" : "bg-corp-700",
                    )}
                  />
                  {b.category}
                </span>
                <span className="text-[11.5px] text-ink-500 num">
                  {wonShort(b.executed)} / {wonShort(b.planned)}
                </span>
              </div>
              <Bar
                value={pct(b.executed, b.planned)}
                className="mt-1.5"
                color={b.company === "tailor" ? "#86293d" : "#234084"}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const FRAME_TABS = [
  { key: "home", label: "홈", icon: Home },
  { key: "task", label: "업무", icon: CheckSquare },
  { key: "cal", label: "일정", icon: CalendarDays },
  { key: "cash", label: "자금", icon: Banknote },
  { key: "menu", label: "메뉴", icon: LayoutGrid },
] as const;

type FrameTab = (typeof FRAME_TABS)[number]["key"];

/**
 * 대표자 모바일 브리핑.
 * embedded = true 이면 데스크톱 미리보기용으로 자체 하단 탭바를 함께 렌더링한다.
 */
export function MobileBriefing({ embedded = false }: { embedded?: boolean }) {
  const [scope, setScope] = React.useState<Scope>("all");
  const [tab, setTab] = React.useState<FrameTab>("home");
  const activeTab = embedded ? tab : "home";

  return (
    <div className="flex h-full flex-col bg-ivory-100">
      {/* 상단 바 */}
      <div className="shrink-0 border-b border-ink-200/70 bg-white px-3.5 py-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {embedded ? <Menu className="h-4 w-4 text-ink-400" /> : null}
            <span className="text-[14px] font-semibold text-ink-800">
              {activeTab === "home"
                ? "통합 브리핑"
                : activeTab === "task"
                  ? "확인 업무"
                  : activeTab === "cal"
                    ? "일정"
                    : activeTab === "cash"
                      ? "자금"
                      : "메뉴"}
            </span>
          </span>
          <span className="flex items-center gap-2">
            <span className="text-[11px] text-ink-400 num">07.29 (수)</span>
            {embedded ? (
              <span className="relative">
                <Bell className="h-4 w-4 text-ink-500" />
                <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8.5px] font-semibold text-white">
                  4
                </span>
              </span>
            ) : null}
          </span>
        </div>
        <div className="mt-2.5">
          <ScopeTabs value={scope} onChange={setScope} />
        </div>
      </div>

      {/* 본문 */}
      <div className="thin-scroll flex-1 space-y-3 overflow-y-auto px-3.5 py-3.5">
        {activeTab === "home" ? (
          <>
            <div className="flex items-baseline justify-between">
              <h2 className="text-[13px] font-semibold text-ink-800">오늘의 핵심 요약</h2>
              <span className="text-[10.5px] text-ink-400">
                {scope === "all" ? "양사 합산" : scope === "tailor" ? "비앤테일러샵" : "AI 법인"}
              </span>
            </div>
            <SummaryCards scope={scope} />
            <UrgentList scope={scope} />
            <TodaySchedule scope={scope} />
          </>
        ) : null}
        {activeTab === "task" ? <TasksTab scope={scope} /> : null}
        {activeTab === "cal" ? <ScheduleTab scope={scope} /> : null}
        {activeTab === "cash" ? <CashTab scope={scope} /> : null}
        {activeTab === "menu" ? (
          <div className="overflow-hidden rounded-[10px] border border-ink-200/70 bg-white shadow-card">
            {[
              { label: "통합 대시보드", href: "/dashboard" },
              { label: "비앤테일러샵 운영", href: "/tailor" },
              { label: "AI 법인 사업화", href: "/ai" },
              { label: "자금 관리", href: "/finance" },
              { label: "일정 관리", href: "/schedule" },
              { label: "알림 센터", href: "/notifications" },
            ].map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="flex items-center justify-between border-b border-ink-100 px-3.5 py-3 text-[12.5px] text-ink-700 last:border-b-0"
              >
                {m.label}
                <ChevronRight className="h-3.5 w-3.5 text-ink-300" />
              </Link>
            ))}
          </div>
        ) : null}

        <p className="pb-2 pt-1 text-center text-[10.5px] text-ink-300">
          {num(SUMMARY.tailor.orderCount)}건 주문 · {SUMMARY.corp.projects}개 프로젝트 운영 중
        </p>
      </div>

      {/* 미리보기용 하단 탭바 */}
      {embedded ? (
        <div className="shrink-0 border-t border-ink-200 bg-white">
          <div className="flex">
            {FRAME_TABS.map((t) => {
              const I = t.icon;
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] transition-colors",
                    active ? "text-tailor-700" : "text-ink-400",
                  )}
                >
                  <I className={cn("h-[17px] w-[17px]", active && "text-tailor-600")} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

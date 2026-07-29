"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  FlaskConical,
  FolderKanban,
  Handshake,
  Plus,
  Scissors,
  Truck,
  UserPlus,
  Users,
  UsersRound,
} from "lucide-react";
import { useApp } from "@/components/app-store";
import { MobileBriefing } from "@/components/mobile/briefing";
import {
  CategoryDonut,
  MiniBars,
  MiniLine,
  RateDonut,
  RevenueTrendChart,
} from "@/components/charts";
import { CompanyChip, KpiCard, MoreLink, PageHeader, StatTile } from "@/components/page-kit";
import { ExpenseModal, ProjectDetailModal } from "@/components/modals";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Bar } from "@/components/ui/progress";
import {
  AI_PROJECTS,
  BUDGET_LINES,
  CORP_REVENUE_MIX,
  FABRICS,
  REVENUE_TREND,
  REVENUE_TREND_12M,
  SCHEDULES,
  SUMMARY,
  TAILOR_REVENUE_MIX,
  TODAY,
  URGENT_TASKS,
} from "@/lib/data";
import { cn, num, pct, won, wonShort } from "@/lib/utils";
import type { Scope } from "@/lib/types";

const TODAY_D = TODAY.replace(/-/g, ".");

export default function DashboardPage() {
  const { scope, alerts, memos, addMemo, setNotifyOpen } = useApp();

  return (
    <>
      {/* 모바일 : 대표자 브리핑 앱 (데스크톱 축소판이 아닌 별도 화면) */}
      <div className="-mx-4 -mt-5 lg:hidden">
        <MobileBriefing />
      </div>

      {/* 데스크톱 : 통합 대시보드 */}
      <div className="hidden lg:block">
        <DesktopDashboard
          scope={scope}
          alerts={alerts}
          memos={memos}
          addMemo={addMemo}
          openNotify={() => setNotifyOpen(true)}
        />
      </div>
    </>
  );
}

function DesktopDashboard({
  scope,
  alerts,
  memos,
  addMemo,
  openNotify,
}: {
  scope: Scope;
  alerts: ReturnType<typeof useApp>["alerts"];
  memos: ReturnType<typeof useApp>["memos"];
  addMemo: ReturnType<typeof useApp>["addMemo"];
  openNotify: () => void;
}) {
  const showTailor = scope === "all" || scope === "tailor";
  const showCorp = scope === "all" || scope === "corp";
  const [range, setRange] = React.useState<"6개월" | "12개월">("6개월");
  const [memoText, setMemoText] = React.useState("");

  const trend = range === "6개월" ? REVENUE_TREND : REVENUE_TREND_12M;

  const tailorBudget = BUDGET_LINES.filter((b) => b.company === "tailor");
  const corpBudget = BUDGET_LINES.filter((b) => b.company === "corp");
  const tPlan = tailorBudget.reduce((s, b) => s + b.planned, 0);
  const tExec = tailorBudget.reduce((s, b) => s + b.executed, 0);
  const cPlan = corpBudget.reduce((s, b) => s + b.planned, 0);
  const cExec = corpBudget.reduce((s, b) => s + b.executed, 0);

  const tasks = URGENT_TASKS.filter((t) => scope === "all" || t.company === scope);
  const visibleAlerts = alerts.filter((a) => scope === "all" || a.company === scope).slice(0, 5);
  const visibleMemos = memos.filter((m) => scope === "all" || m.company === scope || m.company === "all");

  const todaySchedules = SCHEDULES.filter((s) => s.company === "tailor").slice(0, 4);
  const lowFabrics = FABRICS.filter((f) => f.status !== "충분").slice(0, 3);
  const topProjects = AI_PROJECTS.slice(0, 4);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="통합 대시보드"
        desc={
          scope === "all"
            ? "두 회사를 한눈에 관리하고 성장 기회를 함께 만들어가세요."
            : scope === "tailor"
              ? "비앤테일러샵 기준으로 필터링된 화면입니다."
              : "AI 소프트웨어 법인 기준으로 필터링된 화면입니다."
        }
        actions={
          <>
            <ExpenseModal>
              <Button variant="outline" size="default">
                <Plus className="h-3.5 w-3.5" />
                자금 집행 등록
              </Button>
            </ExpenseModal>
            <Button size="default" asChild>
              <Link href="/reports">월간 보고서</Link>
            </Button>
          </>
        }
      />

      {/* ── 상단 KPI ─────────────────────────── */}
      <div className="grid grid-cols-12 gap-3">
        {showTailor ? (
          <KpiCard
            className={cn("col-span-12", scope === "all" ? "xl:col-span-3" : "xl:col-span-3")}
            company="tailor"
            label="이번 달 매출"
            value={won(SUMMARY.tailor.revenue)}
            delta={SUMMARY.tailor.revenueDelta}
            sub="(전월 대비)"
            href="/tailor/sales"
            accent
            chart={
              <MiniBars
                data={REVENUE_TREND.map((r) => r.tailor)}
                color="#86293d"
                height={40}
              />
            }
          />
        ) : null}

        {showCorp ? (
          <KpiCard
            className="col-span-12 xl:col-span-3"
            company="corp"
            label="이번 달 매출"
            value={won(SUMMARY.corp.revenue)}
            delta={SUMMARY.corp.revenueDelta}
            sub="(전월 대비)"
            href="/ai/sales"
            accent
            chart={
              <MiniLine data={REVENUE_TREND.map((r) => r.corp)} color="#234084" height={40} />
            }
          />
        ) : null}

        <KpiCard
          className={cn(
            "col-span-12 sm:col-span-6",
            scope === "all" ? "xl:col-span-2" : "xl:col-span-3",
          )}
          label={scope === "all" ? "통합 가용자금" : "가용자금"}
          value={won(
            scope === "tailor"
              ? SUMMARY.cash.tailorAvailable
              : scope === "corp"
                ? SUMMARY.cash.corpAvailable
                : SUMMARY.cash.available,
          )}
          sub={scope === "all" ? "회사별 보유 자금 합계" : "운영 예비비 포함"}
          href="/finance"
          chart={
            scope === "all" ? (
              <>
                <div className="flex h-1.5 overflow-hidden rounded-full">
                  <span
                    className="bg-tailor-600"
                    style={{
                      width: `${pct(SUMMARY.cash.tailorAvailable, SUMMARY.cash.available)}%`,
                    }}
                  />
                  <span className="flex-1 bg-corp-700" />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[10.5px] text-ink-400">
                  <span className="num">비앤 {wonShort(SUMMARY.cash.tailorAvailable)}</span>
                  <span className="num">AI {wonShort(SUMMARY.cash.corpAvailable)}</span>
                </div>
              </>
            ) : undefined
          }
        />

        <div className={cn("col-span-12 sm:col-span-6", scope === "all" ? "xl:col-span-2" : "xl:col-span-3")}>
          <Card className="h-full">
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[12px] text-ink-500">이번 달 예상 지출</p>
                <RateDonut value={SUMMARY.cash.executedRate} color="#1b2437" size={52} />
              </div>
              <p className="-mt-3 text-[19px] font-semibold text-ink-900 num">
                {won(SUMMARY.cash.plannedSpend)}
              </p>
              <p className="mt-1.5 text-[11.5px] text-ink-400">
                계획 대비 집행률 <span className="text-ink-600 num">{SUMMARY.cash.executedRate}%</span>
              </p>
            </div>
          </Card>
        </div>

        <div className={cn("col-span-12", scope === "all" ? "xl:col-span-2" : "xl:col-span-3")}>
          <Card className="h-full">
            <div className="flex items-center justify-between border-b border-ink-200/60 px-4 py-2.5">
              <h3 className="text-[13px] font-semibold text-ink-800">긴급 확인 업무</h3>
              <MoreLink href="/tasks" />
            </div>
            <ul className="px-3 py-1.5">
              {tasks.map((t) => (
                <li key={t.id}>
                  <Link
                    href={t.href}
                    className="flex items-center gap-2 rounded px-1 py-[7px] transition-colors hover:bg-ivory-100"
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 shrink-0 rounded-full",
                        t.level === "긴급" ? "bg-rose-500" : "bg-amber-500",
                      )}
                    />
                    <span className="min-w-0 flex-1 truncate text-[12px] text-ink-700">
                      {t.title}
                    </span>
                    <span className="shrink-0 text-[12px] font-semibold text-ink-800 num">
                      {t.count}
                      <span className="ml-0.5 text-[10.5px] font-normal text-ink-400">건</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="px-3 pb-3">
              <Button variant="soft" size="sm" className="w-full" asChild>
                <Link href="/tasks">전체 업무 보기</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* ── 회사별 주요 현황 ─────────────────── */}
      <div className="mt-3 grid grid-cols-12 gap-3">
        {showTailor ? (
          <div className={cn("col-span-12", showCorp ? "xl:col-span-6" : "")}>
            <Card className="h-full">
              <CardHeader
                title={
                  <span className="flex items-center gap-2">
                    <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[3px] bg-tailor-600 text-[9px] font-bold text-white">
                      B&amp;
                    </span>
                    <span className="text-tailor-700">비앤테일러샵 주요 현황</span>
                  </span>
                }
                desc="맞춤정장 상담 · 제작 · 납품 진행 상황"
                action={<MoreLink href="/tailor" />}
              />
              <div className="grid grid-cols-4 divide-x divide-ink-100 border-b border-ink-100">
                <StatTile
                  label="신규 상담"
                  value={SUMMARY.tailor.newConsult}
                  unit="건"
                  tone="tailor"
                  icon={<UserPlus className="h-4 w-4" />}
                  href="/tailor/customers"
                />
                <StatTile
                  label="제작 중"
                  value={SUMMARY.tailor.inProduction}
                  unit="건"
                  tone="tailor"
                  icon={<Scissors className="h-4 w-4" />}
                  href="/tailor/production"
                />
                <StatTile
                  label="납품 예정"
                  value={SUMMARY.tailor.delivery}
                  unit="건"
                  tone="tailor"
                  icon={<Truck className="h-4 w-4" />}
                  href="/tailor/orders"
                />
                <StatTile
                  label="재구매 예상 고객"
                  value={SUMMARY.tailor.repurchase}
                  unit="명"
                  tone="tailor"
                  icon={<Users className="h-4 w-4" />}
                  href="/tailor/analytics"
                />
              </div>
              <div className="grid grid-cols-1 divide-y divide-ink-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                <div className="p-3.5">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-[12.5px] font-semibold text-ink-700">주요 일정</h4>
                    <MoreLink href="/schedule" />
                  </div>
                  <ul className="space-y-1.5">
                    {todaySchedules.map((s) => (
                      <li key={s.id} className="flex items-center gap-2">
                        <span className="w-[52px] shrink-0 text-[11.5px] text-ink-400 num">
                          {s.date.slice(5)}
                        </span>
                        <Badge className="shrink-0 border-tailor-200 bg-tailor-50 text-tailor-700">
                          {s.kind}
                        </Badge>
                        <span className="min-w-0 flex-1 truncate text-[12px] text-ink-700">
                          {s.title}
                        </span>
                        <span className="shrink-0 text-[11.5px] text-ink-400 num">{s.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3.5">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-[12.5px] font-semibold text-ink-700">원단 재고 알림</h4>
                    <MoreLink href="/tailor/fabrics" />
                  </div>
                  <ul className="space-y-2">
                    {lowFabrics.map((f) => (
                      <li key={f.id} className="flex items-center gap-2.5">
                        <span
                          className="h-7 w-7 shrink-0 rounded border border-ink-200"
                          style={{
                            background:
                              f.color.includes("네이비") || f.color.includes("미드나잇")
                                ? "#1f2b46"
                                : f.color.includes("차콜")
                                  ? "#3f434a"
                                  : f.color.includes("블랙")
                                    ? "#17181b"
                                    : f.color.includes("카멜")
                                      ? "#a5763f"
                                      : "#b9b3a7",
                          }}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[12px] font-medium text-ink-700">
                            {f.brand}
                          </span>
                          <span className="block truncate text-[11px] text-ink-400">
                            {f.name} · 잔여 {(f.stockM - f.assignedM).toFixed(1)}m
                          </span>
                        </span>
                        <StatusBadge status={f.status} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        ) : null}

        {showCorp ? (
          <div className={cn("col-span-12", showTailor ? "xl:col-span-6" : "")}>
            <Card className="h-full">
              <CardHeader
                title={
                  <span className="flex items-center gap-2">
                    <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[3px] bg-corp-700 text-[9px] font-bold text-white">
                      AI
                    </span>
                    <span className="text-corp-700">AI 소프트웨어 법인 주요 현황</span>
                  </span>
                }
                desc="프로젝트 개발 · R&D · 사업화 진행 상황"
                action={<MoreLink href="/ai" />}
              />
              <div className="grid grid-cols-4 divide-x divide-ink-100 border-b border-ink-100">
                <StatTile
                  label="진행 중 프로젝트"
                  value={SUMMARY.corp.projects}
                  unit="개"
                  tone="corp"
                  icon={<FolderKanban className="h-4 w-4" />}
                  href="/ai/projects"
                />
                <StatTile
                  label="R&D 과제"
                  value={SUMMARY.corp.rnd}
                  unit="개"
                  tone="corp"
                  icon={<FlaskConical className="h-4 w-4" />}
                  href="/ai/rnd"
                />
                <StatTile
                  label="개발 인력"
                  value={SUMMARY.corp.headcount}
                  unit="명"
                  tone="corp"
                  icon={<UsersRound className="h-4 w-4" />}
                  href="/ai/people"
                />
                <StatTile
                  label="이번 달 신규 계약"
                  value={SUMMARY.corp.newContract}
                  unit="건"
                  tone="corp"
                  icon={<Handshake className="h-4 w-4" />}
                  href="/ai/biz"
                />
              </div>
              <div className="p-3.5">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-[12.5px] font-semibold text-ink-700">주요 프로젝트</h4>
                  <MoreLink href="/ai/projects" />
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[11px] text-ink-400">
                      <th className="pb-1.5 font-normal">프로젝트명</th>
                      <th className="pb-1.5 font-normal">단계</th>
                      <th className="pb-1.5 font-normal">진행률</th>
                      <th className="pb-1.5 text-right font-normal">예상 완료일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProjects.map((p) => (
                      <tr key={p.id} className="border-t border-ink-100">
                        <td className="py-2 pr-2">
                          <ProjectDetailModal project={p}>
                            <button className="max-w-[190px] truncate text-left text-[12px] text-ink-800 hover:text-corp-700 hover:underline">
                              {p.name}
                            </button>
                          </ProjectDetailModal>
                        </td>
                        <td className="py-2 pr-2">
                          <span className="text-[11.5px] text-ink-500">{p.phase}</span>
                        </td>
                        <td className="w-[120px] py-2 pr-2">
                          <div className="flex items-center gap-1.5">
                            <Bar value={p.progress} color="#234084" />
                            <span className="w-8 shrink-0 text-right text-[11px] text-ink-500 num">
                              {p.progress}%
                            </span>
                          </div>
                        </td>
                        <td className="py-2 text-right text-[11.5px] text-ink-500 num">{p.dueAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        ) : null}
      </div>

      {/* ── 매출 추이 · 자금 집행 · 메모 ─────── */}
      <div className="mt-3 grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-6">
          <Card className="h-full">
            <CardHeader
              title="회사별 매출 추이"
              desc={`최근 ${range} · 단위 원`}
              action={
                <div className="flex items-center gap-1 rounded-md border border-ink-200 p-0.5">
                  {(["6개월", "12개월"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRange(r)}
                      className={cn(
                        "rounded px-2 py-1 text-[11.5px] transition-colors",
                        range === r ? "bg-ink-800 text-white" : "text-ink-500 hover:bg-ink-50",
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              }
            />
            <div className="p-3.5 pt-2">
              <RevenueTrendChart
                data={trend}
                height={252}
                series={scope === "all" ? "both" : scope}
              />
              <div className="mt-2 grid grid-cols-2 gap-3 border-t border-ink-100 pt-3">
                {showTailor ? (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11.5px] text-ink-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-tailor-600" />
                    비앤테일러샵
                  </span>
                  <span className="text-[12.5px] font-semibold text-ink-800 num">
                    {won(SUMMARY.tailor.revenue)}
                  </span>
                </div>
                ) : null}
                {showCorp ? (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11.5px] text-ink-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-corp-700" />
                    AI 소프트웨어 법인
                  </span>
                  <span className="text-[12.5px] font-semibold text-ink-800 num">
                    {won(SUMMARY.corp.revenue)}
                  </span>
                </div>
                ) : null}
              </div>
            </div>
          </Card>
        </div>

        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <Card className="h-full">
            <CardHeader
              title="회사별 자금 집행 현황"
              desc="이번 달 계획 대비"
              action={<MoreLink href="/finance" />}
            />
            <div className="space-y-3 p-3.5">
              {showTailor ? (
                <div className="flex items-center gap-3 rounded-md border border-tailor-200/60 bg-tailor-50/40 p-3">
                  <RateDonut value={pct(tExec, tPlan)} color="#86293d" size={68} />
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[12px] font-medium text-tailor-700">
                      <span className="flex h-[15px] w-[15px] items-center justify-center rounded-[3px] bg-tailor-600 text-[8px] font-bold text-white">
                        B&amp;
                      </span>
                      비앤테일러샵
                    </p>
                    <p className="mt-1.5 text-[11px] text-ink-400">
                      계획 <span className="text-ink-700 num">{wonShort(tPlan)}</span>
                    </p>
                    <p className="text-[11px] text-ink-400">
                      집행 <span className="font-medium text-ink-800 num">{wonShort(tExec)}</span>
                    </p>
                  </div>
                </div>
              ) : null}
              {showCorp ? (
                <div className="flex items-center gap-3 rounded-md border border-corp-200/60 bg-corp-50/40 p-3">
                  <RateDonut value={pct(cExec, cPlan)} color="#234084" size={68} />
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[12px] font-medium text-corp-700">
                      <span className="flex h-[15px] w-[15px] items-center justify-center rounded-[3px] bg-corp-700 text-[8px] font-bold text-white">
                        AI
                      </span>
                      AI 소프트웨어 법인
                    </p>
                    <p className="mt-1.5 text-[11px] text-ink-400">
                      계획 <span className="text-ink-700 num">{wonShort(cPlan)}</span>
                    </p>
                    <p className="text-[11px] text-ink-400">
                      집행 <span className="font-medium text-ink-800 num">{wonShort(cExec)}</span>
                    </p>
                  </div>
                </div>
              ) : null}
              <ExpenseModal>
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-3.5 w-3.5" />
                  자금 집행 등록
                </Button>
              </ExpenseModal>
            </div>
          </Card>
        </div>

        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <Card className="flex h-full flex-col">
            <CardHeader title="대표자 메모" desc="양사 공통 메모장" />
            <div className="flex-1 space-y-2 p-3.5">
              {visibleMemos.slice(0, 4).map((m) => (
                <div key={m.id} className="flex gap-2">
                  <span
                    className={cn(
                      "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                      m.company === "tailor"
                        ? "bg-tailor-600"
                        : m.company === "corp"
                          ? "bg-corp-700"
                          : "bg-ink-300",
                    )}
                  />
                  <p className="text-[12px] leading-relaxed text-ink-600">{m.text}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-ink-100 p-3">
              <div className="flex gap-1.5">
                <input
                  value={memoText}
                  onChange={(e) => setMemoText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && memoText.trim()) {
                      addMemo(memoText.trim(), scope);
                      setMemoText("");
                    }
                  }}
                  placeholder="메모 추가 후 Enter"
                  className="w-full rounded border border-ink-200 px-2.5 py-1.5 text-[12px] outline-none placeholder:text-ink-300 focus:border-ink-400"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (!memoText.trim()) return;
                    addMemo(memoText.trim(), scope);
                    setMemoText("");
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ── 확인 필요 업무 · 최근 알림 ───────── */}
      <div className="mt-3 grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-7">
          <Card className="h-full">
            <CardHeader
              title="대표자 확인 필요 업무"
              desc="회사별로 즉시 판단이 필요한 항목"
              action={<MoreLink href="/tasks" />}
            />
            <div className="grid grid-cols-1 divide-y divide-ink-100 md:grid-cols-2 md:divide-x">
              {tasks.map((t) => (
                <Link
                  key={t.id}
                  href={t.href}
                  className="group flex items-start gap-3 p-3.5 transition-colors hover:bg-ivory-100/70"
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                      t.company === "tailor"
                        ? "bg-tailor-50 text-tailor-600"
                        : "bg-corp-50 text-corp-600",
                    )}
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <CompanyChip company={t.company} />
                      <StatusBadge status={t.level} />
                    </div>
                    <p className="mt-1.5 text-[13px] font-medium text-ink-800">{t.title}</p>
                    <p className="mt-0.5 text-[11.5px] text-ink-400">{t.detail}</p>
                    <p className="mt-1 text-[11px] text-ink-400">기한 · {t.due}</p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1">
                    <span className="text-[17px] font-semibold text-ink-800 num">{t.count}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-ink-300 group-hover:text-ink-600" />
                  </span>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-span-12 xl:col-span-5">
          <Card className="h-full">
            <CardHeader
              title="최근 알림"
              desc="재고 · 납기 · 프로젝트 · 자금"
              action={
                <button
                  onClick={openNotify}
                  className="text-[11.5px] text-ink-400 transition-colors hover:text-ink-700"
                >
                  알림 패널 열기
                </button>
              }
            />
            <ul>
              {visibleAlerts.map((a) => (
                <li key={a.id}>
                  <Link
                    href={a.href}
                    className="flex items-start gap-2.5 border-b border-ink-100 px-4 py-2.5 transition-colors last:border-b-0 hover:bg-ivory-100/70"
                  >
                    <span
                      className={cn(
                        "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                        a.level === "긴급"
                          ? "bg-rose-500"
                          : a.level === "주의"
                            ? "bg-amber-500"
                            : "bg-ink-300",
                      )}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <CompanyChip company={a.company} />
                        <span className="text-[11px] text-ink-400">{a.category}</span>
                        <span className="ml-auto shrink-0 text-[11px] text-ink-300">{a.at}</span>
                      </span>
                      <span
                        className={cn(
                          "mt-1 block truncate text-[12.5px]",
                          a.read ? "text-ink-600" : "font-medium text-ink-800",
                        )}
                      >
                        {a.title}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* ── 회사별 매출 구성 요약 ─────────────── */}
      <div className="mt-3 grid grid-cols-12 gap-3">
        {showTailor ? (
          <div className={cn("col-span-12", showCorp ? "md:col-span-6" : "")}>
            <Card>
              <CardHeader
                title="비앤테일러샵 매출 구성"
                desc="이번 달 품목별"
                action={<MoreLink href="/tailor/sales" />}
              />
              <div className="grid grid-cols-2 items-center gap-2 p-3.5">
                <CategoryDonut
                  data={TAILOR_REVENUE_MIX}
                  colors={["#86293d", "#9c3d51", "#bf6b7c", "#d9a0ab", "#ecccd2"]}
                  height={170}
                  centerTop={wonShort(SUMMARY.tailor.revenue)}
                  centerBottom="이번 달"
                />
                <ul className="space-y-1.5">
                  {[
                    { n: "비스포크 정장", v: 78_200_000, c: "#86293d" },
                    { n: "셔츠 · 소품", v: 21_400_000, c: "#9c3d51" },
                    { n: "코트 · 아우터", v: 18_600_000, c: "#bf6b7c" },
                    { n: "수선 · 리폼", v: 6_250_000, c: "#d9a0ab" },
                    { n: "기업 단체복", v: 4_000_000, c: "#ecccd2" },
                  ].map((r) => (
                    <li key={r.n} className="flex items-center gap-2 text-[11.5px]">
                      <span className="h-2 w-2 rounded-sm" style={{ background: r.c }} />
                      <span className="flex-1 truncate text-ink-500">{r.n}</span>
                      <span className="text-ink-700 num">{wonShort(r.v)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        ) : null}

        {showCorp ? (
          <div className={cn("col-span-12", showTailor ? "md:col-span-6" : "")}>
            <Card>
              <CardHeader
                title="AI 법인 매출 구성"
                desc="이번 달 유형별"
                action={<MoreLink href="/ai/sales" />}
              />
              <div className="grid grid-cols-2 items-center gap-2 p-3.5">
                <CategoryDonut
                  data={CORP_REVENUE_MIX}
                  colors={["#234084", "#33529f", "#5e79bd", "#94a9d8", "#c6d2ec"]}
                  height={170}
                  centerTop={wonShort(SUMMARY.corp.revenue)}
                  centerBottom="이번 달"
                />
                <ul className="space-y-1.5">
                  {[
                    { n: "SaaS 구독", v: 31_400_000, c: "#234084" },
                    { n: "SI · 커스터마이징", v: 26_800_000, c: "#33529f" },
                    { n: "PoC 용역", v: 15_120_000, c: "#5e79bd" },
                    { n: "정부 R&D 과제", v: 10_000_000, c: "#94a9d8" },
                    { n: "데이터 라이선스", v: 4_000_000, c: "#c6d2ec" },
                  ].map((r) => (
                    <li key={r.n} className="flex items-center gap-2 text-[11.5px]">
                      <span className="h-2 w-2 rounded-sm" style={{ background: r.c }} />
                      <span className="flex-1 truncate text-ink-500">{r.n}</span>
                      <span className="text-ink-700 num">{wonShort(r.v)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        ) : null}
      </div>

      <p className="mt-4 text-center text-[11px] text-ink-300">
        {TODAY_D} 기준 · 비앤테일러샵 주문 {num(SUMMARY.tailor.orderCount)}건 · AI 법인 프로젝트{" "}
        {SUMMARY.corp.projects}건 · 데모 데이터
      </p>
    </div>
  );
}

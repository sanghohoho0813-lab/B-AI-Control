"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { useApp } from "@/components/app-store";
import { CompanyChip, PageHeader } from "@/components/page-kit";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Bar } from "@/components/ui/progress";
import { AI_PROJECTS, FABRICS, PRODUCTION_JOBS, URGENT_TASKS } from "@/lib/data";
import { cn, num, pct, won } from "@/lib/utils";

export default function TasksPage() {
  const { scope, transactions } = useApp();
  const tasks = URGENT_TASKS.filter((t) => scope === "all" || t.company === scope);

  const delayed = PRODUCTION_JOBS.filter((j) => j.status !== "정상");
  const lowFabrics = FABRICS.filter((f) => f.status === "재고 부족" || f.status === "발주 권장");
  const projectIssues = AI_PROJECTS.filter((p) => p.issue);
  const pending = transactions.filter((t) => t.status === "승인 대기");

  const showTailor = scope === "all" || scope === "tailor";
  const showCorp = scope === "all" || scope === "corp";

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="대표자 확인 필요 업무"
        desc="두 회사에서 즉시 판단이 필요한 항목을 모았습니다."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {tasks.map((t) => (
          <Card key={t.id} className="overflow-hidden">
            <span
              className={cn(
                "block h-[3px]",
                t.company === "tailor" ? "bg-tailor-600" : "bg-corp-700",
              )}
            />
            <div className="p-4">
              <div className="flex items-center justify-between">
                <CompanyChip company={t.company} />
                <StatusBadge status={t.level} />
              </div>
              <p className="mt-2.5 flex items-center gap-1.5 text-[19px] font-semibold text-ink-800">
                <AlertTriangle
                  className={cn(
                    "h-4 w-4",
                    t.level === "긴급" ? "text-rose-500" : "text-amber-500",
                  )}
                />
                {t.title}
              </p>
              <p className="mt-1 text-[15.5px] text-ink-400">{t.detail}</p>
              <div className="mt-3 flex items-center justify-between border-t border-ink-100 pt-2.5">
                <span className="text-[15.5px] text-ink-400">{t.due}</span>
                <span className="text-[25px] font-semibold text-ink-800 num">
                  {t.count}
                  <span className="ml-0.5 text-[15px] font-normal text-ink-400">건</span>
                </span>
              </div>
              <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
                <Link href={t.href}>
                  처리하러 가기 <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-12 gap-3">
        {showTailor ? (
          <>
            <div className="col-span-12 xl:col-span-6">
              <Card>
                <CardHeader title="납기 지연 · 지연 위험" desc="비앤테일러샵 제작 건" />
                <ul>
                  {delayed.map((j) => (
                    <li key={j.id} className="border-b border-ink-100 px-4 py-3 last:border-b-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[17px] font-medium text-ink-800">
                          {j.customer} 님 · {j.item}
                        </span>
                        <StatusBadge status={j.status} />
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Bar value={j.progress} color="#86293d" />
                        <span className="shrink-0 text-[15px] text-ink-500 num">{j.progress}%</span>
                      </div>
                      <p className="mt-1.5 text-[15px] text-ink-400">
                        {j.orderId} · 담당 {j.worker} · 납기 <span className="num">{j.dueAt}</span>
                        {j.riskDays > 0 ? (
                          <span className="ml-1 font-medium text-rose-600 num">+{j.riskDays}일</span>
                        ) : null}
                      </p>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <div className="col-span-12 xl:col-span-6">
              <Card>
                <CardHeader title="원단 재고 부족" desc="발주 검토가 필요한 원단" />
                <ul>
                  {lowFabrics.map((f) => (
                    <li
                      key={f.id}
                      className="flex items-center gap-3 border-b border-ink-100 px-4 py-3 last:border-b-0"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[17px] font-medium text-ink-800">
                          {f.brand} {f.name}
                        </span>
                        <span className="block truncate text-[15px] text-ink-400">
                          {f.code} · {f.color} · 잔여 {(f.stockM - f.assignedM).toFixed(1)}m · 리드타임{" "}
                          {f.leadTimeDays}일
                        </span>
                      </span>
                      <StatusBadge status={f.status} />
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </>
        ) : null}

        {showCorp ? (
          <div className="col-span-12 xl:col-span-6">
            <Card>
              <CardHeader title="AI 프로젝트 이슈" desc="일정 · 범위 확인 필요" />
              <ul>
                {projectIssues.map((p) => (
                  <li key={p.id} className="border-b border-ink-100 px-4 py-3 last:border-b-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[17px] font-medium text-ink-800">{p.name}</span>
                      <StatusBadge status={p.status} />
                    </div>
                    <p className="mt-1 text-[15.5px] text-ink-500">{p.issue}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Bar value={p.progress} color="#234084" />
                      <span className="shrink-0 text-[15px] text-ink-500 num">{p.progress}%</span>
                    </div>
                    <p className="mt-1.5 text-[15px] text-ink-400">
                      담당 {p.owner} · 예상 완료 <span className="num">{p.dueAt}</span> · 집행{" "}
                      <span className="num">{pct(p.spent, p.budget)}%</span>
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        ) : null}

        <div className="col-span-12 xl:col-span-6">
          <Card>
            <CardHeader
              title="자금 집행 검토"
              desc={`승인 대기 ${pending.length}건`}
            />
            <ul>
              {pending.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center gap-3 border-b border-ink-100 px-4 py-3 last:border-b-0"
                >
                  <CompanyChip company={t.company} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[17px] font-medium text-ink-800">
                      {t.title}
                    </span>
                    <span className="block truncate text-[15px] text-ink-400">
                      {t.category} · {t.vendor} · <span className="num">{t.date}</span>
                    </span>
                  </span>
                  <span className="shrink-0 text-[17px] font-semibold text-ink-800 num">
                    {won(t.amount)}
                  </span>
                </li>
              ))}
              {pending.length === 0 ? (
                <li className="px-4 py-8 text-center text-[17px] text-ink-400">
                  승인 대기 중인 집행 건이 없습니다.
                </li>
              ) : null}
            </ul>
            <div className="p-3">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/finance">자금 관리로 이동</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <p className="mt-4 text-center text-[15px] text-ink-300">
        확인 필요 업무 {num(tasks.reduce((s, t) => s + t.count, 0))}건 (데모 데이터)
      </p>
    </div>
  );
}

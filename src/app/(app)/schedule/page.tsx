"use client";

import * as React from "react";
import { CalendarDays, Check } from "lucide-react";
import { useApp } from "@/components/app-store";
import { CompanyChip, PageHeader } from "@/components/page-kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { COMPANIES, SCHEDULES, TODAY } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { ScheduleKind } from "@/lib/types";

const TODAY_D = TODAY.replace(/-/g, ".");

const KINDS: ScheduleKind[] = ["납품", "가봉", "상담", "발주", "회의", "보고", "계약", "정산"];

export default function SchedulePage() {
  const { scope } = useApp();
  const [kind, setKind] = React.useState<ScheduleKind | "전체">("전체");
  const [done, setDone] = React.useState<Record<string, boolean>>({});

  const items = SCHEDULES.filter(
    (s) => (scope === "all" || s.company === scope) && (kind === "전체" || s.kind === kind),
  );
  const days = Array.from(new Set(items.map((s) => s.date)));

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="일정 관리"
        desc="양사의 상담 · 가봉 · 납품 · 회의 일정을 한 화면에서 확인합니다."
        actions={
          <Button variant="outline">
            <CalendarDays className="h-3.5 w-3.5" />
            주간 보기
          </Button>
        }
      />

      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {(["전체", ...KINDS] as const).map((k) => (
          <button
            key={k}
            onClick={() => setKind(k as ScheduleKind | "전체")}
            className={cn(
              "rounded border px-2.5 py-1 text-[16px] transition-colors",
              kind === k
                ? "border-ink-800 bg-ink-800 text-white"
                : "border-ink-200 bg-white text-ink-500 hover:bg-ink-50",
            )}
          >
            {k}
          </button>
        ))}
        <span className="ml-auto text-[15.5px] text-ink-400">총 {items.length}건</span>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        {days.map((d) => {
          const dayItems = items.filter((s) => s.date === d);
          const isToday = d === TODAY_D;
          return (
            <Card key={d} className={cn(isToday && "ring-1 ring-ink-300")}>
              <CardHeader
                title={
                  <span className="flex items-center gap-2">
                    <span className="num">{d}</span>
                    {isToday ? (
                      <Badge className="border-ink-800 bg-ink-800 text-white">오늘</Badge>
                    ) : null}
                  </span>
                }
                desc={`${dayItems.length}건`}
              />
              <ul>
                {dayItems.map((s) => {
                  const checked = done[s.id] ?? s.done;
                  return (
                    <li
                      key={s.id}
                      className="flex items-center gap-3 border-b border-ink-100 px-4 py-3 last:border-b-0"
                    >
                      <button
                        onClick={() => setDone((p) => ({ ...p, [s.id]: !checked }))}
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                          checked
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-ink-300 bg-white hover:border-ink-400",
                        )}
                      >
                        {checked ? <Check className="h-3 w-3" /> : null}
                      </button>
                      <span className="w-11 shrink-0 text-[16px] font-medium text-ink-700 num">
                        {s.time}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block truncate text-[17px]",
                            checked ? "text-ink-400 line-through" : "font-medium text-ink-800",
                          )}
                        >
                          {s.title}
                        </span>
                        <span className="block truncate text-[15px] text-ink-400">
                          {s.place} · {s.owner} · {COMPANIES[s.company].shortName}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5">
                        <Badge
                          className={
                            s.company === "tailor"
                              ? "border-tailor-200 bg-tailor-50 text-tailor-700"
                              : "border-corp-200 bg-corp-50 text-corp-700"
                          }
                        >
                          {s.kind}
                        </Badge>
                        <CompanyChip company={s.company} />
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          );
        })}
      </div>

      {items.length === 0 ? (
        <Card className="mt-3">
          <div className="px-4 py-12 text-center text-[17px] text-ink-400">
            조건에 맞는 일정이 없습니다.
          </div>
        </Card>
      ) : null}
    </div>
  );
}

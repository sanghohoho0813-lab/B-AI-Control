"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, TrendingDown, TrendingUp } from "lucide-react";
import { useApp } from "@/components/app-store";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CompanyId } from "@/lib/types";

/** 페이지 상단 타이틀 영역 */
export function PageHeader({
  title,
  desc,
  company,
  actions,
}: {
  title: string;
  desc?: string;
  company?: CompanyId;
  actions?: React.ReactNode;
}) {
  const { period, dateLabel } = useApp();
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          {company ? (
            <span
              className={cn(
                "flex h-5 items-center rounded px-1.5 text-[10.5px] font-semibold",
                company === "tailor"
                  ? "bg-tailor-50 text-tailor-700"
                  : "bg-corp-50 text-corp-700",
              )}
            >
              {company === "tailor" ? "비앤테일러샵" : "AI 소프트웨어 법인"}
            </span>
          ) : null}
          <h1 className="text-[22px] font-semibold tracking-tight text-ink-800">{title}</h1>
        </div>
        {desc ? <p className="mt-1 text-[12.5px] text-ink-400">{desc}</p> : null}
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden text-[11.5px] text-ink-400 sm:inline num">
          {dateLabel} 기준 · {period}
        </span>
        {actions}
      </div>
    </div>
  );
}

/** 상단 KPI 카드 — 클릭하면 상세 화면으로 이동한다 */
export function KpiCard({
  label,
  value,
  sub,
  delta,
  href,
  company,
  chart,
  accent,
  className,
}: {
  label: string;
  value: string;
  sub?: string;
  delta?: number;
  href: string;
  company?: CompanyId;
  chart?: React.ReactNode;
  accent?: boolean;
  className?: string;
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <Link href={href} className={cn("group block", className)}>
      <Card
        className={cn(
          "relative h-full overflow-hidden transition-shadow hover:shadow-raise",
          company === "tailor" && "stripe-tailor",
          company === "corp" && "stripe-corp",
        )}
      >
        {company ? (
          <span
            className={cn(
              "absolute inset-x-0 top-0 h-[3px]",
              company === "tailor" ? "bg-tailor-600" : "bg-corp-700",
            )}
          />
        ) : null}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              {company ? (
                <span
                  className={cn(
                    "mb-1 inline-flex items-center gap-1 text-[11px] font-semibold",
                    company === "tailor" ? "text-tailor-700" : "text-corp-700",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-[15px] min-w-[15px] items-center justify-center rounded-[3px] px-0.5 text-[8px] font-bold text-white",
                      company === "tailor" ? "bg-tailor-600" : "bg-corp-700",
                    )}
                  >
                    {company === "tailor" ? "B&" : "AI"}
                  </span>
                  {company === "tailor" ? "비앤테일러샵" : "AI 소프트웨어 법인"}
                </span>
              ) : null}
              <p className="truncate text-[12px] text-ink-500">{label}</p>
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-ink-300 transition-colors group-hover:text-ink-600" />
          </div>

          <p
            className={cn(
              "mt-1.5 font-semibold tracking-tight text-ink-900 num",
              accent ? "text-[26px]" : "text-[22px]",
            )}
          >
            {value}
          </p>

          <div className="mt-1 flex items-center gap-2">
            {typeof delta === "number" ? (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 text-[11.5px] font-medium",
                  up ? "text-emerald-600" : "text-rose-600",
                )}
              >
                {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {up ? "+" : ""}
                {delta}%
              </span>
            ) : null}
            {sub ? <span className="truncate text-[11.5px] text-ink-400">{sub}</span> : null}
          </div>

          {chart ? <div className="mt-2">{chart}</div> : null}
        </div>
      </Card>
    </Link>
  );
}

/** 카드 안에서 쓰는 작은 지표 타일 */
export function StatTile({
  label,
  value,
  unit,
  icon,
  tone = "neutral",
  href,
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  tone?: "neutral" | "tailor" | "corp";
  href?: string;
}) {
  const body = (
    <div className="flex flex-col items-center gap-1.5 px-2 py-3 text-center">
      {icon ? (
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md",
            tone === "tailor"
              ? "bg-tailor-50 text-tailor-600"
              : tone === "corp"
                ? "bg-corp-50 text-corp-600"
                : "bg-ink-100 text-ink-500",
          )}
        >
          {icon}
        </span>
      ) : null}
      <span className="text-[11.5px] text-ink-500">{label}</span>
      <span className="text-[19px] font-semibold leading-none text-ink-800 num">
        {value}
        {unit ? <span className="ml-0.5 text-[11.5px] font-normal text-ink-400">{unit}</span> : null}
      </span>
    </div>
  );
  if (!href) return body;
  return (
    <Link href={href} className="rounded-md transition-colors hover:bg-ivory-100">
      {body}
    </Link>
  );
}

/** 목록형 행 */
export function ListRow({
  left,
  right,
  href,
  className,
}: {
  left: React.ReactNode;
  right?: React.ReactNode;
  href?: string;
  className?: string;
}) {
  const inner = (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b border-ink-100 px-4 py-2.5 last:border-b-0",
        href && "transition-colors hover:bg-ivory-100",
        className,
      )}
    >
      <div className="min-w-0 flex-1">{left}</div>
      <div className="flex shrink-0 items-center gap-2">{right}</div>
    </div>
  );
  if (!href) return inner;
  return <Link href={href}>{inner}</Link>;
}

export function MoreLink({ href, label = "전체 보기" }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-0.5 text-[11.5px] text-ink-400 transition-colors hover:text-ink-700"
    >
      {label}
      <ChevronRight className="h-3 w-3" />
    </Link>
  );
}

export function CompanyChip({ company }: { company: CompanyId }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10.5px] font-medium leading-none",
        company === "tailor"
          ? "border-tailor-200 bg-tailor-50 text-tailor-700"
          : "border-corp-200 bg-corp-50 text-corp-700",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", company === "tailor" ? "bg-tailor-600" : "bg-corp-700")} />
      {company === "tailor" ? "비앤테일러샵" : "AI 법인"}
    </span>
  );
}

/** 단계 진행 표시 (주문 진행단계 · 사업화 단계) */
export function StageFlow({
  stages,
  current,
  tone: t = "tailor",
  counts,
}: {
  stages: readonly string[];
  current?: string;
  tone?: "tailor" | "corp";
  counts?: Record<string, number>;
}) {
  const idx = current ? stages.indexOf(current) : -1;
  return (
    <div className="flex flex-wrap items-center gap-1">
      {stages.map((s, i) => {
        const passed = idx >= 0 && i <= idx;
        return (
          <React.Fragment key={s}>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded border px-2 py-1 text-[11.5px] transition-colors",
                passed
                  ? t === "tailor"
                    ? "border-tailor-600 bg-tailor-600 text-white"
                    : "border-corp-700 bg-corp-700 text-white"
                  : "border-ink-200 bg-white text-ink-400",
              )}
            >
              {s}
              {counts ? (
                <span
                  className={cn(
                    "rounded px-1 text-[10px] font-semibold",
                    passed ? "bg-white/20" : "bg-ink-100 text-ink-500",
                  )}
                >
                  {counts[s] ?? 0}
                </span>
              ) : null}
            </span>
            {i < stages.length - 1 ? (
              <span className="text-[10px] text-ink-300">›</span>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
}

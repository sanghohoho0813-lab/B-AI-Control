"use client";

import * as React from "react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CompanyId } from "@/lib/types";
import { useMobileNav } from "./nav-context";

/* ── 회사 배지 ──────────────────────────────── */

export function MCompanyBadge({ company }: { company: CompanyId }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-[5px] px-1.5 py-[3px] text-[10.5px] font-semibold leading-none",
        company === "tailor" ? "bg-tailor-50 text-tailor-700" : "bg-corp-50 text-corp-700",
      )}
    >
      {company === "tailor" ? "비앤" : "AI"}
    </span>
  );
}

export function MStatusBadge({
  status,
  level = "안내",
}: {
  status: string;
  level?: "긴급" | "주의" | "안내";
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-[5px] px-1.5 py-[3px] text-[10.5px] font-medium leading-none",
        level === "긴급"
          ? "bg-rose-50 text-rose-600"
          : level === "주의"
            ? "bg-amber-50 text-amber-700"
            : "bg-ink-100 text-ink-500",
      )}
    >
      {status}
    </span>
  );
}

/* ── 섹션 ───────────────────────────────────── */

export function MSection({
  title,
  action,
  actionHref,
  children,
  className,
}: {
  title?: string;
  action?: string;
  actionHref?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { go } = useMobileNav();
  return (
    <section className={cn("mt-5 first:mt-0", className)}>
      {title ? (
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="text-[14px] font-semibold tracking-tight text-ink-800">{title}</h2>
          {action && actionHref ? (
            <button
              onClick={() => go(actionHref)}
              className="flex items-center gap-0.5 py-1 text-[12px] text-ink-400 active:text-ink-700"
            >
              {action}
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

/** 흰 카드 컨테이너 */
export function MCard({
  children,
  className,
  onPress,
}: {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
}) {
  const base =
    "w-full overflow-hidden rounded-[14px] border border-ink-200/60 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]";
  if (onPress) {
    return (
      <button onClick={onPress} className={cn(base, "block text-left active:bg-ivory-100", className)}>
        {children}
      </button>
    );
  }
  return <div className={cn(base, className)}>{children}</div>;
}

/* ── 2열 지표 타일 ──────────────────────────── */

export function MStatGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-2.5">{children}</div>;
}

export function MStat({
  label,
  value,
  unit,
  hint,
  href,
  tone = "neutral",
  icon,
}: {
  label: string;
  value: string;
  unit?: string;
  hint?: string;
  href?: string;
  tone?: "neutral" | "tailor" | "corp" | "alert";
  icon?: React.ReactNode;
}) {
  const { go } = useMobileNav();
  return (
    <button
      onClick={() => href && go(href)}
      className="flex min-h-[92px] flex-col justify-between rounded-[14px] border border-ink-200/60 bg-white p-3.5 text-left shadow-[0_1px_2px_rgba(16,24,40,0.04)] active:bg-ivory-100"
    >
      <span className="flex items-center gap-1.5">
        {icon ? (
          <span
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-[6px]",
              tone === "tailor"
                ? "bg-tailor-50 text-tailor-600"
                : tone === "corp"
                  ? "bg-corp-50 text-corp-600"
                  : tone === "alert"
                    ? "bg-rose-50 text-rose-500"
                    : "bg-ink-100 text-ink-500",
            )}
          >
            {icon}
          </span>
        ) : null}
        <span className="text-[12px] text-ink-500">{label}</span>
      </span>
      <span className="mt-1.5 block">
        <span
          className={cn(
            "text-[23px] font-semibold leading-none tracking-tight num",
            tone === "alert" ? "text-rose-600" : "text-ink-900",
          )}
        >
          {value}
        </span>
        {unit ? <span className="ml-0.5 text-[12px] text-ink-400">{unit}</span> : null}
      </span>
      {hint ? <span className="mt-1 block truncate text-[11px] text-ink-400">{hint}</span> : null}
    </button>
  );
}

/* ── 리스트 행 ──────────────────────────────── */

export function MList({ children, className }: { children: React.ReactNode; className?: string }) {
  return <MCard className={className}>{children}</MCard>;
}

export function MRow({
  href,
  leading,
  title,
  sub,
  trailing,
  meta,
  chevron = true,
  wrapTitle = false,
}: {
  href?: string;
  leading?: React.ReactNode;
  title: React.ReactNode;
  sub?: React.ReactNode;
  trailing?: React.ReactNode;
  meta?: React.ReactNode;
  chevron?: boolean;
  /** 제목이 길 때 말줄임 대신 줄바꿈한다 */
  wrapTitle?: boolean;
}) {
  const { go } = useMobileNav();
  const inner = (
    <div className="flex min-h-[56px] w-full items-center gap-3 border-b border-ink-100 px-3.5 py-3 last:border-b-0">
      {leading ? <div className="shrink-0">{leading}</div> : null}
      <div className="min-w-0 flex-1">
        <div className={cn("flex gap-1.5", wrapTitle ? "items-start" : "items-center")}>
          {meta ? <span className={cn(wrapTitle && "mt-[1px]")}>{meta}</span> : null}
          <p
            className={cn(
              "min-w-0 flex-1 text-[13.5px] font-medium leading-snug text-ink-800",
              wrapTitle ? "break-keep" : "truncate",
            )}
          >
            {title}
          </p>
        </div>
        {sub ? (
          <p className={cn("mt-0.5 text-[11.5px] text-ink-400", wrapTitle ? "" : "truncate")}>
            {sub}
          </p>
        ) : null}
      </div>
      {trailing ? <div className="shrink-0 text-right">{trailing}</div> : null}
      {href && chevron ? <ChevronRight className="h-4 w-4 shrink-0 text-ink-300" /> : null}
    </div>
  );
  if (!href) return inner;
  return (
    <button onClick={() => go(href)} className="block w-full text-left active:bg-ivory-100">
      {inner}
    </button>
  );
}

/* ── 진행률 ─────────────────────────────────── */

export function MProgress({ value, tone = "tailor" }: { value: number; tone?: "tailor" | "corp" }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
      <div
        className={cn("h-full rounded-full", tone === "tailor" ? "bg-tailor-600" : "bg-corp-700")}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

/* ── 타임라인 (일정 전용) ───────────────────── */

export function MTimeline({ children }: { children: React.ReactNode }) {
  return <div className="relative pl-[68px]">{children}</div>;
}

export function MTimelineItem({
  time,
  title,
  sub,
  company,
  tag,
  done,
  last,
  href,
  onToggle,
}: {
  time: string;
  title: string;
  sub?: string;
  company: CompanyId;
  tag?: string;
  done?: boolean;
  last?: boolean;
  href?: string;
  onToggle?: () => void;
}) {
  const { go } = useMobileNav();
  return (
    <div className="relative pb-3 last:pb-0">
      <span className="absolute -left-[68px] top-[13px] w-[44px] text-right text-[12px] font-medium text-ink-500 num">
        {time}
      </span>
      <span
        className={cn(
          "absolute -left-[18px] top-[15px] h-2 w-2 rounded-full ring-[3px] ring-ivory-100",
          done ? "bg-ink-300" : company === "tailor" ? "bg-tailor-600" : "bg-corp-700",
        )}
      />
      {!last ? (
        <span className="absolute -left-[15px] top-[23px] h-[calc(100%-10px)] w-px bg-ink-200" />
      ) : null}
      <div
        className={cn(
          "flex items-center gap-2 rounded-[12px] border border-ink-200/60 bg-white pl-3.5 pr-2 shadow-[0_1px_2px_rgba(16,24,40,0.04)]",
          done && "opacity-60",
        )}
      >
        <button
          onClick={() => href && go(href)}
          className="min-w-0 flex-1 py-2.5 text-left"
        >
          <span className="flex items-center gap-1.5">
            <MCompanyBadge company={company} />
            {tag ? (
              <span className="rounded-[5px] bg-ink-100 px-1.5 py-[3px] text-[10.5px] font-medium leading-none text-ink-500">
                {tag}
              </span>
            ) : null}
          </span>
          <span
            className={cn(
              "mt-1.5 block text-[13.5px] font-medium leading-snug text-ink-800",
              done && "line-through",
            )}
          >
            {title}
          </span>
          {sub ? (
            <span className="mt-0.5 block truncate text-[11.5px] text-ink-400">{sub}</span>
          ) : null}
        </button>
        {onToggle ? (
          <button
            onClick={onToggle}
            aria-label={done ? "완료 취소" : "완료 처리"}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors",
              done
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-ink-200 text-ink-300 active:bg-ink-100",
            )}
          >
            <Check className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

/* ── 기타 ───────────────────────────────────── */

export function MEmpty({ text }: { text: string }) {
  return (
    <MCard>
      <p className="px-4 py-10 text-center text-[13px] text-ink-400">{text}</p>
    </MCard>
  );
}

export function MChips({
  items,
  value,
  onChange,
  tone = "tailor",
}: {
  items: readonly string[];
  value: string;
  onChange: (v: string) => void;
  tone?: "tailor" | "corp" | "ink";
}) {
  return (
    <div className="thin-scroll -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-0.5">
      {items.map((it) => (
        <button
          key={it}
          onClick={() => onChange(it)}
          className={cn(
            "shrink-0 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
            value === it
              ? tone === "tailor"
                ? "border-tailor-600 bg-tailor-600 text-white"
                : tone === "corp"
                  ? "border-corp-700 bg-corp-700 text-white"
                  : "border-ink-800 bg-ink-800 text-white"
              : "border-ink-200 bg-white text-ink-500",
          )}
        >
          {it}
        </button>
      ))}
    </div>
  );
}

/** 회사 구분 헤더가 있는 카드 */
export function MCompanyCard({
  company,
  title,
  href,
  children,
}: {
  company: CompanyId;
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  const { go } = useMobileNav();
  return (
    <MCard className="relative">
      <span
        className={cn(
          "absolute inset-y-0 left-0 w-[3px]",
          company === "tailor" ? "bg-tailor-600" : "bg-corp-700",
        )}
      />
      <button
        onClick={() => go(href)}
        className="flex w-full items-center gap-2 px-3.5 pb-2 pt-3 text-left active:bg-ivory-100"
      >
        <span
          className={cn(
            "flex h-[18px] min-w-[18px] items-center justify-center rounded-[4px] px-1 text-[8.5px] font-bold text-white",
            company === "tailor" ? "bg-tailor-600" : "bg-corp-700",
          )}
        >
          {company === "tailor" ? "B&" : "AI"}
        </span>
        <span
          className={cn(
            "flex-1 text-[13.5px] font-semibold",
            company === "tailor" ? "text-tailor-700" : "text-corp-700",
          )}
        >
          {title}
        </span>
        <ChevronRight className="h-4 w-4 text-ink-300" />
      </button>
      {children}
    </MCard>
  );
}

/** 회사 카드 안의 2×2 지표 */
export function MMiniGrid({
  items,
}: {
  items: { label: string; value: string; unit?: string; alert?: boolean }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-px bg-ink-100">
      {items.map((it) => (
        <div key={it.label} className="bg-white px-3.5 py-2.5">
          <p className="truncate text-[11px] text-ink-400">{it.label}</p>
          <p
            className={cn(
              "mt-0.5 text-[17px] font-semibold leading-none tracking-tight num",
              it.alert ? "text-rose-600" : "text-ink-800",
            )}
          >
            {it.value}
            {it.unit ? (
              <span className="ml-0.5 text-[11px] font-normal text-ink-400">{it.unit}</span>
            ) : null}
          </p>
        </div>
      ))}
    </div>
  );
}

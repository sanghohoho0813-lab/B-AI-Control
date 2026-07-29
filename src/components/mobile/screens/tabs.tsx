"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { useApp } from "@/components/app-store";
import {
  MCard,
  MChips,
  MCompanyBadge,
  MEmpty,
  MList,
  MProgress,
  MRow,
  MSection,
  MStat,
  MStatGrid,
  MStatusBadge,
  MTimeline,
  MTimelineItem,
} from "@/components/mobile/ui";
import { useMobileNav } from "@/components/mobile/nav-context";
import {
  APPROVALS,
  BUDGET_LINES,
  COMPANIES,
  SCHEDULES,
  SUMMARY,
  TODAY_URGENT,
} from "@/lib/data";
import { cn, pct, won, wonShort } from "@/lib/utils";

const TODAY_D = "2026.07.29";

/* ── 업무 ───────────────────────────────────── */

export function MobileTasks() {
  const { scope } = useApp();
  const { go } = useMobileNav();
  const [filter, setFilter] = React.useState("전체");

  const all = TODAY_URGENT.filter((u) => scope === "all" || u.company === scope);
  const items = all.filter((u) => filter === "전체" || u.level === filter);
  const approvals = APPROVALS.filter((a) => scope === "all" || a.company === scope);

  return (
    <>
      <MStatGrid>
        <MStat
          label="긴급업무"
          value={String(all.length)}
          unit="건"
          hint={`즉시 확인 ${all.filter((u) => u.level === "긴급").length}건`}
          tone="alert"
        />
        <MStat
          label="승인 대기"
          value={String(approvals.length)}
          unit="건"
          hint="대표자 결재 필요"
          href="/approvals"
        />
      </MStatGrid>

      <MSection className="mt-4">
        <MChips items={["전체", "긴급", "주의"]} value={filter} onChange={setFilter} />
      </MSection>

      <MSection title={`오늘 업무 ${items.length}건`} className="mt-3">
        {items.length === 0 ? (
          <MEmpty text="해당 조건의 업무가 없습니다." />
        ) : (
          <div className="space-y-2.5">
            {items.map((u) => (
              <MCard key={u.id} onPress={() => go(u.href)}>
                <div className="p-3.5">
                  <div className="flex items-center gap-1.5">
                    <MCompanyBadge company={u.company} />
                    <MStatusBadge status={u.status} level={u.level} />
                    <span className="ml-auto text-[11px] text-ink-400">{u.at}</span>
                  </div>
                  <div className="mt-2 flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold leading-snug text-ink-800">
                        {u.title}
                      </p>
                      <p className="mt-1 text-[12px] leading-relaxed text-ink-400">{u.detail}</p>
                    </div>
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-ink-300" />
                  </div>
                </div>
              </MCard>
            ))}
          </div>
        )}
      </MSection>

      <MSection title="승인 대기" action="전체 보기" actionHref="/approvals">
        <MList>
          {approvals.slice(0, 3).map((a) => (
            <MRow
              key={a.id}
              href="/approvals"
              meta={<MCompanyBadge company={a.company} />}
              title={a.title}
              sub={`${a.kind} · ${a.requestedBy}`}
              wrapTitle
              trailing={
                a.amount ? (
                  <span className="text-[12.5px] font-semibold text-ink-800 num">
                    {wonShort(a.amount)}
                  </span>
                ) : null
              }
            />
          ))}
        </MList>
      </MSection>
    </>
  );
}

/* ── 일정 ───────────────────────────────────── */

export function MobileSchedule() {
  const { scope } = useApp();
  const [done, setDone] = React.useState<Record<string, boolean>>({});
  const days = Array.from(new Set(SCHEDULES.map((s) => s.date)));
  const items = SCHEDULES.filter((s) => scope === "all" || s.company === scope);

  return (
    <>
      <MStatGrid>
        <MStat
          label="오늘 일정"
          value={String(items.filter((s) => s.date === TODAY_D).length)}
          unit="건"
          hint="2026.07.29"
        />
        <MStat
          label="이번 주"
          value={String(items.length)}
          unit="건"
          hint={`${days.length}일간`}
        />
      </MStatGrid>

      {days.map((d) => {
        const dayItems = items.filter((s) => s.date === d);
        if (dayItems.length === 0) return null;
        const isToday = d === TODAY_D;
        return (
          <MSection key={d} className="mt-5">
            <div className="mb-2 flex items-center gap-2 px-1">
              <h2 className="text-[14px] font-semibold tracking-tight text-ink-800 num">{d}</h2>
              {isToday ? (
                <span className="rounded-full bg-ink-800 px-2 py-[3px] text-[10.5px] font-medium leading-none text-white">
                  오늘
                </span>
              ) : null}
              <span className="ml-auto text-[11.5px] text-ink-400">{dayItems.length}건</span>
            </div>
            <MTimeline>
              {dayItems.map((s, i, arr) => (
                <MTimelineItem
                  key={s.id}
                  time={s.time}
                  title={s.title}
                  sub={`${s.place} · ${s.owner}`}
                  company={s.company}
                  tag={s.kind}
                  done={done[s.id]}
                  last={i === arr.length - 1}
                  onToggle={() => setDone((p) => ({ ...p, [s.id]: !p[s.id] }))}
                />
              ))}
            </MTimeline>
          </MSection>
        );
      })}
    </>
  );
}

/* ── 자금 ───────────────────────────────────── */

export function MobileFinance() {
  const { scope, transactions } = useApp();
  const lines = BUDGET_LINES.filter((b) => scope === "all" || b.company === scope);
  const planned = lines.reduce((s, b) => s + b.planned, 0);
  const executed = lines.reduce((s, b) => s + b.executed, 0);
  const available =
    scope === "corp"
      ? SUMMARY.cash.corpAvailable
      : scope === "tailor"
        ? SUMMARY.cash.tailorAvailable
        : SUMMARY.cash.available;

  const txs = transactions.filter((t) => scope === "all" || t.company === scope).slice(0, 6);
  const pending = txs.filter((t) => t.status === "승인 대기").length;

  return (
    <>
      {/* 가용자금 */}
      <MCard className="border-0 bg-ink-800">
        <div className="p-4">
          <p className="text-[12px] text-white/55">
            {scope === "all" ? "통합 가용자금" : `${COMPANIES[scope].shortName} 가용자금`}
          </p>
          <p className="mt-1.5 text-[27px] font-semibold leading-none tracking-tight text-white num">
            {won(available)}
          </p>
          <div className="mt-3.5 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-center">
            <div>
              <p className="text-[10.5px] text-white/50">계획</p>
              <p className="mt-1 text-[13px] font-medium text-white num">{wonShort(planned)}</p>
            </div>
            <div>
              <p className="text-[10.5px] text-white/50">집행</p>
              <p className="mt-1 text-[13px] font-medium text-white num">{wonShort(executed)}</p>
            </div>
            <div>
              <p className="text-[10.5px] text-white/50">집행률</p>
              <p className="mt-1 text-[13px] font-medium text-white num">
                {pct(executed, planned)}%
              </p>
            </div>
          </div>
        </div>
      </MCard>

      {/* 회사별 집행 */}
      {scope === "all" ? (
        <MSection title="회사별 집행률">
          <div className="grid grid-cols-2 gap-2.5">
            {(["tailor", "corp"] as const).map((c) => {
              const cl = BUDGET_LINES.filter((b) => b.company === c);
              const p = cl.reduce((s, b) => s + b.planned, 0);
              const e = cl.reduce((s, b) => s + b.executed, 0);
              return (
                <MCard key={c}>
                  <div className="p-3.5">
                    <span className="flex items-center gap-1.5">
                      <MCompanyBadge company={c} />
                      <span className="truncate text-[11.5px] text-ink-500">
                        {COMPANIES[c].shortName}
                      </span>
                    </span>
                    <p className="mt-2 text-[23px] font-semibold leading-none text-ink-900 num">
                      {pct(e, p)}%
                    </p>
                    <div className="mt-2">
                      <MProgress value={pct(e, p)} tone={c} />
                    </div>
                    <p className="mt-1.5 text-[11px] text-ink-400 num">
                      {wonShort(e)} / {wonShort(p)}
                    </p>
                  </div>
                </MCard>
              );
            })}
          </div>
        </MSection>
      ) : null}

      {/* 항목별 집행 */}
      <MSection title="항목별 집행">
        <MCard>
          <div className="divide-y divide-ink-100">
            {lines.map((b) => (
              <div key={b.id} className="px-3.5 py-3">
                <div className="flex items-center gap-2">
                  <MCompanyBadge company={b.company} />
                  <span className="flex-1 truncate text-[13px] font-medium text-ink-800">
                    {b.category}
                  </span>
                  <span className="shrink-0 text-[11.5px] text-ink-500 num">
                    {pct(b.executed, b.planned)}%
                  </span>
                </div>
                <div className="mt-2">
                  <MProgress value={pct(b.executed, b.planned)} tone={b.company} />
                </div>
                <p className="mt-1.5 text-[11px] text-ink-400 num">
                  집행 {wonShort(b.executed)} · 잔여 {wonShort(b.planned - b.executed)}
                </p>
              </div>
            ))}
          </div>
        </MCard>
      </MSection>

      {/* 최근 집행 */}
      <MSection title="최근 집행 내역" action={pending ? `승인 대기 ${pending}건` : undefined} actionHref="/approvals">
        <MList>
          {txs.map((t) => (
            <MRow
              key={t.id}
              meta={<MCompanyBadge company={t.company} />}
              title={t.title}
              sub={`${t.category} · ${t.date}`}
              wrapTitle
              chevron={false}
              trailing={
                <span className="flex flex-col items-end gap-1">
                  <span className="text-[13px] font-semibold text-ink-800 num">
                    {wonShort(t.amount)}
                  </span>
                  <MStatusBadge
                    status={t.status}
                    level={t.status === "승인 대기" ? "주의" : "안내"}
                  />
                </span>
              }
            />
          ))}
        </MList>
      </MSection>
    </>
  );
}

/* ── 더보기 ─────────────────────────────────── */

const MORE_GROUPS: {
  title: string;
  tone: "tailor" | "corp" | "ink";
  items: { label: string; href: string }[];
}[] = [
  {
    title: "경영 전반",
    tone: "ink",
    items: [
      { label: "회사별 매출", href: "/revenue" },
      { label: "자금 현황", href: "/finance" },
      { label: "승인 업무", href: "/approvals" },
      { label: "알림", href: "/notifications" },
      { label: "보고서", href: "/reports" },
    ],
  },
  {
    title: "비앤테일러샵",
    tone: "tailor",
    items: [
      { label: "운영 현황", href: "/tailor" },
      { label: "주문", href: "/tailor/orders" },
      { label: "원단 재고", href: "/tailor/fabrics" },
      { label: "제작·납기", href: "/tailor/production" },
      { label: "고객", href: "/tailor/customers" },
      { label: "매출", href: "/tailor/sales" },
    ],
  },
  {
    title: "AI 소프트웨어 법인",
    tone: "corp",
    items: [
      { label: "사업화 현황", href: "/ai" },
      { label: "프로젝트", href: "/ai/projects" },
      { label: "R&D 과제", href: "/ai/rnd" },
      { label: "인력", href: "/ai/people" },
      { label: "기술·데이터", href: "/ai/tech" },
      { label: "사업화·계약", href: "/ai/biz" },
    ],
  },
];

export function MobileMore() {
  const { go } = useMobileNav();
  return (
    <>
      <MCard>
        <div className="flex items-center gap-3 p-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-800 text-[15px] font-semibold text-white">
            김
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-ink-800">김상호 대표</p>
            <p className="mt-0.5 truncate text-[12px] text-ink-400">
              비앤테일러샵 · AI 소프트웨어 법인
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-ink-300" />
        </div>
        <div className="grid grid-cols-2 gap-px border-t border-ink-100 bg-ink-100">
          <button
            onClick={() => go("/companies")}
            className="bg-white px-3.5 py-3 text-left active:bg-ivory-100"
          >
            <p className="text-[11px] text-ink-400">관리 법인</p>
            <p className="mt-0.5 text-[15px] font-semibold text-ink-800 num">2개</p>
          </button>
          <button
            onClick={() => go("/notifications")}
            className="bg-white px-3.5 py-3 text-left active:bg-ivory-100"
          >
            <p className="text-[11px] text-ink-400">읽지 않은 알림</p>
            <p className="mt-0.5 text-[15px] font-semibold text-ink-800 num">4개</p>
          </button>
        </div>
      </MCard>

      {MORE_GROUPS.map((g) => (
        <MSection key={g.title} title={g.title}>
          <MList>
            {g.items.map((it) => (
              <MRow
                key={it.href}
                href={it.href}
                title={it.label}
                meta={
                  <span
                    className={cn(
                      "h-1.5 w-1.5 shrink-0 rounded-full",
                      g.tone === "tailor"
                        ? "bg-tailor-600"
                        : g.tone === "corp"
                          ? "bg-corp-700"
                          : "bg-ink-300",
                    )}
                  />
                }
              />
            ))}
          </MList>
        </MSection>
      ))}

      <p className="mt-6 pb-2 text-center text-[11px] text-ink-300">
        B&amp;AI Control · 데모 데이터 기준일 2026.07.29
      </p>
    </>
  );
}

"use client";

import { AlertTriangle, Banknote, CalendarDays, TrendingUp } from "lucide-react";
import { useApp } from "@/components/app-store";
import {
  MCompanyBadge,
  MCompanyCard,
  MList,
  MMiniGrid,
  MRow,
  MSection,
  MStat,
  MStatGrid,
  MStatusBadge,
  MTimeline,
  MTimelineItem,
} from "@/components/mobile/ui";
import {
  APPROVALS,
  APPROVAL_KINDS,
  SCHEDULES,
  SUMMARY,
  TODAY_URGENT,
} from "@/lib/data";
import { wonShort } from "@/lib/utils";

const TODAY_D = "2026.07.29";

export function MobileHome() {
  const { scope } = useApp();
  const showTailor = scope !== "corp";
  const showCorp = scope !== "tailor";

  const urgent = TODAY_URGENT.filter((u) => scope === "all" || u.company === scope);
  const todaySchedules = SCHEDULES.filter(
    (s) => s.date === TODAY_D && (scope === "all" || s.company === scope),
  );
  const approvals = APPROVALS.filter((a) => scope === "all" || a.company === scope);

  const todayRevenue =
    scope === "corp"
      ? SUMMARY.corp.todayRevenue
      : scope === "tailor"
        ? SUMMARY.tailor.todayRevenue
        : SUMMARY.tailor.todayRevenue + SUMMARY.corp.todayRevenue;

  const available =
    scope === "corp"
      ? SUMMARY.cash.corpAvailable
      : scope === "tailor"
        ? SUMMARY.cash.tailorAvailable
        : SUMMARY.cash.available;

  return (
    <>
      {/* 1. 인사말 */}
      <div className="mb-3.5 px-1">
        <p className="text-[18px] font-semibold leading-snug tracking-tight text-ink-900">
          대표자님, 오늘 확인할 업무가
          <br />
          <span className="text-tailor-700">{urgent.length}건</span> 있습니다.
        </p>
        <p className="mt-1 text-[12px] text-ink-400">2026년 7월 29일 수요일</p>
      </div>

      {/* 2. 오늘의 핵심 요약 */}
      <MStatGrid>
        <MStat
          label="오늘 매출"
          value={wonShort(todayRevenue)}
          hint={scope === "all" ? "양사 합산" : scope === "tailor" ? "비앤테일러샵" : "AI 법인"}
          href="/revenue"
          icon={<TrendingUp className="h-3 w-3" />}
        />
        <MStat
          label="가용자금"
          value={wonShort(available)}
          hint={`예상 지출 ${wonShort(SUMMARY.cash.plannedSpend)}`}
          href="/finance"
          icon={<Banknote className="h-3 w-3" />}
        />
        <MStat
          label="긴급업무"
          value={String(urgent.length)}
          unit="건"
          hint={`즉시 확인 ${urgent.filter((u) => u.level === "긴급").length}건`}
          href="/tasks"
          tone="alert"
          icon={<AlertTriangle className="h-3 w-3" />}
        />
        <MStat
          label="오늘 일정"
          value={String(todaySchedules.length)}
          unit="건"
          hint={todaySchedules[0] ? `다음 ${todaySchedules[0].time}` : "일정 없음"}
          href="/schedule"
          icon={<CalendarDays className="h-3 w-3" />}
        />
      </MStatGrid>

      {/* 3. 긴급 확인 업무 — 첫 화면에서 바로 보이도록 상단에 배치 */}
      <MSection title="긴급 확인 업무" action="전체 보기" actionHref="/tasks">
        <MList>
          {urgent.slice(0, 4).map((u) => (
            <MRow
              key={u.id}
              href={u.href}
              meta={<MCompanyBadge company={u.company} />}
              title={u.title}
              sub={u.detail}
              wrapTitle
              trailing={
                <span className="flex flex-col items-end gap-1">
                  <MStatusBadge status={u.status} level={u.level} />
                  <span className="text-[10.5px] text-ink-400">{u.at}</span>
                </span>
              }
              chevron={false}
            />
          ))}
        </MList>
      </MSection>

      {/* 4. 회사별 요약 */}
      <MSection title="회사별 현황">
        <div className="space-y-2.5">
          {showTailor ? (
            <MCompanyCard company="tailor" title="비앤테일러샵" href="/tailor">
              <MMiniGrid
                items={[
                  { label: "오늘 매출", value: wonShort(SUMMARY.tailor.todayRevenue) },
                  { label: "납품 예정", value: String(SUMMARY.tailor.delivery), unit: "건" },
                  {
                    label: "원단 부족",
                    value: String(SUMMARY.tailor.fabricAlert),
                    unit: "종",
                    alert: true,
                  },
                  {
                    label: "제작 지연",
                    value: String(SUMMARY.tailor.delayRisk),
                    unit: "건",
                    alert: true,
                  },
                ]}
              />
            </MCompanyCard>
          ) : null}

          {showCorp ? (
            <MCompanyCard company="corp" title="AI 소프트웨어 법인" href="/ai">
              <MMiniGrid
                items={[
                  { label: "진행 프로젝트", value: String(SUMMARY.corp.projects), unit: "개" },
                  {
                    label: "지연 이슈",
                    value: String(SUMMARY.corp.delayIssue),
                    unit: "건",
                    alert: true,
                  },
                  { label: "신규 계약", value: String(SUMMARY.corp.newContract), unit: "건" },
                  { label: "R&D 마감", value: String(SUMMARY.corp.rndDueSoon), unit: "건" },
                ]}
              />
            </MCompanyCard>
          ) : null}
        </div>
      </MSection>

      {/* 5. 오늘 일정 */}
      <MSection title="오늘 일정" action="전체 보기" actionHref="/schedule">
        <MTimeline>
          {todaySchedules.slice(0, 4).map((s, i, arr) => (
            <MTimelineItem
              key={s.id}
              time={s.time}
              title={s.title}
              sub={`${s.place} · ${s.owner}`}
              company={s.company}
              tag={s.kind}
              last={i === arr.length - 1}
              href="/schedule"
            />
          ))}
        </MTimeline>
      </MSection>

      {/* 6. 대표자 확인 필요 */}
      <MSection title="대표자 확인 필요" action="전체 보기" actionHref="/approvals">
        <MList>
          {APPROVAL_KINDS.map((kind) => {
            const count = approvals.filter((a) => a.kind === kind).length;
            if (count === 0) return null;
            return (
              <MRow
                key={kind}
                href="/approvals"
                title={kind}
                trailing={
                  <span className="text-[15px] font-semibold text-ink-800 num">
                    {count}
                    <span className="ml-0.5 text-[11px] font-normal text-ink-400">건</span>
                  </span>
                }
              />
            );
          })}
        </MList>
      </MSection>
    </>
  );
}

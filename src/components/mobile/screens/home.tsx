"use client";

import { AlertTriangle, CalendarDays, ClipboardCheck, Truck } from "lucide-react";
import { useApp } from "@/components/app-store";
import { useMobileNav } from "@/components/mobile/nav-context";
import {
  MActionGrid,
  MActionTile,
  MCompanyBadge,
  MCompanyCard,
  MList,
  MMiniGrid,
  MMoneyRow,
  MRow,
  MSection,
  MTimeline,
  MTimelineItem,
} from "@/components/mobile/ui";
import { APPROVALS, APPROVAL_KINDS, SCHEDULES, SUMMARY, TODAY_URGENT } from "@/lib/data";
import { wonShort } from "@/lib/utils";

const TODAY_D = "2026.07.29";

export function MobileHome() {
  const { scope } = useApp();
  const { go } = useMobileNav();
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

  const accent = scope === "corp" ? "corp" : "tailor";

  return (
    <>
      {/* 1. 오늘의 실행 */}
      <div className="mb-4">
        <h1 className="text-[23px] font-bold leading-tight tracking-tight text-ink-900">
          오늘의 실행
        </h1>
        <p className="mt-1.5 text-[14px] text-ink-400">
          2026년 7월 29일 (수) · 확인할 업무{" "}
          <span className={accent === "corp" ? "text-corp-700" : "text-tailor-700"}>
            {urgent.length}건
          </span>
        </p>
      </div>

      {/* 2. 실행 액션 */}
      <MActionGrid>
        <MActionTile
          label="긴급 업무"
          count={urgent.length}
          unit="건"
          action="확인하기"
          href="/tasks"
          tone={accent}
          icon={<AlertTriangle className="h-[18px] w-[18px]" />}
        />
        <MActionTile
          label="승인 대기"
          count={approvals.length}
          unit="건"
          action="결재하기"
          href="/approvals"
          tone={accent}
          icon={<ClipboardCheck className="h-[18px] w-[18px]" />}
        />
        <MActionTile
          label="납품 예정"
          count={SUMMARY.tailor.delivery}
          unit="건"
          action="일정 보기"
          href="/tailor/orders"
          tone={accent}
          icon={<Truck className="h-[18px] w-[18px]" />}
        />
        <MActionTile
          label="오늘 일정"
          count={todaySchedules.length}
          unit="건"
          action="일정 확인"
          href="/schedule"
          tone={accent}
          icon={<CalendarDays className="h-[18px] w-[18px]" />}
        />
      </MActionGrid>

      {/* 3. 오늘 매출 · 가용자금 */}
      <div className="mt-3">
        <MMoneyRow
          items={[
            { label: "오늘 매출", value: wonShort(todayRevenue), href: "/revenue" },
            { label: "가용자금", value: wonShort(available), href: "/finance" },
          ]}
        />
      </div>

      {/* 4. 긴급 확인 업무 */}
      <MSection title={`긴급 확인 업무 ${urgent.length}건`} action="전체보기" actionHref="/tasks">
        <MList>
          {urgent.slice(0, 4).map((u) => (
            <MRow
              key={u.id}
              title={u.title}
              wrapTitle
              meta={<MCompanyBadge company={u.company} />}
              sub={u.detail}
              action={{ label: "확인하기", onPress: () => go(u.href), tone: u.company }}
            />
          ))}
        </MList>
      </MSection>

      {/* 5. 회사별 현황 */}
      <MSection title="회사별 현황">
        <div className="space-y-3">
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

      {/* 6. 오늘 일정 */}
      <MSection
        title={`오늘 일정 ${todaySchedules.length}건`}
        action="전체보기"
        actionHref="/schedule"
      >
        <MTimeline>
          {todaySchedules.slice(0, 4).map((s, i, arr) => (
            <MTimelineItem
              key={s.id}
              time={s.time}
              title={s.title}
              sub={s.owner}
              company={s.company}
              tag={s.kind}
              last={i === arr.length - 1}
              href="/schedule"
            />
          ))}
        </MTimeline>
      </MSection>

      {/* 7. 대표자 확인 필요 */}
      <MSection title="대표자 확인 필요" action="전체보기" actionHref="/approvals">
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
                  <span className="text-[19px] font-bold text-ink-800 num">
                    {count}
                    <span className="ml-0.5 text-[13px] font-normal text-ink-400">건</span>
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

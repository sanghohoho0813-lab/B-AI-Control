"use client";

import * as React from "react";
import { useApp } from "@/components/app-store";
import { useMobileNav } from "@/components/mobile/nav-context";
import {
  MCard,
  MChips,
  MCompanyBadge,
  MCompanyCard,
  MEmpty,
  MList,
  MMiniGrid,
  MProgress,
  MRow,
  MSection,
  MStat,
  MStatGrid,
  MStatusBadge,
} from "@/components/mobile/ui";
import {
  AI_PROJECTS,
  ALERTS,
  APPROVALS,
  APPROVAL_KINDS,
  COMPANIES,
  CORP_REVENUE_MIX,
  DATA_ASSETS,
  DEALS,
  FABRICS,
  MEMBERS,
  PRODUCTION_JOBS,
  REPORTS,
  REVENUE_TREND,
  RND_TASKS,
  SUMMARY,
  TAILOR_CUSTOMERS,
  TAILOR_ORDERS,
  TAILOR_REVENUE_MIX,
} from "@/lib/data";
import { cn, colorOf, pct, won, wonShort } from "@/lib/utils";
import type { CompanyId } from "@/lib/types";

/* ── 모바일 전용 미니 추이 (데스크톱 차트를 축소하지 않고 별도 구성) ── */

function MTrend({
  data,
  tone,
  label,
}: {
  data: { month: string; value: number }[];
  tone: CompanyId;
  label: string;
}) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <MCard>
      <div className="p-3.5">
        <p className="text-[12px] text-ink-500">{label}</p>
        <div className="mt-3 flex items-end gap-1.5" style={{ height: 76 }}>
          {data.map((d, i) => (
            <div key={d.month} className="flex flex-1 flex-col items-center gap-1.5">
              <span
                className={cn(
                  "w-full rounded-t-[3px]",
                  tone === "tailor" ? "bg-tailor-600" : "bg-corp-700",
                  i === data.length - 1 ? "opacity-100" : "opacity-30",
                )}
                style={{ height: Math.max(4, (d.value / max) * 60) }}
              />
              <span className="text-[10px] text-ink-400">{d.month}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 border-t border-ink-100 pt-2 text-[11.5px] text-ink-400 num">
          최근 6개월 · 이번 달 {wonShort(data[data.length - 1].value)}
        </p>
      </div>
    </MCard>
  );
}

function MMix({
  data,
  tone,
  total,
}: {
  data: { name: string; value: number }[];
  tone: CompanyId;
  total: number;
}) {
  return (
    <MCard>
      <div className="divide-y divide-ink-100">
        {data.map((d) => (
          <div key={d.name} className="px-3.5 py-2.5">
            <div className="flex items-center gap-2">
              <span className="flex-1 truncate text-[13px] text-ink-700">{d.name}</span>
              <span className="shrink-0 text-[12.5px] font-semibold text-ink-800 num">
                {wonShort(d.value)}
              </span>
              <span className="w-9 shrink-0 text-right text-[11px] text-ink-400 num">
                {pct(d.value, total)}%
              </span>
            </div>
            <div className="mt-1.5">
              <MProgress value={pct(d.value, total)} tone={tone} />
            </div>
          </div>
        ))}
      </div>
    </MCard>
  );
}

/* ── 승인 업무 ──────────────────────────────── */

export function MobileApprovals() {
  const { scope } = useApp();
  const [kind, setKind] = React.useState("전체");
  const all = APPROVALS.filter((a) => scope === "all" || a.company === scope);
  const items = all.filter((a) => kind === "전체" || a.kind === kind);
  const [done, setDone] = React.useState<Record<string, "승인" | "보류">>({});

  return (
    <>
      <MStatGrid>
        <MStat label="승인 대기" value={String(all.length)} unit="건" hint="대표자 결재" tone="alert" />
        <MStat
          label="집행 요청 금액"
          value={wonShort(all.reduce((s, a) => s + (a.amount ?? 0), 0))}
          hint="자금 집행 · 주문"
        />
      </MStatGrid>

      <MSection className="mt-4">
        <MChips items={["전체", ...APPROVAL_KINDS]} value={kind} onChange={setKind} tone="ink" />
      </MSection>

      <MSection title={`${items.length}건`} className="mt-3">
        {items.length === 0 ? (
          <MEmpty text="해당 조건의 승인 업무가 없습니다." />
        ) : (
          <div className="space-y-2.5">
            {items.map((a) => (
              <MCard key={a.id}>
                <div className="p-3.5">
                  <div className="flex items-center gap-1.5">
                    <MCompanyBadge company={a.company} />
                    <span className="rounded-[5px] bg-ink-100 px-1.5 py-[3px] text-[10.5px] font-medium leading-none text-ink-500">
                      {a.kind}
                    </span>
                    <span className="ml-auto text-[10.5px] text-ink-400">{a.at}</span>
                  </div>
                  <p className="mt-2 text-[14px] font-semibold leading-snug text-ink-800">
                    {a.title}
                  </p>
                  <p className="mt-1 text-[12px] text-ink-400">{a.detail}</p>
                  {a.amount ? (
                    <p className="mt-2 text-[17px] font-semibold text-ink-900 num">
                      {won(a.amount)}
                    </p>
                  ) : null}
                  <p className="mt-1.5 text-[11px] text-ink-400">요청 {a.requestedBy}</p>
                </div>
                {done[a.id] ? (
                  <div
                    className={cn(
                      "border-t border-ink-100 px-3.5 py-3 text-center text-[13px] font-medium",
                      done[a.id] === "승인" ? "text-emerald-600" : "text-ink-500",
                    )}
                  >
                    {done[a.id]} 처리되었습니다
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-px border-t border-ink-100 bg-ink-100">
                    <button
                      onClick={() => setDone((p) => ({ ...p, [a.id]: "보류" }))}
                      className="bg-white py-3 text-[13px] font-medium text-ink-500 active:bg-ivory-100"
                    >
                      보류
                    </button>
                    <button
                      onClick={() => setDone((p) => ({ ...p, [a.id]: "승인" }))}
                      className={cn(
                        "py-3 text-[13px] font-medium text-white",
                        a.company === "tailor" ? "bg-tailor-600" : "bg-corp-700",
                      )}
                    >
                      승인
                    </button>
                  </div>
                )}
              </MCard>
            ))}
          </div>
        )}
      </MSection>
    </>
  );
}

/* ── 회사별 매출 ────────────────────────────── */

export function MobileRevenue() {
  const { scope } = useApp();
  const showTailor = scope !== "corp";
  const showCorp = scope !== "tailor";
  const total = SUMMARY.tailor.revenue + SUMMARY.corp.revenue;

  return (
    <>
      <MStatGrid>
        <MStat
          label={scope === "all" ? "양사 합산 매출" : "이번 달 매출"}
          value={wonShort(
            scope === "tailor"
              ? SUMMARY.tailor.revenue
              : scope === "corp"
                ? SUMMARY.corp.revenue
                : total,
          )}
          hint="2026년 7월"
        />
        <MStat
          label="미수금"
          value={wonShort(
            scope === "tailor"
              ? SUMMARY.tailor.receivable
              : scope === "corp"
                ? SUMMARY.corp.receivable
                : SUMMARY.tailor.receivable + SUMMARY.corp.receivable,
          )}
          hint="정산 대기"
          tone="alert"
        />
      </MStatGrid>

      {showTailor ? (
        <MSection title="비앤테일러샵">
          <div className="space-y-2.5">
            <MCompanyCard company="tailor" title="이번 달 매출" href="/tailor/sales">
              <MMiniGrid
                items={[
                  { label: "이번 달", value: wonShort(SUMMARY.tailor.revenue) },
                  { label: "전월 대비", value: `+${SUMMARY.tailor.revenueDelta}`, unit: "%" },
                  { label: "주문", value: String(SUMMARY.tailor.orderCount), unit: "건" },
                  { label: "평균 단가", value: wonShort(SUMMARY.tailor.avgOrderValue) },
                ]}
              />
            </MCompanyCard>
            <MTrend
              data={REVENUE_TREND.map((r) => ({ month: r.month, value: r.tailor }))}
              tone="tailor"
              label="비앤테일러샵 매출 추이"
            />
            <MMix data={TAILOR_REVENUE_MIX} tone="tailor" total={SUMMARY.tailor.revenue} />
          </div>
        </MSection>
      ) : null}

      {showCorp ? (
        <MSection title="AI 소프트웨어 법인">
          <div className="space-y-2.5">
            <MCompanyCard company="corp" title="이번 달 매출" href="/ai/sales">
              <MMiniGrid
                items={[
                  { label: "이번 달", value: wonShort(SUMMARY.corp.revenue) },
                  { label: "전월 대비", value: `+${SUMMARY.corp.revenueDelta}`, unit: "%" },
                  { label: "유료 계약", value: String(SUMMARY.corp.paid), unit: "건" },
                  {
                    label: "월 반복 매출",
                    value: wonShort(DEALS.reduce((s, d) => s + d.monthly, 0)),
                  },
                ]}
              />
            </MCompanyCard>
            <MTrend
              data={REVENUE_TREND.map((r) => ({ month: r.month, value: r.corp }))}
              tone="corp"
              label="AI 법인 매출 추이"
            />
            <MMix data={CORP_REVENUE_MIX} tone="corp" total={SUMMARY.corp.revenue} />
          </div>
        </MSection>
      ) : null}
    </>
  );
}

/* ── 알림 ───────────────────────────────────── */

export function MobileAlerts() {
  const { scope, alerts, markRead, markAllRead, unread } = useApp();
  const { go } = useMobileNav();
  const [level, setLevel] = React.useState("전체");
  const items = alerts.filter(
    (a) => (scope === "all" || a.company === scope) && (level === "전체" || a.level === level),
  );

  return (
    <>
      <MStatGrid>
        <MStat label="읽지 않음" value={String(unread)} unit="건" tone="alert" />
        <MStat label="전체 알림" value={String(alerts.length)} unit="건" />
      </MStatGrid>

      <MSection className="mt-4">
        <MChips items={["전체", "긴급", "주의", "안내"]} value={level} onChange={setLevel} tone="ink" />
      </MSection>

      <MSection className="mt-3">
        <button
          onClick={markAllRead}
          className="mb-2 w-full rounded-[12px] border border-ink-200 bg-white py-2.5 text-[12.5px] font-medium text-ink-600 active:bg-ivory-100"
        >
          모두 읽음 처리
        </button>
        {items.length === 0 ? (
          <MEmpty text="해당 조건의 알림이 없습니다." />
        ) : (
          <div className="space-y-2.5">
            {items.map((a) => (
              <MCard key={a.id} className={cn(!a.read && "border-ink-300")}>
                <button
                  onClick={() => {
                    markRead(a.id);
                    go(a.href);
                  }}
                  className="block w-full p-3.5 text-left active:bg-ivory-100"
                >
                  <span className="flex items-center gap-1.5">
                    <MCompanyBadge company={a.company} />
                    <MStatusBadge
                      status={a.level}
                      level={a.level === "긴급" ? "긴급" : a.level === "주의" ? "주의" : "안내"}
                    />
                    <span className="text-[10.5px] text-ink-400">{a.category}</span>
                    <span className="ml-auto text-[10.5px] text-ink-400">{a.at}</span>
                  </span>
                  <span
                    className={cn(
                      "mt-2 block text-[13.5px] leading-snug",
                      a.read ? "text-ink-600" : "font-semibold text-ink-800",
                    )}
                  >
                    {a.title}
                  </span>
                  <span className="mt-1 block text-[12px] leading-relaxed text-ink-400">
                    {a.detail}
                  </span>
                </button>
              </MCard>
            ))}
          </div>
        )}
      </MSection>
    </>
  );
}

/* ── 비앤테일러샵 운영 ──────────────────────── */

export function MobileTailorHome() {
  const S = SUMMARY.tailor;
  return (
    <>
      <MStatGrid>
        <MStat label="이번 달 매출" value={wonShort(S.revenue)} hint={`전월 대비 +${S.revenueDelta}%`} />
        <MStat label="오늘 매출" value={wonShort(S.todayRevenue)} hint="2026.07.29" />
        <MStat label="원단 부족" value={String(S.fabricAlert)} unit="종" tone="alert" href="/tailor/fabrics" />
        <MStat label="제작 지연" value={String(S.delayRisk)} unit="건" tone="alert" href="/tailor/production" />
      </MStatGrid>

      <MSection title="운영 현황">
        <MList>
          <MRow href="/tailor/customers" title="신규 상담" trailing={<Count v={S.newConsult} unit="건" />} />
          <MRow href="/tailor/orders" title="주문 접수" trailing={<Count v={S.orderCount} unit="건" />} />
          <MRow href="/tailor/production" title="제작 진행" trailing={<Count v={S.inProduction} unit="건" />} />
          <MRow href="/tailor/production" title="가봉 예정" trailing={<Count v={S.fittingCount} unit="건" />} />
          <MRow href="/tailor/orders" title="납품 예정" trailing={<Count v={S.delivery} unit="건" />} />
          <MRow href="/tailor/analytics" title="재구매 추천 고객" trailing={<Count v={S.repurchase} unit="명" />} />
        </MList>
      </MSection>

      <MSection title="미수금">
        <MCard>
          <div className="p-3.5">
            <p className="text-[12px] text-ink-500">회수 대기 금액</p>
            <p className="mt-1.5 text-[23px] font-semibold leading-none text-ink-900 num">
              {won(S.receivable)}
            </p>
            <p className="mt-1.5 text-[11.5px] text-ink-400">30일 초과 3건 포함</p>
          </div>
          <MRow href="/tailor/sales" title="매출·수금 상세" />
        </MCard>
      </MSection>

      <MSection title="바로 가기">
        <MList>
          <MRow href="/tailor/orders" title="주문" />
          <MRow href="/tailor/fabrics" title="원단 재고" />
          <MRow href="/tailor/production" title="제작·납기" />
          <MRow href="/tailor/customers" title="고객" />
        </MList>
      </MSection>
    </>
  );
}

function Count({ v, unit }: { v: number; unit: string }) {
  return (
    <span className="text-[15px] font-semibold text-ink-800 num">
      {v}
      <span className="ml-0.5 text-[11px] font-normal text-ink-400">{unit}</span>
    </span>
  );
}

/* ── AI 법인 사업화 ─────────────────────────── */

export function MobileAiHome() {
  const S = SUMMARY.corp;
  const pipeline = DEALS.filter((d) => d.status !== "계약 완료").reduce((s, d) => s + d.amount, 0);
  return (
    <>
      <MStatGrid>
        <MStat label="이번 달 매출" value={wonShort(S.revenue)} hint={`전월 대비 +${S.revenueDelta}%`} />
        <MStat label="진행 프로젝트" value={String(S.projects)} unit="개" href="/ai/projects" />
        <MStat label="지연 이슈" value={String(S.delayIssue)} unit="건" tone="alert" href="/ai/projects" />
        <MStat label="파이프라인" value={wonShort(pipeline)} hint="계약 예정" href="/ai/biz" />
      </MStatGrid>

      <MSection title="사업화 현황">
        <MList>
          <MRow href="/ai/biz" title="PoC 고객" trailing={<Count v={S.poc} unit="개사" />} />
          <MRow href="/ai/biz" title="유료 계약" trailing={<Count v={S.paid} unit="건" />} />
          <MRow href="/ai/biz" title="이번 달 신규 계약" trailing={<Count v={S.newContract} unit="건" />} />
          <MRow href="/ai/rnd" title="R&D 과제" trailing={<Count v={S.rnd} unit="개" />} />
          <MRow href="/ai/people" title="개발 인력" trailing={<Count v={S.headcount} unit="명" />} />
        </MList>
      </MSection>

      <MSection title="이번 달 개발비">
        <MCard>
          <div className="p-3.5">
            <p className="text-[12px] text-ink-500">집행 금액</p>
            <p className="mt-1.5 text-[23px] font-semibold leading-none text-ink-900 num">
              {won(S.devCost)}
            </p>
            <p className="mt-1.5 text-[11.5px] text-ink-400">인건비 · 클라우드 · 데이터 구축 포함</p>
          </div>
          <MRow href="/finance" title="자금 집행 상세" />
        </MCard>
      </MSection>

      <MSection title="바로 가기">
        <MList>
          <MRow href="/ai/projects" title="프로젝트" />
          <MRow href="/ai/rnd" title="R&D 과제" />
          <MRow href="/ai/people" title="인력" />
          <MRow href="/ai/biz" title="사업화·계약" />
        </MList>
      </MSection>
    </>
  );
}

/* ── 주문 ───────────────────────────────────── */

export function MobileOrders() {
  const [stage, setStage] = React.useState("전체");
  const stages = ["전체", "상담", "치수 측정", "원단 선택", "제작", "가봉", "수정", "납품"];
  const items = TAILOR_ORDERS.filter((o) => stage === "전체" || o.stage === stage);

  return (
    <>
      <MStatGrid>
        <MStat label="진행 중 주문" value={String(TAILOR_ORDERS.length)} unit="건" />
        <MStat
          label="잔금 합계"
          value={wonShort(TAILOR_ORDERS.reduce((s, o) => s + (o.amount - o.deposit), 0))}
          hint="계약금 제외"
        />
      </MStatGrid>

      <MSection className="mt-4">
        <MChips items={stages} value={stage} onChange={setStage} />
      </MSection>

      <MSection title={`${items.length}건`} className="mt-3">
        {items.length === 0 ? (
          <MEmpty text="해당 단계의 주문이 없습니다." />
        ) : (
          <div className="space-y-2.5">
            {items.map((o) => (
              <MCard key={o.id}>
                <div className="p-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-[5px] bg-tailor-50 px-1.5 py-[3px] text-[10.5px] font-semibold leading-none text-tailor-700">
                      {o.stage}
                    </span>
                    <MStatusBadge
                      status={o.status}
                      level={o.status === "지연" ? "긴급" : o.status === "지연 위험" ? "주의" : "안내"}
                    />
                    <span className="ml-auto text-[10.5px] text-ink-400 num">{o.id}</span>
                  </div>
                  <p className="mt-2 text-[14px] font-semibold text-ink-800">
                    {o.customer} 님 · {o.item}
                  </p>
                  <p className="mt-1 truncate text-[12px] text-ink-400">{o.fabric}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 border-t border-ink-100 pt-2.5">
                    <div>
                      <p className="text-[10.5px] text-ink-400">주문 금액</p>
                      <p className="mt-0.5 text-[13px] font-semibold text-ink-800 num">
                        {wonShort(o.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10.5px] text-ink-400">잔금</p>
                      <p className="mt-0.5 text-[13px] font-semibold text-ink-800 num">
                        {wonShort(o.amount - o.deposit)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10.5px] text-ink-400">납기</p>
                      <p className="mt-0.5 text-[13px] font-semibold text-ink-800 num">
                        {o.dueAt.slice(5)}
                      </p>
                    </div>
                  </div>
                </div>
              </MCard>
            ))}
          </div>
        )}
      </MSection>
    </>
  );
}

/* ── 원단 재고 ──────────────────────────────── */

export function MobileFabrics() {
  const [status, setStatus] = React.useState("전체");
  const items = FABRICS.filter((f) => status === "전체" || f.status === status);

  return (
    <>
      <MStatGrid>
        <MStat
          label="재고 부족"
          value={String(FABRICS.filter((f) => f.status === "재고 부족").length)}
          unit="종"
          tone="alert"
        />
        <MStat
          label="발주 권장"
          value={String(FABRICS.filter((f) => f.status === "발주 권장").length)}
          unit="종"
        />
      </MStatGrid>

      <MSection className="mt-4">
        <MChips
          items={["전체", "재고 부족", "발주 권장", "발주 완료", "충분"]}
          value={status}
          onChange={setStatus}
        />
      </MSection>

      <MSection title={`${items.length}종`} className="mt-3">
        <div className="space-y-2.5">
          {items.map((f) => {
            const remain = f.stockM - f.assignedM;
            return (
              <MCard key={f.id}>
                <div className="flex items-start gap-3 p-3.5">
                  <span
                    className="mt-0.5 h-11 w-11 shrink-0 rounded-[8px] border border-ink-200"
                    style={{ background: colorOf(f.color) }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-ink-800">
                        {f.brand}
                      </p>
                      <MStatusBadge
                        status={f.status}
                        level={
                          f.status === "재고 부족" ? "긴급" : f.status === "발주 권장" ? "주의" : "안내"
                        }
                      />
                    </div>
                    <p className="mt-0.5 truncate text-[12px] text-ink-400">
                      {f.name} · {f.color}
                    </p>
                    <div className="mt-2.5">
                      <MProgress value={pct(f.assignedM, f.stockM)} tone="tailor" />
                    </div>
                    <p className="mt-1.5 text-[11.5px] text-ink-400 num">
                      재고 {f.stockM.toFixed(1)}m · 배정 {f.assignedM.toFixed(1)}m ·{" "}
                      <span className={remain < 1.5 ? "font-medium text-rose-600" : "text-ink-600"}>
                        잔여 {remain.toFixed(1)}m
                      </span>
                    </p>
                  </div>
                </div>
              </MCard>
            );
          })}
        </div>
      </MSection>
    </>
  );
}

/* ── 제작·납기 ──────────────────────────────── */

export function MobileProduction() {
  return (
    <>
      <MStatGrid>
        <MStat label="제작 진행" value={String(SUMMARY.tailor.inProduction)} unit="건" hint="공방 작업 중" />
        <MStat label="지연 위험" value={String(SUMMARY.tailor.delayRisk)} unit="건" tone="alert" />
      </MStatGrid>

      <MSection title={`관리 대상 ${PRODUCTION_JOBS.length}건`}>
        <div className="space-y-2.5">
          {PRODUCTION_JOBS.map((j) => (
            <MCard key={j.id}>
              <div className="p-3.5">
                <div className="flex items-center gap-1.5">
                  <span className="rounded-[5px] bg-tailor-50 px-1.5 py-[3px] text-[10.5px] font-semibold leading-none text-tailor-700">
                    {j.stage}
                  </span>
                  <MStatusBadge
                    status={j.status}
                    level={j.status === "지연" ? "긴급" : j.status === "지연 위험" ? "주의" : "안내"}
                  />
                  <span className="ml-auto text-[10.5px] text-ink-400 num">
                    납기 {j.dueAt.slice(5)}
                    {j.riskDays > 0 ? (
                      <span className="ml-1 font-medium text-rose-600">+{j.riskDays}일</span>
                    ) : null}
                  </span>
                </div>
                <p className="mt-2 text-[14px] font-semibold text-ink-800">
                  {j.customer} 님 · {j.item}
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <MProgress value={j.progress} tone="tailor" />
                  <span className="shrink-0 text-[12px] font-medium text-ink-600 num">
                    {j.progress}%
                  </span>
                </div>
                <p className="mt-1.5 text-[11.5px] text-ink-400">
                  {j.worker} · {j.orderId}
                </p>
              </div>
            </MCard>
          ))}
        </div>
      </MSection>
    </>
  );
}

/* ── 고객 ───────────────────────────────────── */

export function MobileCustomers() {
  const [grade, setGrade] = React.useState("전체");
  const items = TAILOR_CUSTOMERS.filter((c) => grade === "전체" || c.grade === grade);

  return (
    <>
      <MStatGrid>
        <MStat label="관리 고객" value={String(TAILOR_CUSTOMERS.length)} unit="명" />
        <MStat label="재구매 추천" value={String(SUMMARY.tailor.repurchase)} unit="명" hint="구매 주기 도래" />
      </MStatGrid>

      <MSection className="mt-4">
        <MChips items={["전체", "VIP", "우수", "신규", "일반"]} value={grade} onChange={setGrade} />
      </MSection>

      <MSection title={`${items.length}명`} className="mt-3">
        <MList>
          {items.map((c) => (
            <MRow
              key={c.id}
              leading={
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-tailor-50 text-[13px] font-semibold text-tailor-700">
                  {c.name.slice(0, 1)}
                </span>
              }
              title={c.name}
              sub={`${c.company} · ${c.visits}회 방문`}
              meta={
                <span className="rounded-[5px] bg-ink-100 px-1.5 py-[3px] text-[10.5px] font-medium leading-none text-ink-500">
                  {c.grade}
                </span>
              }
              trailing={
                <span className="flex flex-col items-end">
                  <span className="text-[13px] font-semibold text-ink-800 num">
                    {wonShort(c.totalAmount)}
                  </span>
                  <span className="text-[10.5px] text-ink-400 num">추천도 {c.repurchaseScore}</span>
                </span>
              }
              chevron={false}
            />
          ))}
        </MList>
      </MSection>
    </>
  );
}

/* ── 프로젝트 ───────────────────────────────── */

export function MobileProjects() {
  const [phase, setPhase] = React.useState("전체");
  const phases = ["전체", "아이디어", "기획", "MVP", "PoC", "유료화", "반복 판매"];
  const items = AI_PROJECTS.filter((p) => phase === "전체" || p.phase === phase);

  return (
    <>
      <MStatGrid>
        <MStat label="진행 프로젝트" value={String(AI_PROJECTS.length)} unit="개" />
        <MStat
          label="지연 이슈"
          value={String(AI_PROJECTS.filter((p) => p.issue).length)}
          unit="건"
          tone="alert"
        />
      </MStatGrid>

      <MSection className="mt-4">
        <MChips items={phases} value={phase} onChange={setPhase} tone="corp" />
      </MSection>

      <MSection title={`${items.length}개`} className="mt-3">
        {items.length === 0 ? (
          <MEmpty text="해당 단계의 프로젝트가 없습니다." />
        ) : (
          <div className="space-y-2.5">
            {items.map((p) => (
              <MCard key={p.id}>
                <div className="p-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-[5px] bg-corp-50 px-1.5 py-[3px] text-[10.5px] font-semibold leading-none text-corp-700">
                      {p.phase}
                    </span>
                    <MStatusBadge
                      status={p.status}
                      level={p.status === "지연" ? "긴급" : p.status === "주의" ? "주의" : "안내"}
                    />
                    <span className="ml-auto text-[10.5px] text-ink-400 num">{p.dueAt}</span>
                  </div>
                  <p className="mt-2 text-[14px] font-semibold leading-snug text-ink-800">{p.name}</p>
                  <p className="mt-1 truncate text-[12px] text-ink-400">
                    {p.owner} · {p.client}
                  </p>
                  <div className="mt-2.5 space-y-2">
                    <div className="flex items-center gap-2">
                      <MProgress value={p.progress} tone="corp" />
                      <span className="w-[68px] shrink-0 text-right text-[11px] text-ink-500 num">
                        개발 {p.progress}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MProgress value={pct(p.spent, p.budget)} tone="corp" />
                      <span className="w-[68px] shrink-0 text-right text-[11px] text-ink-500 num">
                        집행 {pct(p.spent, p.budget)}%
                      </span>
                    </div>
                  </div>
                  <p className="mt-2.5 border-t border-ink-100 pt-2 text-[11.5px] text-ink-500">
                    다음 · {p.nextMilestone}
                  </p>
                  {p.issue ? (
                    <p className="mt-1 text-[11.5px] text-rose-600">이슈 · {p.issue}</p>
                  ) : null}
                </div>
              </MCard>
            ))}
          </div>
        )}
      </MSection>
    </>
  );
}

/* ── R&D ────────────────────────────────────── */

export function MobileRnd() {
  const budget = RND_TASKS.reduce((s, r) => s + r.budget, 0);
  const spent = RND_TASKS.reduce((s, r) => s + r.spent, 0);
  return (
    <>
      <MStatGrid>
        <MStat label="진행 과제" value={String(RND_TASKS.length)} unit="개" />
        <MStat label="연구비 집행률" value={`${pct(spent, budget)}`} unit="%" hint={wonShort(spent)} />
      </MStatGrid>

      <MSection title={`R&D 과제 ${RND_TASKS.length}개`}>
        <div className="space-y-2.5">
          {RND_TASKS.map((r) => (
            <MCard key={r.id}>
              <div className="p-3.5">
                <div className="flex items-center gap-1.5">
                  <span className="rounded-[5px] bg-corp-50 px-1.5 py-[3px] text-[10.5px] font-semibold leading-none text-corp-700">
                    {r.category}
                  </span>
                  <MStatusBadge status={r.status} level={r.status === "주의" ? "주의" : "안내"} />
                  <span className="ml-auto text-[10.5px] text-ink-400 num">{r.dueAt}</span>
                </div>
                <p className="mt-2 text-[13.5px] font-semibold leading-snug text-ink-800">
                  {r.title}
                </p>
                <p className="mt-1 text-[12px] text-ink-400">
                  {r.agency} · {r.owner}
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <MProgress value={r.progress} tone="corp" />
                  <span className="shrink-0 text-[12px] font-medium text-ink-600 num">
                    {r.progress}%
                  </span>
                </div>
                <p className="mt-1.5 text-[11.5px] text-ink-400 num">
                  {wonShort(r.spent)} / {wonShort(r.budget)} · {r.output}
                </p>
              </div>
            </MCard>
          ))}
        </div>
      </MSection>
    </>
  );
}

/* ── 인력 ───────────────────────────────────── */

export function MobilePeople() {
  const cost = MEMBERS.reduce((s, m) => s + m.monthlyCost, 0);
  return (
    <>
      <MStatGrid>
        <MStat label="전체 인원" value={String(SUMMARY.corp.headcount)} unit="명" />
        <MStat label="월 인건비" value={wonShort(cost)} hint={`핵심 인력 ${MEMBERS.length}명`} />
      </MStatGrid>

      <MSection title="핵심 인력">
        <MList>
          {MEMBERS.map((m) => (
            <MRow
              key={m.id}
              leading={
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-corp-50 text-[13px] font-semibold text-corp-700">
                  {m.name.slice(0, 1)}
                </span>
              }
              title={m.name}
              sub={`${m.role} · ${m.projects.length}개 프로젝트`}
              wrapTitle
              meta={
                <span className="rounded-[5px] bg-ink-100 px-1.5 py-[3px] text-[10.5px] font-medium leading-none text-ink-500">
                  {m.level}
                </span>
              }
              trailing={
                <span className="flex flex-col items-end">
                  <span className="text-[13px] font-semibold text-ink-800 num">
                    {wonShort(m.monthlyCost)}
                  </span>
                  <span className="text-[10.5px] text-ink-400 num">투입 {m.allocation}%</span>
                </span>
              }
              chevron={false}
            />
          ))}
        </MList>
      </MSection>
    </>
  );
}

/* ── 기술·데이터 ────────────────────────────── */

export function MobileTech() {
  return (
    <>
      <MStatGrid>
        <MStat label="데이터 자산" value={String(DATA_ASSETS.length)} unit="건" />
        <MStat
          label="지식재산권"
          value={String(DATA_ASSETS.filter((d) => d.type === "지식재산권").length)}
          unit="건"
          hint="출원 진행"
        />
      </MStatGrid>
      <MSection title="기술 · 데이터 자산">
        <MList>
          {DATA_ASSETS.map((d) => (
            <MRow
              key={d.id}
              title={d.name}
              sub={`${d.type} · ${d.owner}`}
              meta={null}
              wrapTitle
              chevron={false}
              trailing={
                <span className="flex flex-col items-end gap-1">
                  <span className="text-[12px] font-semibold text-ink-800 num">{d.scale}</span>
                  <MStatusBadge status={d.status} level={d.status === "검증 중" ? "주의" : "안내"} />
                </span>
              }
            />
          ))}
        </MList>
      </MSection>
    </>
  );
}

/* ── 사업화·계약 ────────────────────────────── */

export function MobileBiz() {
  const pipeline = DEALS.filter((d) => d.status !== "계약 완료").reduce((s, d) => s + d.amount, 0);
  return (
    <>
      <MStatGrid>
        <MStat label="유료 계약" value={String(SUMMARY.corp.paid)} unit="건" />
        <MStat label="파이프라인" value={wonShort(pipeline)} hint={`${DEALS.length}개사`} />
      </MStatGrid>

      <MSection title="고객사 · 계약">
        <div className="space-y-2.5">
          {DEALS.map((d) => (
            <MCard key={d.id}>
              <div className="p-3.5">
                <div className="flex items-center gap-1.5">
                  <span className="rounded-[5px] bg-corp-50 px-1.5 py-[3px] text-[10.5px] font-semibold leading-none text-corp-700">
                    {d.phase}
                  </span>
                  <MStatusBadge status={d.status} level={d.status === "보류" ? "주의" : "안내"} />
                  <span className="ml-auto text-[10.5px] text-ink-400 num">{d.closeAt}</span>
                </div>
                <p className="mt-2 text-[14px] font-semibold text-ink-800">{d.client}</p>
                <p className="mt-1 truncate text-[12px] text-ink-400">{d.project}</p>
                <div className="mt-2.5 flex items-center gap-2">
                  <MProgress value={d.probability} tone="corp" />
                  <span className="shrink-0 text-[11.5px] text-ink-500 num">{d.probability}%</span>
                </div>
                <p className="mt-1.5 text-[11.5px] text-ink-400 num">
                  계약 {wonShort(d.amount)}
                  {d.monthly ? ` · 월 ${wonShort(d.monthly)}` : ""}
                </p>
              </div>
            </MCard>
          ))}
        </div>
      </MSection>
    </>
  );
}

/* ── 회사 전환 ──────────────────────────────── */

export function MobileCompanies() {
  const { scope, setScope } = useApp();
  return (
    <>
      <MSection title="관리 법인">
        <div className="space-y-2.5">
          {(["tailor", "corp"] as CompanyId[]).map((id) => {
            const c = COMPANIES[id];
            const active = scope === id;
            return (
              <MCard key={id}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-3",
                    id === "tailor" ? "bg-tailor-700" : "bg-corp-800",
                  )}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-white/15 text-[12px] font-bold text-white">
                    {c.mark}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-white">{c.name}</p>
                    <p className="truncate text-[11px] text-white/60">{c.business}</p>
                  </div>
                </div>
                <MMiniGrid
                  items={[
                    {
                      label: "이번 달 매출",
                      value: wonShort(id === "tailor" ? SUMMARY.tailor.revenue : SUMMARY.corp.revenue),
                    },
                    {
                      label: "가용자금",
                      value: wonShort(
                        id === "tailor" ? SUMMARY.cash.tailorAvailable : SUMMARY.cash.corpAvailable,
                      ),
                    },
                    { label: "인원", value: String(c.employees), unit: "명" },
                    { label: "설립", value: c.founded },
                  ]}
                />
                <button
                  onClick={() => setScope(active ? "all" : id)}
                  className={cn(
                    "w-full border-t border-ink-100 py-3 text-[13px] font-medium",
                    active
                      ? "bg-ivory-100 text-ink-500"
                      : id === "tailor"
                        ? "bg-white text-tailor-700"
                        : "bg-white text-corp-700",
                  )}
                >
                  {active ? "선택 해제 (통합 보기)" : `${c.shortName}만 보기`}
                </button>
              </MCard>
            );
          })}
        </div>
      </MSection>
    </>
  );
}

/* ── 보고서 ─────────────────────────────────── */

export function MobileReports() {
  return (
    <MSection title={`보고서 ${REPORTS.length}건`}>
      <div className="space-y-2.5">
        {REPORTS.map((r) => (
          <MCard key={r.id}>
            <div className="p-3.5">
              <div className="flex items-center gap-1.5">
                <span className="rounded-[5px] bg-ink-100 px-1.5 py-[3px] text-[10.5px] font-medium leading-none text-ink-500">
                  {r.scope}
                </span>
                <span className="ml-auto text-[10.5px] text-ink-400 num">{r.updatedAt}</span>
              </div>
              <p className="mt-2 text-[13.5px] font-semibold leading-snug text-ink-800">{r.title}</p>
              <p className="mt-1 text-[12px] text-ink-400 num">{r.period}</p>
              <p className="mt-2 rounded-[10px] bg-ivory-100 px-3 py-2 text-[12px] leading-relaxed text-ink-600">
                {r.summary}
              </p>
            </div>
          </MCard>
        ))}
      </div>
    </MSection>
  );
}

/* ── 회사별 매출 상세 (단일 회사) ───────────── */

export function MobileCompanySales({ company }: { company: CompanyId }) {
  const isTailor = company === "tailor";
  const revenue = isTailor ? SUMMARY.tailor.revenue : SUMMARY.corp.revenue;
  return (
    <>
      <MStatGrid>
        <MStat label="이번 달 매출" value={wonShort(revenue)} hint="2026년 7월" />
        <MStat
          label="미수금"
          value={wonShort(isTailor ? SUMMARY.tailor.receivable : SUMMARY.corp.receivable)}
          tone="alert"
        />
      </MStatGrid>
      <MSection title="매출 추이">
        <MTrend
          data={REVENUE_TREND.map((r) => ({ month: r.month, value: isTailor ? r.tailor : r.corp }))}
          tone={company}
          label={isTailor ? "비앤테일러샵" : "AI 소프트웨어 법인"}
        />
      </MSection>
      <MSection title="매출 구성">
        <MMix
          data={isTailor ? TAILOR_REVENUE_MIX : CORP_REVENUE_MIX}
          tone={company}
          total={revenue}
        />
      </MSection>
    </>
  );
}

/* ── 고객 분석 ──────────────────────────────── */

export function MobileTailorAnalytics() {
  const total = TAILOR_CUSTOMERS.reduce((s, c) => s + c.totalAmount, 0);
  const grades = ["VIP", "우수", "신규", "일반"] as const;
  return (
    <>
      <MStatGrid>
        <MStat label="관리 고객" value={String(TAILOR_CUSTOMERS.length)} unit="명" />
        <MStat label="재구매 추천" value={String(SUMMARY.tailor.repurchase)} unit="명" tone="tailor" />
      </MStatGrid>

      <MSection title="등급별 구매 기여도">
        <MCard>
          <div className="divide-y divide-ink-100">
            {grades.map((g) => {
              const sum = TAILOR_CUSTOMERS.filter((c) => c.grade === g).reduce(
                (s, c) => s + c.totalAmount,
                0,
              );
              return (
                <div key={g} className="px-3.5 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex-1 text-[13px] text-ink-700">{g}</span>
                    <span className="text-[12.5px] font-semibold text-ink-800 num">
                      {wonShort(sum)}
                    </span>
                    <span className="w-9 text-right text-[11px] text-ink-400 num">
                      {pct(sum, total)}%
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <MProgress value={pct(sum, total)} tone="tailor" />
                  </div>
                </div>
              );
            })}
          </div>
        </MCard>
      </MSection>

      <MSection title="재구매 추천 고객">
        <MList>
          {[...TAILOR_CUSTOMERS]
            .sort((a, b) => b.repurchaseScore - a.repurchaseScore)
            .slice(0, 6)
            .map((c) => (
              <MRow
                key={c.id}
                title={c.name}
                sub={c.nextAction}
                chevron={false}
                trailing={
                  <span className="text-[15px] font-semibold text-tailor-700 num">
                    {c.repurchaseScore}
                  </span>
                }
              />
            ))}
        </MList>
      </MSection>
    </>
  );
}

"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useApp } from "@/components/app-store";
import { CashFlowChart, CategoryDonut, PlanVsActualChart, RateDonut } from "@/components/charts";
import { ExpenseModal } from "@/components/modals";
import { CompanyChip, MoreLink, PageHeader } from "@/components/page-kit";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Bar } from "@/components/ui/progress";
import { Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import { BUDGET_LINES, CASH_TREND, SUMMARY } from "@/lib/data";
import { cn, num, pct, won, wonShort } from "@/lib/utils";
import type { CompanyId, Scope } from "@/lib/types";

const TAILOR_COLORS = ["#6f1f31", "#86293d", "#9c3d51", "#bf6b7c", "#d9a0ab", "#ecccd2"];
const CORP_COLORS = ["#142650", "#1b3269", "#234084", "#33529f", "#5e79bd", "#94a9d8", "#c6d2ec"];

const TABS: { value: Scope; label: string }[] = [
  { value: "all", label: "통합" },
  { value: "tailor", label: "비앤테일러샵" },
  { value: "corp", label: "AI 소프트웨어 법인" },
];

export default function FinancePage() {
  const { scope, setScope, transactions } = useApp();

  const lines = BUDGET_LINES.filter((b) => scope === "all" || b.company === scope);
  const planned = lines.reduce((s, b) => s + b.planned, 0);
  const executed = lines.reduce((s, b) => s + b.executed, 0);
  const remain = planned - executed;

  const available =
    scope === "tailor"
      ? SUMMARY.cash.tailorAvailable
      : scope === "corp"
        ? SUMMARY.cash.corpAvailable
        : SUMMARY.cash.available;

  const txs = transactions.filter((t) => scope === "all" || t.company === scope);
  const colors =
    scope === "corp" ? CORP_COLORS : scope === "tailor" ? TAILOR_COLORS : [...TAILOR_COLORS, ...CORP_COLORS];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="자금 관리"
        desc="회사별 계획 대비 집행 현황과 최근 집행 내역을 관리합니다."
        actions={
          <ExpenseModal defaultCompany={scope === "corp" ? "corp" : "tailor"}>
            <Button>
              <Plus className="h-3.5 w-3.5" />
              자금 집행 등록
            </Button>
          </ExpenseModal>
        }
      />

      {/* 회사별 탭 */}
      <div className="mb-3 flex items-center gap-1 rounded-md border border-ink-200 bg-white p-0.5 shadow-card sm:inline-flex">
        {TABS.map((t) => (
          <button
            key={String(t.value)}
            onClick={() => setScope(t.value)}
            className={cn(
              "flex-1 rounded px-4 py-1.5 text-[12.5px] font-medium transition-colors sm:flex-none",
              scope === t.value
                ? t.value === "tailor"
                  ? "bg-tailor-600 text-white"
                  : t.value === "corp"
                    ? "bg-corp-700 text-white"
                    : "bg-ink-800 text-white"
                : "text-ink-500 hover:bg-ink-50",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 요약 */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <SummaryCard label="가용자금" value={won(available)} sub="운영 예비비 포함" />
        <SummaryCard label="계획금액" value={won(planned)} sub={`${lines.length}개 항목`} />
        <SummaryCard label="집행금액" value={won(executed)} sub="이번 달 누계" />
        <SummaryCard label="잔여금액" value={won(remain)} sub="집행 가능액" />
        <Card className="col-span-2 lg:col-span-1">
          <div className="flex h-full items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="text-[12px] text-ink-500">집행률</p>
              <p className="mt-1.5 text-[21px] font-semibold text-ink-900 num">
                {pct(executed, planned)}%
              </p>
              <p className="mt-1 text-[11px] text-ink-400">계획 대비</p>
            </div>
            <RateDonut
              value={pct(executed, planned)}
              color={scope === "corp" ? "#234084" : scope === "tailor" ? "#86293d" : "#1b2437"}
              size={72}
            />
          </div>
        </Card>
      </div>

      {/* 회사별 집행 요약 (통합 탭) */}
      {scope === "all" ? (
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          {(["tailor", "corp"] as CompanyId[]).map((c) => {
            const cl = BUDGET_LINES.filter((b) => b.company === c);
            const p = cl.reduce((s, b) => s + b.planned, 0);
            const e = cl.reduce((s, b) => s + b.executed, 0);
            return (
              <Card key={c}>
                <CardHeader
                  title={c === "tailor" ? "비앤테일러샵 자금 집행" : "AI 소프트웨어 법인 자금 집행"}
                  desc={`${cl.length}개 항목 · 이번 달`}
                  action={
                    <button
                      onClick={() => setScope(c)}
                      className="text-[11.5px] text-ink-400 transition-colors hover:text-ink-700"
                    >
                      상세 보기 ›
                    </button>
                  }
                />
                <div className="flex items-center gap-4 p-4">
                  <RateDonut value={pct(e, p)} color={c === "tailor" ? "#86293d" : "#234084"} size={90} />
                  <div className="min-w-0 flex-1 space-y-2">
                    {cl.map((b) => (
                      <div key={b.id}>
                        <div className="flex items-center justify-between gap-2 text-[11.5px]">
                          <span className="truncate text-ink-600">{b.category}</span>
                          <span className="shrink-0 text-ink-500 num">
                            {wonShort(b.executed)} / {wonShort(b.planned)}
                          </span>
                        </div>
                        <Bar
                          value={pct(b.executed, b.planned)}
                          className="mt-1"
                          color={c === "tailor" ? "#86293d" : "#234084"}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : null}

      {/* 차트 */}
      <div className="mt-3 grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-5">
          <Card className="h-full">
            <CardHeader title="항목별 집행 비중" desc="집행금액 기준" />
            <div className="grid grid-cols-2 items-center gap-2 p-3.5">
              <CategoryDonut
                data={lines.map((b) => ({ name: b.category, value: b.executed }))}
                colors={colors}
                height={200}
                centerTop={wonShort(executed)}
                centerBottom="집행 합계"
              />
              <ul className="thin-scroll max-h-[200px] space-y-1.5 overflow-y-auto">
                {lines.map((b, i) => (
                  <li key={b.id} className="flex items-center gap-2 text-[11.5px]">
                    <span
                      className="h-2 w-2 shrink-0 rounded-sm"
                      style={{ background: colors[i % colors.length] }}
                    />
                    <span className="flex-1 truncate text-ink-500">{b.category}</span>
                    <span className="shrink-0 text-ink-700 num">{wonShort(b.executed)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
        <div className="col-span-12 xl:col-span-7">
          <Card className="h-full">
            <CardHeader title="계획 대비 집행" desc="항목별 계획금액과 집행금액 비교" />
            <div className="p-3.5">
              <PlanVsActualChart
                data={lines.map((b) => ({
                  name: b.category,
                  planned: b.planned,
                  executed: b.executed,
                }))}
                color={scope === "corp" ? "#234084" : "#86293d"}
                height={240}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* 예산 테이블 */}
      <Card className="mt-3">
        <CardHeader
          title="자금 계획 · 집행 상세"
          desc="사용 목적과 관련 프로젝트를 함께 관리합니다"
        />
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>회사</Th>
                <Th>집행 항목</Th>
                <Th>사용 목적</Th>
                <Th>관련 프로젝트</Th>
                <Th className="text-right">계획금액</Th>
                <Th className="text-right">집행금액</Th>
                <Th className="text-right">잔여금액</Th>
                <Th className="w-[140px]">집행률</Th>
              </tr>
            </thead>
            <tbody>
              {lines.map((b) => {
                const rate = pct(b.executed, b.planned);
                return (
                  <Tr key={b.id}>
                    <Td>
                      <CompanyChip company={b.company} />
                    </Td>
                    <Td className="font-medium text-ink-800">{b.category}</Td>
                    <Td className="text-ink-600">{b.purpose}</Td>
                    <Td className="text-ink-500">{b.relatedProject}</Td>
                    <Td className="text-right num">{won(b.planned)}</Td>
                    <Td className="text-right font-medium num">{won(b.executed)}</Td>
                    <Td
                      className={cn(
                        "text-right num",
                        b.planned - b.executed <= 0 ? "text-rose-600" : "text-ink-600",
                      )}
                    >
                      {won(b.planned - b.executed)}
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <Bar
                          value={rate}
                          color={b.company === "tailor" ? "#86293d" : "#234084"}
                          className="w-[70px]"
                        />
                        <span className="text-[11.5px] text-ink-500 num">{rate}%</span>
                      </div>
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-ivory-100/70">
                <Td colSpan={4} className="font-medium text-ink-700">
                  합계
                </Td>
                <Td className="text-right font-semibold num">{won(planned)}</Td>
                <Td className="text-right font-semibold num">{won(executed)}</Td>
                <Td className="text-right font-semibold num">{won(remain)}</Td>
                <Td className="font-semibold num">{pct(executed, planned)}%</Td>
              </tr>
            </tfoot>
          </Table>
        </TableWrap>
      </Card>

      {/* 최근 집행 내역 · 자금 흐름 */}
      <div className="mt-3 grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-7">
          <Card className="h-full">
            <CardHeader
              title="최근 집행 내역"
              desc={`${txs.length}건 · 승인 대기 ${txs.filter((t) => t.status === "승인 대기").length}건`}
              action={
                <ExpenseModal defaultCompany={scope === "corp" ? "corp" : "tailor"}>
                  <Button variant="outline" size="sm">
                    <Plus className="h-3.5 w-3.5" />
                    집행 등록
                  </Button>
                </ExpenseModal>
              }
            />
            <TableWrap>
              <Table>
                <thead>
                  <tr>
                    <Th>일자</Th>
                    <Th>회사</Th>
                    <Th>항목</Th>
                    <Th>집행 내용</Th>
                    <Th>거래처</Th>
                    <Th className="text-right">금액</Th>
                    <Th>방식</Th>
                    <Th>상태</Th>
                  </tr>
                </thead>
                <tbody>
                  {txs.slice(0, 12).map((t) => (
                    <Tr key={t.id}>
                      <Td className="text-ink-500 num">{t.date}</Td>
                      <Td>
                        <CompanyChip company={t.company} />
                      </Td>
                      <Td className="text-ink-600">{t.category}</Td>
                      <Td className="max-w-[240px] truncate font-medium text-ink-800">{t.title}</Td>
                      <Td className="text-ink-500">{t.vendor}</Td>
                      <Td className="text-right font-medium num">{won(t.amount)}</Td>
                      <Td className="text-ink-500">{t.method}</Td>
                      <Td>
                        <StatusBadge status={t.status} />
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableWrap>
          </Card>
        </div>
        <div className="col-span-12 xl:col-span-5">
          <Card className="h-full">
            <CardHeader title="회사별 자금 흐름" desc="최근 6개월 수입 · 지출" action={<MoreLink href="/revenue" />} />
            <div className="p-3.5">
              <CashFlowChart data={CASH_TREND} height={252} />
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-ink-100 pt-3 text-[11.5px]">
                <div className="rounded-md bg-tailor-50/60 p-2.5">
                  <p className="text-tailor-700">비앤테일러샵 7월</p>
                  <p className="mt-1 text-ink-600 num">
                    수입 {wonShort(CASH_TREND[5].tailorIn)} · 지출 {wonShort(CASH_TREND[5].tailorOut)}
                  </p>
                </div>
                <div className="rounded-md bg-corp-50/60 p-2.5">
                  <p className="text-corp-700">AI 법인 7월</p>
                  <p className="mt-1 text-ink-600 num">
                    수입 {wonShort(CASH_TREND[5].corpIn)} · 지출 {wonShort(CASH_TREND[5].corpOut)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <p className="mt-4 text-center text-[11px] text-ink-300">
        집행 항목 {num(lines.length)}개 · 집행 내역 {num(txs.length)}건 (데모 데이터)
      </p>
    </div>
  );
}

function SummaryCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <Card>
      <div className="p-4">
        <p className="text-[12px] text-ink-500">{label}</p>
        <p className="mt-1.5 text-[19px] font-semibold text-ink-900 num">{value}</p>
        <p className="mt-1 text-[11px] text-ink-400">{sub}</p>
      </div>
    </Card>
  );
}

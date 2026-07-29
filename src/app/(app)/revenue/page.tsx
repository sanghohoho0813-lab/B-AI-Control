"use client";

import * as React from "react";
import { useApp } from "@/components/app-store";
import { CashFlowChart, CategoryDonut, RevenueTrendChart } from "@/components/charts";
import { CompanyChip, PageHeader } from "@/components/page-kit";
import { Card, CardHeader } from "@/components/ui/card";
import { Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import {
  CASH_TREND,
  CORP_REVENUE_MIX,
  REVENUE_TREND,
  REVENUE_TREND_12M,
  SUMMARY,
  TAILOR_REVENUE_MIX,
} from "@/lib/data";
import { cn, pct, won, wonShort } from "@/lib/utils";

const TAILOR_COLORS = ["#6f1f31", "#86293d", "#9c3d51", "#bf6b7c", "#d9a0ab"];
const CORP_COLORS = ["#142650", "#234084", "#33529f", "#5e79bd", "#94a9d8"];

export default function RevenuePage() {
  const { scope } = useApp();
  const [range, setRange] = React.useState<"6개월" | "12개월">("6개월");
  const trend = range === "6개월" ? REVENUE_TREND : REVENUE_TREND_12M;

  const showTailor = scope === "all" || scope === "tailor";
  const showCorp = scope === "all" || scope === "corp";

  const total = SUMMARY.tailor.revenue + SUMMARY.corp.revenue;
  const lastTotal = SUMMARY.tailor.lastMonthRevenue + SUMMARY.corp.lastMonthRevenue;

  return (
    <div className="animate-fade-in">
      <PageHeader title="매출·재무" desc="회사별 매출 추이와 수입·지출 구조를 함께 확인합니다." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <div className="p-4">
            <p className="text-[13.5px] text-ink-500">양사 합산 매출</p>
            <p className="mt-1.5 text-[23px] font-semibold text-ink-900 num">{won(total)}</p>
            <p className="mt-1 text-[12.5px] text-emerald-600 num">
              전월 대비 +{(((total - lastTotal) / lastTotal) * 100).toFixed(1)}%
            </p>
          </div>
        </Card>
        <Card className="stripe-tailor">
          <div className="p-4">
            <p className="text-[13.5px] text-tailor-700">비앤테일러샵</p>
            <p className="mt-1.5 text-[23px] font-semibold text-ink-900 num">
              {won(SUMMARY.tailor.revenue)}
            </p>
            <p className="mt-1 text-[12.5px] text-ink-400 num">
              비중 {pct(SUMMARY.tailor.revenue, total)}% · 전월 대비 +{SUMMARY.tailor.revenueDelta}%
            </p>
          </div>
        </Card>
        <Card className="stripe-corp">
          <div className="p-4">
            <p className="text-[13.5px] text-corp-700">AI 소프트웨어 법인</p>
            <p className="mt-1.5 text-[23px] font-semibold text-ink-900 num">
              {won(SUMMARY.corp.revenue)}
            </p>
            <p className="mt-1 text-[12.5px] text-ink-400 num">
              비중 {pct(SUMMARY.corp.revenue, total)}% · 전월 대비 +{SUMMARY.corp.revenueDelta}%
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-[13.5px] text-ink-500">미수금 합계</p>
            <p className="mt-1.5 text-[23px] font-semibold text-ink-900 num">
              {won(SUMMARY.tailor.receivable + SUMMARY.corp.receivable)}
            </p>
            <p className="mt-1 text-[12.5px] text-ink-400 num">
              비앤 {wonShort(SUMMARY.tailor.receivable)} · AI {wonShort(SUMMARY.corp.receivable)}
            </p>
          </div>
        </Card>
      </div>

      <Card className="mt-3">
        <CardHeader
          title="회사별 매출 추이"
          desc={`최근 ${range}`}
          action={
            <div className="flex items-center gap-1 rounded-md border border-ink-200 p-0.5">
              {(["6개월", "12개월"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={cn(
                    "rounded px-2 py-1 text-[13px] transition-colors",
                    range === r ? "bg-ink-800 text-white" : "text-ink-500 hover:bg-ink-50",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          }
        />
        <div className="p-4">
          <RevenueTrendChart data={trend} height={280} />
        </div>
      </Card>

      <div className="mt-3 grid grid-cols-12 gap-3">
        {showTailor ? (
          <div className={cn("col-span-12", showCorp ? "xl:col-span-4" : "xl:col-span-6")}>
            <Card className="h-full">
              <CardHeader title="비앤테일러샵 매출 구성" desc="이번 달 품목별" />
              <div className="p-3.5">
                <CategoryDonut
                  data={TAILOR_REVENUE_MIX}
                  colors={TAILOR_COLORS}
                  height={190}
                  centerTop={wonShort(SUMMARY.tailor.revenue)}
                  centerBottom="이번 달"
                />
                <ul className="mt-2 space-y-1.5">
                  {TAILOR_REVENUE_MIX.map((r, i) => (
                    <li key={r.name} className="flex items-center gap-2 text-[13px]">
                      <span
                        className="h-2 w-2 rounded-sm"
                        style={{ background: TAILOR_COLORS[i] }}
                      />
                      <span className="flex-1 truncate text-ink-500">{r.name}</span>
                      <span className="text-ink-700 num">{won(r.value)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        ) : null}

        {showCorp ? (
          <div className={cn("col-span-12", showTailor ? "xl:col-span-4" : "xl:col-span-6")}>
            <Card className="h-full">
              <CardHeader title="AI 법인 매출 구성" desc="이번 달 유형별" />
              <div className="p-3.5">
                <CategoryDonut
                  data={CORP_REVENUE_MIX}
                  colors={CORP_COLORS}
                  height={190}
                  centerTop={wonShort(SUMMARY.corp.revenue)}
                  centerBottom="이번 달"
                />
                <ul className="mt-2 space-y-1.5">
                  {CORP_REVENUE_MIX.map((r, i) => (
                    <li key={r.name} className="flex items-center gap-2 text-[13px]">
                      <span className="h-2 w-2 rounded-sm" style={{ background: CORP_COLORS[i] }} />
                      <span className="flex-1 truncate text-ink-500">{r.name}</span>
                      <span className="text-ink-700 num">{won(r.value)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        ) : null}

        <div className={cn("col-span-12", showTailor && showCorp ? "xl:col-span-4" : "xl:col-span-6")}>
          <Card className="h-full">
            <CardHeader title="회사별 수입 · 지출" desc="최근 6개월" />
            <div className="p-3.5">
              <CashFlowChart data={CASH_TREND} height={250} />
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-3">
        <CardHeader title="월별 매출 · 지출 상세" desc="회사별 구분 · 단위 원" />
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>월</Th>
                <Th>회사</Th>
                <Th className="text-right">매출</Th>
                <Th className="text-right">지출</Th>
                <Th className="text-right">수지</Th>
                <Th className="text-right">이익률</Th>
              </tr>
            </thead>
            <tbody>
              {CASH_TREND.slice()
                .reverse()
                .flatMap((c) => {
                  const rows: React.ReactNode[] = [];
                  if (showTailor) {
                    const p = c.tailorIn - c.tailorOut;
                    rows.push(
                      <Tr key={`${c.month}-t`}>
                        <Td className="font-medium num">{c.month}</Td>
                        <Td>
                          <CompanyChip company="tailor" />
                        </Td>
                        <Td className="text-right num">{won(c.tailorIn)}</Td>
                        <Td className="text-right text-ink-500 num">{won(c.tailorOut)}</Td>
                        <Td
                          className={cn(
                            "text-right font-medium num",
                            p >= 0 ? "text-emerald-600" : "text-rose-600",
                          )}
                        >
                          {won(p)}
                        </Td>
                        <Td className="text-right num">{pct(p, c.tailorIn)}%</Td>
                      </Tr>,
                    );
                  }
                  if (showCorp) {
                    const p = c.corpIn - c.corpOut;
                    rows.push(
                      <Tr key={`${c.month}-c`}>
                        <Td className="font-medium num">{showTailor ? "" : c.month}</Td>
                        <Td>
                          <CompanyChip company="corp" />
                        </Td>
                        <Td className="text-right num">{won(c.corpIn)}</Td>
                        <Td className="text-right text-ink-500 num">{won(c.corpOut)}</Td>
                        <Td
                          className={cn(
                            "text-right font-medium num",
                            p >= 0 ? "text-emerald-600" : "text-rose-600",
                          )}
                        >
                          {won(p)}
                        </Td>
                        <Td className="text-right num">{pct(p, c.corpIn)}%</Td>
                      </Tr>,
                    );
                  }
                  return rows;
                })}
            </tbody>
          </Table>
        </TableWrap>
      </Card>
    </div>
  );
}

"use client";

import * as React from "react";
import { CategoryDonut, RevenueTrendChart } from "@/components/charts";
import { PageHeader } from "@/components/page-kit";
import { StatusBadge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import {
  REVENUE_TREND,
  REVENUE_TREND_12M,
  SUMMARY,
  TAILOR_CUSTOMERS,
  TAILOR_ORDERS,
  TAILOR_REVENUE_MIX,
} from "@/lib/data";
import { cn, num, pct, won, wonShort } from "@/lib/utils";

const COLORS = ["#6f1f31", "#86293d", "#9c3d51", "#bf6b7c", "#d9a0ab"];

export default function TailorSalesPage() {
  const [range, setRange] = React.useState<"6개월" | "12개월">("6개월");
  const trend = range === "6개월" ? REVENUE_TREND : REVENUE_TREND_12M;

  const orderRevenue = TAILOR_ORDERS.reduce((s, o) => s + o.amount, 0);
  const deposit = TAILOR_ORDERS.reduce((s, o) => s + o.deposit, 0);

  return (
    <div className="animate-fade-in">
      <PageHeader
        company="tailor"
        title="매출 관리"
        desc="품목별 매출 구성과 미수금 현황을 관리합니다."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          { l: "이번 달 매출", v: won(SUMMARY.tailor.revenue), s: `전월 대비 +${SUMMARY.tailor.revenueDelta}%` },
          { l: "전월 매출", v: won(SUMMARY.tailor.lastMonthRevenue), s: "2026년 6월" },
          { l: "평균 주문 금액", v: won(SUMMARY.tailor.avgOrderValue), s: `주문 ${SUMMARY.tailor.orderCount}건` },
          { l: "미수금", v: won(SUMMARY.tailor.receivable), s: "30일 초과 3건" },
          { l: "오늘 매출", v: won(SUMMARY.tailor.todayRevenue), s: "2026.07.29" },
        ].map((k) => (
          <Card key={k.l}>
            <div className="p-4">
              <p className="text-[12px] text-ink-500">{k.l}</p>
              <p className="mt-1.5 text-[18px] font-semibold text-ink-900 num">{k.v}</p>
              <p className="mt-1 text-[11px] text-ink-400 num">{k.s}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-8">
          <Card className="h-full">
            <CardHeader
              title="매출 추이"
              desc={`최근 ${range} · 비앤테일러샵`}
              action={
                <div className="flex items-center gap-1 rounded-md border border-ink-200 p-0.5">
                  {(["6개월", "12개월"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRange(r)}
                      className={cn(
                        "rounded px-2 py-1 text-[11.5px] transition-colors",
                        range === r ? "bg-tailor-600 text-white" : "text-ink-500 hover:bg-ink-50",
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              }
            />
            <div className="p-3.5">
              <RevenueTrendChart data={trend} height={270} series="tailor" showLegend={false} />
            </div>
          </Card>
        </div>
        <div className="col-span-12 xl:col-span-4">
          <Card className="h-full">
            <CardHeader title="품목별 매출 구성" desc="이번 달" />
            <div className="p-3.5">
              <CategoryDonut
                data={TAILOR_REVENUE_MIX}
                colors={COLORS}
                height={190}
                centerTop={wonShort(SUMMARY.tailor.revenue)}
                centerBottom="이번 달"
              />
              <ul className="mt-2 space-y-1.5 border-t border-ink-100 pt-2.5">
                {TAILOR_REVENUE_MIX.map((r, i) => (
                  <li key={r.name} className="flex items-center gap-2 text-[11.5px]">
                    <span className="h-2 w-2 rounded-sm" style={{ background: COLORS[i] }} />
                    <span className="flex-1 truncate text-ink-500">{r.name}</span>
                    <span className="text-ink-700 num">{won(r.value)}</span>
                    <span className="w-9 text-right text-ink-400 num">
                      {pct(r.value, SUMMARY.tailor.revenue)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-8">
          <Card>
            <CardHeader
              title="주문별 매출 · 수금 현황"
              desc={`주문 금액 ${won(orderRevenue)} · 수금 ${won(deposit)}`}
            />
            <TableWrap>
              <Table>
                <thead>
                  <tr>
                    <Th>주문번호</Th>
                    <Th>고객</Th>
                    <Th>품목</Th>
                    <Th>단계</Th>
                    <Th className="text-right">주문 금액</Th>
                    <Th className="text-right">수금액</Th>
                    <Th className="text-right">미수금</Th>
                    <Th>납기일</Th>
                    <Th>상태</Th>
                  </tr>
                </thead>
                <tbody>
                  {TAILOR_ORDERS.map((o) => (
                    <Tr key={o.id}>
                      <Td className="text-ink-500 num">{o.id}</Td>
                      <Td className="font-medium text-ink-800">{o.customer}</Td>
                      <Td className="text-ink-600">{o.item}</Td>
                      <Td className="text-ink-500">{o.stage}</Td>
                      <Td className="text-right num">{won(o.amount)}</Td>
                      <Td className="text-right text-ink-500 num">{won(o.deposit)}</Td>
                      <Td
                        className={cn(
                          "text-right font-medium num",
                          o.amount - o.deposit > 0 ? "text-rose-600" : "text-ink-600",
                        )}
                      >
                        {won(o.amount - o.deposit)}
                      </Td>
                      <Td className="num">{o.dueAt}</Td>
                      <Td>
                        <StatusBadge status={o.status} />
                      </Td>
                    </Tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-ivory-100/70">
                    <Td colSpan={4} className="font-medium text-ink-700">
                      합계
                    </Td>
                    <Td className="text-right font-semibold num">{won(orderRevenue)}</Td>
                    <Td className="text-right font-semibold num">{won(deposit)}</Td>
                    <Td className="text-right font-semibold text-rose-600 num">
                      {won(orderRevenue - deposit)}
                    </Td>
                    <Td colSpan={2} />
                  </tr>
                </tfoot>
              </Table>
            </TableWrap>
          </Card>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <Card className="h-full">
            <CardHeader title="고객별 누적 매출" desc="상위 고객" />
            <ul>
              {[...TAILOR_CUSTOMERS]
                .sort((a, b) => b.totalAmount - a.totalAmount)
                .slice(0, 8)
                .map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center gap-3 border-b border-ink-100 px-4 py-2.5 last:border-b-0"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tailor-50 text-[10.5px] font-semibold text-tailor-700">
                      {c.name.slice(0, 1)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-medium text-ink-800">
                        {c.name}
                      </span>
                      <span className="block truncate text-[11px] text-ink-400">
                        {c.visits}회 방문 · {c.grade}
                      </span>
                    </span>
                    <span className="shrink-0 text-[12px] font-medium text-ink-800 num">
                      {wonShort(c.totalAmount)}
                    </span>
                  </li>
                ))}
            </ul>
          </Card>
        </div>
      </div>

      <p className="mt-4 text-center text-[11px] text-ink-300">
        주문 {num(TAILOR_ORDERS.length)}건 기준 (데모 데이터)
      </p>
    </div>
  );
}

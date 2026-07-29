"use client";

import * as React from "react";
import { CategoryDonut, RevenueTrendChart } from "@/components/charts";
import { PageHeader } from "@/components/page-kit";
import { StatusBadge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Bar } from "@/components/ui/progress";
import { Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import {
  AI_PROJECTS,
  CORP_REVENUE_MIX,
  DEALS,
  REVENUE_TREND,
  REVENUE_TREND_12M,
  SUMMARY,
} from "@/lib/data";
import { cn, num, pct, won, wonShort } from "@/lib/utils";

const COLORS = ["#142650", "#234084", "#33529f", "#5e79bd", "#94a9d8"];

export default function AiSalesPage() {
  const [range, setRange] = React.useState<"6개월" | "12개월">("6개월");
  const trend = range === "6개월" ? REVENUE_TREND : REVENUE_TREND_12M;

  const mrr = DEALS.reduce((s, d) => s + d.monthly, 0);
  const expected = AI_PROJECTS.reduce((s, p) => s + p.expectedRevenue, 0);

  return (
    <div className="animate-fade-in">
      <PageHeader
        company="corp"
        title="매출 관리"
        desc="구독 · 용역 · 과제 매출과 계약별 수익 구조를 관리합니다."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          { l: "이번 달 매출", v: won(SUMMARY.corp.revenue), s: `전월 대비 +${SUMMARY.corp.revenueDelta}%` },
          { l: "전월 매출", v: won(SUMMARY.corp.lastMonthRevenue), s: "2026년 6월" },
          { l: "월 반복 매출", v: won(mrr), s: "구독 계약 합계" },
          { l: "미수금", v: won(SUMMARY.corp.receivable), s: "정산 대기" },
          { l: "예상 매출", v: won(expected), s: "프로젝트 기준" },
        ].map((k) => (
          <Card key={k.l}>
            <div className="p-4">
              <p className="text-[13.5px] text-ink-500">{k.l}</p>
              <p className="mt-1.5 text-[20px] font-semibold text-ink-900 num">{k.v}</p>
              <p className="mt-1 text-[12.5px] text-ink-400 num">{k.s}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-8">
          <Card className="h-full">
            <CardHeader
              title="매출 추이"
              desc={`최근 ${range} · AI 소프트웨어 법인`}
              action={
                <div className="flex items-center gap-1 rounded-md border border-ink-200 p-0.5">
                  {(["6개월", "12개월"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRange(r)}
                      className={cn(
                        "rounded px-2 py-1 text-[13px] transition-colors",
                        range === r ? "bg-corp-700 text-white" : "text-ink-500 hover:bg-ink-50",
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              }
            />
            <div className="p-3.5">
              <RevenueTrendChart data={trend} height={270} series="corp" showLegend={false} />
            </div>
          </Card>
        </div>
        <div className="col-span-12 xl:col-span-4">
          <Card className="h-full">
            <CardHeader title="매출 유형 구성" desc="이번 달" />
            <div className="p-3.5">
              <CategoryDonut
                data={CORP_REVENUE_MIX}
                colors={COLORS}
                height={190}
                centerTop={wonShort(SUMMARY.corp.revenue)}
                centerBottom="이번 달"
              />
              <ul className="mt-2 space-y-1.5 border-t border-ink-100 pt-2.5">
                {CORP_REVENUE_MIX.map((r, i) => (
                  <li key={r.name} className="flex items-center gap-2 text-[13px]">
                    <span className="h-2 w-2 rounded-sm" style={{ background: COLORS[i] }} />
                    <span className="flex-1 truncate text-ink-500">{r.name}</span>
                    <span className="text-ink-700 num">{won(r.value)}</span>
                    <span className="w-9 text-right text-ink-400 num">
                      {pct(r.value, SUMMARY.corp.revenue)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-7">
          <Card>
            <CardHeader title="계약별 매출" desc="계약 규모와 월 구독료" />
            <TableWrap>
              <Table>
                <thead>
                  <tr>
                    <Th>고객사</Th>
                    <Th>프로젝트</Th>
                    <Th className="text-right">계약 규모</Th>
                    <Th className="text-right">월 구독료</Th>
                    <Th>계약 기간</Th>
                    <Th>상태</Th>
                  </tr>
                </thead>
                <tbody>
                  {DEALS.map((d) => (
                    <Tr key={d.id}>
                      <Td className="font-medium text-ink-800">{d.client}</Td>
                      <Td className="text-ink-600">{d.project}</Td>
                      <Td className="text-right num">{won(d.amount)}</Td>
                      <Td className="text-right text-ink-600 num">
                        {d.monthly ? won(d.monthly) : "-"}
                      </Td>
                      <Td className="text-ink-500 num">
                        {d.startedAt} ~ {d.closeAt}
                      </Td>
                      <Td>
                        <StatusBadge status={d.status} />
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
            <CardHeader title="프로젝트별 예상 매출" desc="사업화 단계 기준" />
            <ul className="p-3.5">
              {AI_PROJECTS.filter((p) => p.expectedRevenue > 0)
                .sort((a, b) => b.expectedRevenue - a.expectedRevenue)
                .map((p) => (
                  <li key={p.id} className="border-b border-ink-100 py-2.5 last:border-b-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[14px] text-ink-800">{p.name}</span>
                      <span className="shrink-0 text-[14px] font-medium text-ink-800 num">
                        {won(p.expectedRevenue)}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Bar value={p.progress} color="#234084" />
                      <span className="w-20 shrink-0 text-right text-[12px] text-ink-400">
                        {p.phase} {p.progress}%
                      </span>
                    </div>
                  </li>
                ))}
            </ul>
          </Card>
        </div>
      </div>

      <p className="mt-4 text-center text-[12.5px] text-ink-300">
        계약 {num(DEALS.length)}건 · 프로젝트 {num(AI_PROJECTS.length)}건 (데모 데이터)
      </p>
    </div>
  );
}

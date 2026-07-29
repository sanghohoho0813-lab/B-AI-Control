"use client";

import * as React from "react";
import { Download, FileText } from "lucide-react";
import { useApp } from "@/components/app-store";
import { RevenueTrendChart } from "@/components/charts";
import { PageHeader } from "@/components/page-kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import { BUDGET_LINES, REPORTS, REVENUE_TREND, SUMMARY } from "@/lib/data";
import { cn, pct, won, wonShort } from "@/lib/utils";

export default function ReportsPage() {
  const { scope } = useApp();
  const scopeLabel =
    scope === "tailor" ? "비앤테일러샵" : scope === "corp" ? "AI 법인" : null;

  const items = REPORTS.filter((r) => !scopeLabel || r.scope === scopeLabel || r.scope === "통합");

  const tPlan = BUDGET_LINES.filter((b) => b.company === "tailor").reduce((s, b) => s + b.planned, 0);
  const tExec = BUDGET_LINES.filter((b) => b.company === "tailor").reduce((s, b) => s + b.executed, 0);
  const cPlan = BUDGET_LINES.filter((b) => b.company === "corp").reduce((s, b) => s + b.planned, 0);
  const cExec = BUDGET_LINES.filter((b) => b.company === "corp").reduce((s, b) => s + b.executed, 0);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="보고서"
        desc="월간 · 분기 경영 리포트를 모아 확인하고 내려받습니다."
        actions={
          <Button variant="outline">
            <Download className="h-3.5 w-3.5" />
            전체 내려받기
          </Button>
        }
      />

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-7">
          <Card>
            <CardHeader title="보고서 목록" desc={`${items.length}건`} />
            <TableWrap>
              <Table>
                <thead>
                  <tr>
                    <Th>보고서명</Th>
                    <Th>구분</Th>
                    <Th>대상 기간</Th>
                    <Th>작성자</Th>
                    <Th>최종 수정</Th>
                    <Th />
                  </tr>
                </thead>
                <tbody>
                  {items.map((r) => (
                    <Tr key={r.id}>
                      <Td className="font-medium text-ink-800">
                        <span className="flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-ink-400" />
                          {r.title}
                        </span>
                      </Td>
                      <Td>
                        <Badge
                          className={cn(
                            r.scope === "비앤테일러샵"
                              ? "border-tailor-200 bg-tailor-50 text-tailor-700"
                              : r.scope === "AI 법인"
                                ? "border-corp-200 bg-corp-50 text-corp-700"
                                : "border-ink-200 bg-ink-50 text-ink-600",
                          )}
                        >
                          {r.scope}
                        </Badge>
                      </Td>
                      <Td className="text-ink-500 num">{r.period}</Td>
                      <Td className="text-ink-600">{r.author}</Td>
                      <Td className="text-ink-500 num">{r.updatedAt}</Td>
                      <Td>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              열기
                            </Button>
                          </DialogTrigger>
                          <DialogContent title={r.title} desc={`${r.period} · ${r.author}`}>
                            <div className="space-y-4 px-5 py-4">
                              <div className="rounded-md border border-ink-200 bg-ivory-100/60 px-4 py-3">
                                <p className="text-[11.5px] text-ink-400">핵심 요약</p>
                                <p className="mt-1 text-[13px] text-ink-800">{r.summary}</p>
                              </div>
                              <div>
                                <p className="mb-2 text-[12px] font-medium text-ink-700">
                                  회사별 매출 추이
                                </p>
                                <RevenueTrendChart data={REVENUE_TREND} height={200} />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-md border border-tailor-200/70 bg-tailor-50/40 p-3">
                                  <p className="text-[11.5px] text-tailor-700">비앤테일러샵</p>
                                  <p className="mt-1 text-[15px] font-semibold text-ink-800 num">
                                    {won(SUMMARY.tailor.revenue)}
                                  </p>
                                  <p className="mt-1 text-[11px] text-ink-400 num">
                                    자금 집행률 {pct(tExec, tPlan)}% · 계획 {wonShort(tPlan)}
                                  </p>
                                </div>
                                <div className="rounded-md border border-corp-200/70 bg-corp-50/40 p-3">
                                  <p className="text-[11.5px] text-corp-700">AI 소프트웨어 법인</p>
                                  <p className="mt-1 text-[15px] font-semibold text-ink-800 num">
                                    {won(SUMMARY.corp.revenue)}
                                  </p>
                                  <p className="mt-1 text-[11px] text-ink-400 num">
                                    자금 집행률 {pct(cExec, cPlan)}% · 계획 {wonShort(cPlan)}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 border-t border-ink-200/60 bg-ivory-100/40 px-5 py-3">
                              <Button variant="outline" size="sm">
                                <Download className="h-3.5 w-3.5" />
                                PDF 내려받기
                              </Button>
                              <Button size="sm">보고서 공유</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableWrap>
          </Card>
        </div>

        <div className="col-span-12 xl:col-span-5">
          <Card className="mb-3">
            <CardHeader title="이번 달 요약" desc="2026.07.01 ~ 07.29" />
            <div className="grid grid-cols-2 divide-x divide-y divide-ink-100">
              {[
                { l: "비앤테일러샵 매출", v: won(SUMMARY.tailor.revenue) },
                { l: "AI 법인 매출", v: won(SUMMARY.corp.revenue) },
                { l: "통합 가용자금", v: won(SUMMARY.cash.available) },
                { l: "예상 지출", v: won(SUMMARY.cash.plannedSpend) },
                { l: "비앤 집행률", v: `${pct(tExec, tPlan)}%` },
                { l: "AI 집행률", v: `${pct(cExec, cPlan)}%` },
              ].map((r) => (
                <div key={r.l} className="px-4 py-3">
                  <p className="text-[11px] text-ink-400">{r.l}</p>
                  <p className="mt-1 text-[13px] font-semibold text-ink-800 num">{r.v}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="회사별 매출 추이" desc="최근 6개월" />
            <div className="p-3.5">
              <RevenueTrendChart data={REVENUE_TREND} height={230} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { AlertTriangle } from "lucide-react";
import { PageHeader, StageFlow } from "@/components/page-kit";
import { StatusBadge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Bar } from "@/components/ui/progress";
import { Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import { ORDER_STAGES, PRODUCTION_JOBS, SUMMARY, TAILOR_ORDERS } from "@/lib/data";
import { cn, num } from "@/lib/utils";

export default function ProductionPage() {
  const risky = PRODUCTION_JOBS.filter((j) => j.status !== "정상");
  const byStage = ORDER_STAGES.map((s) => ({
    stage: s,
    jobs: PRODUCTION_JOBS.filter((j) => j.stage === s),
  })).filter((g) => g.jobs.length > 0);

  return (
    <div className="animate-fade-in">
      <PageHeader
        company="tailor"
        title="제작·납기"
        desc="공방 제작 진행률과 납기 위험을 관리합니다."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          { l: "제작 진행", v: `${SUMMARY.tailor.inProduction}건`, s: "공방 작업 중" },
          { l: "가봉 예정", v: `${SUMMARY.tailor.fittingCount}건`, s: "2주 이내" },
          { l: "납품 예정", v: `${SUMMARY.tailor.delivery}건`, s: "이번 달" },
          { l: "지연 위험", v: `${SUMMARY.tailor.delayRisk}건`, s: "납기 재확인 필요" },
          {
            l: "평균 진행률",
            v: `${Math.round(PRODUCTION_JOBS.reduce((s, j) => s + j.progress, 0) / PRODUCTION_JOBS.length)}%`,
            s: "관리 대상 기준",
          },
        ].map((k) => (
          <Card key={k.l}>
            <div className="p-4">
              <p className="text-[12px] text-ink-500">{k.l}</p>
              <p className="mt-1.5 text-[19px] font-semibold text-ink-900 num">{k.v}</p>
              <p className="mt-1 text-[11px] text-ink-400">{k.s}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-3">
        <CardHeader title="제작 진행단계" desc="공정 순서" />
        <div className="p-4">
          <StageFlow stages={ORDER_STAGES} tone="tailor" current="납품" />
        </div>
      </Card>

      {/* 단계별 보드 */}
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {byStage.map((g) => (
          <Card key={g.stage} className="h-full">
            <div className="flex items-center justify-between border-b border-ink-200/60 px-3.5 py-2.5">
              <span className="text-[12.5px] font-semibold text-ink-800">{g.stage}</span>
              <span className="rounded bg-tailor-50 px-1.5 py-0.5 text-[11px] font-medium text-tailor-700 num">
                {g.jobs.length}
              </span>
            </div>
            <ul className="space-y-2 p-2.5">
              {g.jobs.map((j) => (
                <li
                  key={j.id}
                  className={cn(
                    "rounded-md border p-2.5",
                    j.status === "지연"
                      ? "border-rose-200 bg-rose-50/40"
                      : j.status === "지연 위험"
                        ? "border-amber-200 bg-amber-50/40"
                        : "border-ink-200 bg-white",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[12.5px] font-medium text-ink-800">
                      {j.customer} 님
                    </span>
                    <StatusBadge status={j.status} />
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-ink-400">{j.item}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Bar value={j.progress} color="#86293d" />
                    <span className="shrink-0 text-[11px] text-ink-500 num">{j.progress}%</span>
                  </div>
                  <p className="mt-1.5 text-[10.5px] text-ink-400">
                    {j.worker} · 납기 <span className="num">{j.dueAt.slice(5)}</span>
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-8">
          <Card>
            <CardHeader title="제작 작업 목록" desc={`${PRODUCTION_JOBS.length}건`} />
            <TableWrap>
              <Table>
                <thead>
                  <tr>
                    <Th>작업번호</Th>
                    <Th>주문번호</Th>
                    <Th>고객</Th>
                    <Th>품목</Th>
                    <Th>단계</Th>
                    <Th className="w-[150px]">진행률</Th>
                    <Th>담당</Th>
                    <Th>착수일</Th>
                    <Th>납기일</Th>
                    <Th>상태</Th>
                  </tr>
                </thead>
                <tbody>
                  {PRODUCTION_JOBS.map((j) => (
                    <Tr key={j.id}>
                      <Td className="text-ink-500 num">{j.id}</Td>
                      <Td className="text-ink-500 num">{j.orderId}</Td>
                      <Td className="font-medium text-ink-800">{j.customer}</Td>
                      <Td className="text-ink-600">{j.item}</Td>
                      <Td className="text-ink-600">{j.stage}</Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          <Bar value={j.progress} color="#86293d" className="w-[80px]" />
                          <span className="text-[11.5px] text-ink-500 num">{j.progress}%</span>
                        </div>
                      </Td>
                      <Td className="text-ink-600">{j.worker}</Td>
                      <Td className="text-ink-500 num">{j.startedAt}</Td>
                      <Td className="num">
                        {j.dueAt}
                        {j.riskDays > 0 ? (
                          <span className="ml-1 text-rose-600">+{j.riskDays}일</span>
                        ) : null}
                      </Td>
                      <Td>
                        <StatusBadge status={j.status} />
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableWrap>
          </Card>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <Card className="h-full">
            <CardHeader title="납기 위험 관리" desc={`${risky.length}건 확인 필요`} />
            <ul>
              {risky.map((j) => {
                const order = TAILOR_ORDERS.find((o) => o.id === j.orderId);
                return (
                  <li key={j.id} className="border-b border-ink-100 px-4 py-3 last:border-b-0">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle
                        className={cn(
                          "h-3.5 w-3.5",
                          j.status === "지연" ? "text-rose-500" : "text-amber-500",
                        )}
                      />
                      <span className="text-[12.5px] font-medium text-ink-800">
                        {j.customer} 님 · {j.item}
                      </span>
                    </div>
                    <p className="mt-1 text-[11.5px] text-ink-500">
                      {order?.note ?? "상세 사유 확인 필요"}
                    </p>
                    <p className="mt-1.5 text-[11px] text-ink-400">
                      납기 <span className="num">{j.dueAt}</span> · 담당 {j.worker}
                      {j.riskDays > 0 ? (
                        <span className="ml-1 font-medium text-rose-600 num">+{j.riskDays}일</span>
                      ) : null}
                    </p>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>

      <p className="mt-4 text-center text-[11px] text-ink-300">
        제작 작업 {num(PRODUCTION_JOBS.length)}건 (데모 데이터)
      </p>
    </div>
  );
}

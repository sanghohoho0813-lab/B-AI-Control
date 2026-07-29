"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, Plus } from "lucide-react";
import { RevenueTrendChart, StageBarChart } from "@/components/charts";
import { ExpenseModal, OrderDetailModal } from "@/components/modals";
import { KpiCard, MoreLink, PageHeader, StageFlow } from "@/components/page-kit";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Bar } from "@/components/ui/progress";
import { Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import {
  FABRICS,
  ORDER_FUNNEL,
  ORDER_STAGES,
  PRODUCTION_JOBS,
  REVENUE_TREND,
  SCHEDULES,
  SUMMARY,
  TAILOR_CUSTOMERS,
  TAILOR_ORDERS,
} from "@/lib/data";
import { cn, colorOf, num, won, wonShort } from "@/lib/utils";

const S = SUMMARY.tailor;

export default function TailorDashboardPage() {
  const funnelCounts = Object.fromEntries(ORDER_FUNNEL.map((f) => [f.stage, f.count]));
  const risky = PRODUCTION_JOBS.filter((j) => j.status !== "정상");
  const repurchase = [...TAILOR_CUSTOMERS]
    .sort((a, b) => b.repurchaseScore - a.repurchaseScore)
    .slice(0, 5);
  const lowFabrics = FABRICS.filter((f) => f.status !== "충분");
  const deliveries = TAILOR_ORDERS.filter((o) => ["제작", "가봉", "수정", "납품"].includes(o.stage));

  return (
    <div className="animate-fade-in">
      <PageHeader
        company="tailor"
        title="운영 대시보드"
        desc="상담부터 납품까지 맞춤정장 제작 흐름을 한 화면에서 관리합니다."
        actions={
          <>
            <ExpenseModal defaultCompany="tailor">
              <Button variant="outline">
                <Plus className="h-3.5 w-3.5" />
                집행 등록
              </Button>
            </ExpenseModal>
            <Button variant="tailor" asChild>
              <Link href="/tailor/orders">주문 관리</Link>
            </Button>
          </>
        }
      />

      {/* KPI 1행 */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <KpiCard
          company="tailor"
          label="이번 달 매출"
          value={won(S.revenue)}
          delta={S.revenueDelta}
          href="/tailor/sales"
          sub="(전월 대비)"
          className="col-span-2 lg:col-span-1"
        />
        <KpiCard label="신규 상담" value={`${S.newConsult}건`} sub="이번 달 누계" href="/tailor/customers" />
        <KpiCard label="주문 접수" value={`${S.orderCount}건`} sub={`평균 ${wonShort(S.avgOrderValue)}`} href="/tailor/orders" />
        <KpiCard label="제작 진행" value={`${S.inProduction}건`} sub="공방 작업 중" href="/tailor/production" />
        <KpiCard label="가봉 예정" value={`${S.fittingCount}건`} sub="2주 이내" href="/tailor/production" />
      </div>

      {/* KPI 2행 */}
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <KpiCard label="납품 예정" value={`${S.delivery}건`} sub="이번 달" href="/tailor/orders" />
        <KpiCard label="미수금" value={won(S.receivable)} sub="30일 초과 3건" href="/tailor/sales" />
        <KpiCard label="재구매 추천 고객" value={`${S.repurchase}명`} sub="구매 주기 도래" href="/tailor/analytics" />
        <KpiCard label="원단 부족 알림" value={`${S.fabricAlert}종`} sub="발주 검토 필요" href="/tailor/fabrics" />
        <KpiCard label="제작 지연 위험" value={`${S.delayRisk}건`} sub="납기 재확인" href="/tailor/production" />
      </div>

      {/* 주문 진행단계 */}
      <Card className="mt-3">
        <CardHeader
          title="주문 진행단계"
          desc="상담에서 납품까지 단계별 진행 건수"
          action={<MoreLink href="/tailor/orders" />}
        />
        <div className="p-4">
          <StageFlow stages={ORDER_STAGES} tone="tailor" counts={funnelCounts} current="납품" />
          <div className="mt-4 grid grid-cols-7 gap-2">
            {ORDER_FUNNEL.map((f) => (
              <div key={f.stage} className="rounded-md border border-ink-200/70 bg-ivory-100/50 p-2.5">
                <p className="text-[12.5px] text-ink-400">{f.stage}</p>
                <p className="mt-1 text-[19px] font-semibold text-ink-800 num">
                  {f.count}
                  <span className="ml-0.5 text-[12px] font-normal text-ink-400">건</span>
                </p>
                <p className="mt-0.5 text-[12px] text-ink-400 num">{wonShort(f.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="mt-3 grid grid-cols-12 gap-3">
        {/* 원단 재고 */}
        <div className="col-span-12 xl:col-span-8">
          <Card>
            <CardHeader
              title="주요 원단 재고"
              desc="배정 수량을 제외한 잔여 길이 기준"
              action={<MoreLink href="/tailor/fabrics" />}
            />
            <TableWrap>
              <Table>
                <thead>
                  <tr>
                    <Th>브랜드</Th>
                    <Th>원단명</Th>
                    <Th>품번</Th>
                    <Th>색상</Th>
                    <Th className="text-right">재고 길이</Th>
                    <Th className="text-right">배정 수량</Th>
                    <Th className="text-right">잔여 수량</Th>
                    <Th>재주문 상태</Th>
                  </tr>
                </thead>
                <tbody>
                  {FABRICS.slice(0, 7).map((f) => {
                    const remain = f.stockM - f.assignedM;
                    return (
                      <Tr key={f.id}>
                        <Td className="font-medium text-ink-800">{f.brand}</Td>
                        <Td>{f.name}</Td>
                        <Td className="text-ink-500 num">{f.code}</Td>
                        <Td>
                          <span className="flex items-center gap-1.5">
                            <span
                              className="h-3 w-3 rounded-sm border border-ink-200"
                              style={{ background: colorOf(f.color) }}
                            />
                            {f.color}
                          </span>
                        </Td>
                        <Td className="text-right num">{f.stockM.toFixed(1)}m</Td>
                        <Td className="text-right text-ink-500 num">{f.assignedM.toFixed(1)}m</Td>
                        <Td
                          className={cn(
                            "text-right font-medium num",
                            remain < 1.5 ? "text-rose-600" : "text-ink-800",
                          )}
                        >
                          {remain.toFixed(1)}m
                        </Td>
                        <Td>
                          <StatusBadge status={f.status} />
                        </Td>
                      </Tr>
                    );
                  })}
                </tbody>
              </Table>
            </TableWrap>
          </Card>
        </div>

        {/* 제작 지연 위험 */}
        <div className="col-span-12 xl:col-span-4">
          <Card className="h-full">
            <CardHeader
              title="제작 지연 위험"
              desc="납기 초과 · 지연 위험 건"
              action={<MoreLink href="/tailor/production" />}
            />
            <ul>
              {risky.map((j) => (
                <li key={j.id} className="border-b border-ink-100 px-4 py-3 last:border-b-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-[14px] font-medium text-ink-800">
                      <AlertTriangle
                        className={cn(
                          "h-3.5 w-3.5",
                          j.status === "지연" ? "text-rose-500" : "text-amber-500",
                        )}
                      />
                      {j.customer} 님 · {j.item}
                    </span>
                    <StatusBadge status={j.status} />
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Bar value={j.progress} color="#86293d" />
                    <span className="shrink-0 text-[12.5px] text-ink-500 num">{j.progress}%</span>
                  </div>
                  <p className="mt-1.5 text-[12.5px] text-ink-400">
                    담당 {j.worker} · 납기 <span className="num">{j.dueAt}</span>
                    {j.riskDays > 0 ? (
                      <span className="ml-1 font-medium text-rose-600 num">+{j.riskDays}일</span>
                    ) : null}
                  </p>
                </li>
              ))}
            </ul>
            <div className="p-3">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/tailor/production">제작·납기 전체 보기</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-12 gap-3">
        {/* 납품/제작 예정 주문 */}
        <div className="col-span-12 xl:col-span-5">
          <Card className="h-full">
            <CardHeader
              title="진행 중 주문"
              desc="제작 이후 단계 주문"
              action={<MoreLink href="/tailor/orders" />}
            />
            <ul>
              {deliveries.map((o) => (
                <li key={o.id} className="border-b border-ink-100 last:border-b-0">
                  <OrderDetailModal order={o}>
                    <button className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-ivory-100">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-medium text-ink-800">
                          {o.customer} 님 · {o.item}
                        </span>
                        <span className="block truncate text-[12.5px] text-ink-400">
                          {o.fabric}
                        </span>
                      </span>
                      <Badge className="border-tailor-200 bg-tailor-50 text-tailor-700">
                        {o.stage}
                      </Badge>
                      <span className="w-[74px] shrink-0 text-right text-[13px] text-ink-500 num">
                        {o.dueAt.slice(5)}
                      </span>
                    </button>
                  </OrderDetailModal>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* 재구매 추천 고객 */}
        <div className="col-span-12 xl:col-span-4">
          <Card className="h-full">
            <CardHeader
              title="재구매 추천 고객"
              desc="구매 주기 · 누적 금액 기준"
              action={<MoreLink href="/tailor/analytics" />}
            />
            <ul>
              {repurchase.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center gap-3 border-b border-ink-100 px-4 py-2.5 last:border-b-0"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-tailor-50 text-[12.5px] font-semibold text-tailor-700">
                    {c.name.slice(0, 1)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-[14px] font-medium text-ink-800">
                        {c.name}
                      </span>
                      <StatusBadge status={c.grade} />
                    </span>
                    <span className="block truncate text-[12.5px] text-ink-400">{c.nextAction}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-[14px] font-semibold text-ink-800 num">
                      {c.repurchaseScore}
                    </span>
                    <span className="block text-[11.5px] text-ink-400">추천도</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* 원단 부족 알림 */}
        <div className="col-span-12 xl:col-span-3">
          <Card className="h-full">
            <CardHeader title="원단 부족 알림" desc={`발주 검토 ${lowFabrics.length}종`} />
            <ul>
              {lowFabrics.map((f) => (
                <li
                  key={f.id}
                  className="flex items-center gap-2.5 border-b border-ink-100 px-4 py-2.5 last:border-b-0"
                >
                  <span
                    className="h-7 w-7 shrink-0 rounded border border-ink-200"
                    style={{ background: colorOf(f.color) }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium text-ink-700">
                      {f.brand}
                    </span>
                    <span className="block truncate text-[12.5px] text-ink-400">
                      {f.name} · 리드타임 {f.leadTimeDays}일
                    </span>
                  </span>
                  <StatusBadge status={f.status} />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-7">
          <Card>
            <CardHeader title="매출 추이" desc="최근 6개월 · 비앤테일러샵" />
            <div className="p-3.5">
              <RevenueTrendChart data={REVENUE_TREND} height={230} series="tailor" showLegend={false} />
            </div>
          </Card>
        </div>
        <div className="col-span-12 xl:col-span-5">
          <Card className="h-full">
            <CardHeader title="단계별 주문 분포" desc="이번 달 기준 건수" />
            <div className="p-3.5">
              <StageBarChart
                data={ORDER_FUNNEL.map((f) => ({ name: f.stage, value: f.count }))}
                color="#86293d"
                height={230}
              />
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-3">
        <CardHeader title="이번 주 매장 일정" desc="상담 · 가봉 · 납품 · 발주" action={<MoreLink href="/schedule" />} />
        <div className="grid grid-cols-1 divide-y divide-ink-100 md:grid-cols-4 md:divide-x md:divide-y-0">
          {SCHEDULES.filter((s) => s.company === "tailor")
            .slice(0, 4)
            .map((s) => (
              <div key={s.id} className="p-3.5">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-ink-400 num">{s.date.slice(5)}</span>
                  <Badge className="border-tailor-200 bg-tailor-50 text-tailor-700">{s.kind}</Badge>
                  <span className="ml-auto text-[13px] text-ink-400 num">{s.time}</span>
                </div>
                <p className="mt-1.5 text-[14px] font-medium text-ink-800">{s.title}</p>
                <p className="mt-0.5 text-[12.5px] text-ink-400">
                  {s.place} · {s.owner}
                </p>
              </div>
            ))}
        </div>
      </Card>

      <p className="mt-4 text-center text-[12.5px] text-ink-300">
        비앤테일러샵 · 청담 매장 · 누적 고객 {num(TAILOR_CUSTOMERS.length * 41)}명 (데모 데이터)
      </p>
    </div>
  );
}

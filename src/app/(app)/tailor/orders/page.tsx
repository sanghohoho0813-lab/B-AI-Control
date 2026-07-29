"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { StageBarChart } from "@/components/charts";
import { OrderDetailModal } from "@/components/modals";
import { PageHeader, StageFlow } from "@/components/page-kit";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import { ORDER_FUNNEL, ORDER_STAGES, SUMMARY, TAILOR_ORDERS } from "@/lib/data";
import { cn, num, won, wonShort } from "@/lib/utils";
import type { OrderStage } from "@/lib/types";

export default function OrdersPage() {
  const [stage, setStage] = React.useState<OrderStage | "전체">("전체");
  const items = TAILOR_ORDERS.filter((o) => stage === "전체" || o.stage === stage);
  const counts = Object.fromEntries(ORDER_FUNNEL.map((f) => [f.stage, f.count]));
  const totalAmount = items.reduce((s, o) => s + o.amount, 0);
  const unpaid = items.reduce((s, o) => s + (o.amount - o.deposit), 0);

  return (
    <div className="animate-fade-in">
      <PageHeader
        company="tailor"
        title="주문 관리"
        desc="상담 → 치수 측정 → 원단 선택 → 제작 → 가봉 → 수정 → 납품 단계로 주문을 관리합니다."
        actions={
          <Button variant="tailor">
            <Plus className="h-3.5 w-3.5" />
            주문 등록
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { l: "이번 달 주문", v: `${SUMMARY.tailor.orderCount}건`, s: `평균 ${wonShort(SUMMARY.tailor.avgOrderValue)}` },
          { l: "진행 중 주문", v: `${TAILOR_ORDERS.length}건`, s: "상세 관리 대상" },
          { l: "표시 주문 금액", v: won(totalAmount), s: `${items.length}건 합계` },
          { l: "잔금 합계", v: won(unpaid), s: "계약금 제외" },
        ].map((k) => (
          <Card key={k.l}>
            <div className="p-4">
              <p className="text-[16px] text-ink-500">{k.l}</p>
              <p className="mt-1.5 text-[25px] font-semibold text-ink-900 num">{k.v}</p>
              <p className="mt-1 text-[15px] text-ink-400">{k.s}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-3">
        <CardHeader title="주문 진행단계" desc="단계를 클릭하면 해당 단계 주문만 표시됩니다" />
        <div className="p-4">
          <StageFlow stages={ORDER_STAGES} tone="tailor" counts={counts} current="납품" />
          <div className="mt-3 flex flex-wrap gap-1.5">
            <button
              onClick={() => setStage("전체")}
              className={cn(
                "rounded border px-2.5 py-1 text-[16px] transition-colors",
                stage === "전체"
                  ? "border-ink-800 bg-ink-800 text-white"
                  : "border-ink-200 bg-white text-ink-500 hover:bg-ink-50",
              )}
            >
              전체
            </button>
            {ORDER_STAGES.map((s) => (
              <button
                key={s}
                onClick={() => setStage(s)}
                className={cn(
                  "rounded border px-2.5 py-1 text-[16px] transition-colors",
                  stage === s
                    ? "border-tailor-600 bg-tailor-600 text-white"
                    : "border-ink-200 bg-white text-ink-500 hover:bg-ink-50",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="mt-3 grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-8">
          <Card>
            <CardHeader title="주문 목록" desc={`${items.length}건 · 행을 클릭하면 상세가 열립니다`} />
            <TableWrap>
              <Table>
                <thead>
                  <tr>
                    <Th>주문번호</Th>
                    <Th>고객</Th>
                    <Th>제작 품목</Th>
                    <Th>원단</Th>
                    <Th>단계</Th>
                    <Th className="text-right">금액</Th>
                    <Th>가봉일</Th>
                    <Th>납기일</Th>
                    <Th>상태</Th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((o) => (
                    <Tr key={o.id}>
                      <Td className="text-ink-500 num">{o.id}</Td>
                      <Td>
                        <OrderDetailModal order={o}>
                          <button className="font-medium text-ink-800 hover:text-tailor-700 hover:underline">
                            {o.customer}
                          </button>
                        </OrderDetailModal>
                      </Td>
                      <Td className="text-ink-600">{o.item}</Td>
                      <Td className="max-w-[230px] truncate text-ink-500">{o.fabric}</Td>
                      <Td>
                        <Badge className="border-tailor-200 bg-tailor-50 text-tailor-700">
                          {o.stage}
                        </Badge>
                      </Td>
                      <Td className="text-right font-medium num">{won(o.amount)}</Td>
                      <Td className="text-ink-500 num">{o.fittingAt ?? "-"}</Td>
                      <Td className="num">{o.dueAt}</Td>
                      <Td>
                        <StatusBadge status={o.status} />
                      </Td>
                    </Tr>
                  ))}
                  {items.length === 0 ? (
                    <tr>
                      <Td colSpan={9} className="py-12 text-center text-ink-400">
                        해당 단계의 주문이 없습니다.
                      </Td>
                    </tr>
                  ) : null}
                </tbody>
              </Table>
            </TableWrap>
          </Card>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <Card className="h-full">
            <CardHeader title="단계별 주문 분포" desc="이번 달 전체 기준" />
            <div className="p-3.5">
              <StageBarChart
                data={ORDER_FUNNEL.map((f) => ({ name: f.stage, value: f.count }))}
                color="#86293d"
                height={240}
              />
              <ul className="mt-2 space-y-1 border-t border-ink-100 pt-2.5">
                {ORDER_FUNNEL.map((f) => (
                  <li key={f.stage} className="flex items-center justify-between text-[15.5px]">
                    <span className="text-ink-500">{f.stage}</span>
                    <span className="text-ink-700 num">
                      {f.count}건 · {wonShort(f.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </div>

      <p className="mt-4 text-center text-[15px] text-ink-300">
        표시 주문 {num(items.length)}건 (데모 데이터)
      </p>
    </div>
  );
}

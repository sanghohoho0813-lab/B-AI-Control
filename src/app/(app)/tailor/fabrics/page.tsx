"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-kit";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import { FABRICS } from "@/lib/data";
import { cn, colorOf, num, won } from "@/lib/utils";
import type { FabricStatus } from "@/lib/types";

const STATUSES: (FabricStatus | "전체")[] = ["전체", "재고 부족", "발주 권장", "발주 완료", "충분"];

export default function FabricsPage() {
  const [status, setStatus] = React.useState<FabricStatus | "전체">("전체");
  const items = FABRICS.filter((f) => status === "전체" || f.status === status);

  const totalStock = FABRICS.reduce((s, f) => s + f.stockM, 0);
  const totalAssigned = FABRICS.reduce((s, f) => s + f.assignedM, 0);
  const stockValue = FABRICS.reduce((s, f) => s + f.stockM * f.unitPrice, 0);
  const shortage = FABRICS.filter((f) => f.status === "재고 부족").length;

  return (
    <div className="animate-fade-in">
      <PageHeader
        company="tailor"
        title="원단·재고"
        desc="브랜드별 원단 재고와 배정 수량, 재주문 상태를 관리합니다."
        actions={
          <Button variant="tailor">
            <Plus className="h-3.5 w-3.5" />
            원단 발주
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          { l: "등록 원단", v: `${FABRICS.length}종`, s: "브랜드 6개사" },
          { l: "총 재고 길이", v: `${totalStock.toFixed(1)}m`, s: "전체 합계" },
          { l: "배정 수량", v: `${totalAssigned.toFixed(1)}m`, s: "진행 주문 배정분" },
          { l: "잔여 수량", v: `${(totalStock - totalAssigned).toFixed(1)}m`, s: "즉시 사용 가능" },
          { l: "재고 평가액", v: won(Math.round(stockValue)), s: `부족 ${shortage}종` },
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
        <CardHeader
          title="원단 재고 테이블"
          desc={`${items.length}종 · 잔여 수량 = 재고 길이 − 배정 수량`}
          action={
            <div className="flex items-center gap-1 rounded-md border border-ink-200 p-0.5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={cn(
                    "rounded px-2 py-1 text-[15.5px] transition-colors",
                    status === s ? "bg-tailor-600 text-white" : "text-ink-500 hover:bg-ink-50",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          }
        />
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>브랜드</Th>
                <Th>원단명</Th>
                <Th>품번</Th>
                <Th>색상</Th>
                <Th>혼용률</Th>
                <Th className="text-right">재고 길이</Th>
                <Th className="text-right">배정 수량</Th>
                <Th className="text-right">잔여 수량</Th>
                <Th className="text-right">m당 단가</Th>
                <Th>리드타임</Th>
                <Th>재주문 상태</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {items.map((f) => {
                const remain = f.stockM - f.assignedM;
                return (
                  <Tr key={f.id}>
                    <Td className="font-medium text-ink-800">{f.brand}</Td>
                    <Td className="text-ink-700">{f.name}</Td>
                    <Td className="text-ink-500 num">{f.code}</Td>
                    <Td>
                      <span className="flex items-center gap-1.5">
                        <span
                          className="h-3.5 w-3.5 rounded-sm border border-ink-200"
                          style={{ background: colorOf(f.color) }}
                        />
                        {f.color}
                      </span>
                    </Td>
                    <Td className="text-ink-500">{f.composition}</Td>
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
                    <Td className="text-right num">{won(f.unitPrice)}</Td>
                    <Td className="text-ink-500 num">{f.leadTimeDays}일</Td>
                    <Td>
                      <StatusBadge status={f.status} />
                    </Td>
                    <Td>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            발주
                          </Button>
                        </DialogTrigger>
                        <DialogContent
                          title={`${f.brand} ${f.name} 발주`}
                          desc={`${f.code} · ${f.color} · 리드타임 ${f.leadTimeDays}일`}
                          className="max-w-md"
                        >
                          <div className="space-y-3 px-5 py-4">
                            <div className="flex items-center gap-3 rounded-md border border-ink-200 bg-ivory-100/60 p-3">
                              <span
                                className="h-12 w-12 rounded border border-ink-200"
                                style={{ background: colorOf(f.color) }}
                              />
                              <div>
                                <p className="text-[17.5px] font-medium text-ink-800">
                                  {f.brand} {f.name}
                                </p>
                                <p className="mt-0.5 text-[15.5px] text-ink-400">{f.composition}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center">
                              {[
                                { l: "재고", v: `${f.stockM.toFixed(1)}m` },
                                { l: "배정", v: `${f.assignedM.toFixed(1)}m` },
                                { l: "잔여", v: `${remain.toFixed(1)}m` },
                              ].map((r) => (
                                <div key={r.l} className="rounded-md border border-ink-200 py-2.5">
                                  <p className="text-[15px] text-ink-400">{r.l}</p>
                                  <p className="mt-1 text-[17.5px] font-semibold text-ink-800 num">
                                    {r.v}
                                  </p>
                                </div>
                              ))}
                            </div>
                            <div>
                              <p className="text-[15.5px] text-ink-500">권장 발주 수량</p>
                              <p className="mt-1 text-[20.5px] font-semibold text-tailor-700 num">
                                {Math.max(10, Math.ceil(f.assignedM * 2))}m ·{" "}
                                {won(Math.max(10, Math.ceil(f.assignedM * 2)) * f.unitPrice)}
                              </p>
                              <p className="mt-1 text-[15px] text-ink-400">
                                최근 3개월 소진 속도와 진행 주문 배정량을 반영한 수치입니다.
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 border-t border-ink-200/60 bg-ivory-100/40 px-5 py-3">
                            <Button variant="outline" size="sm">
                              견적 요청
                            </Button>
                            <Button variant="tailor" size="sm">
                              발주 확정
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        </TableWrap>
      </Card>

      <p className="mt-4 text-center text-[15px] text-ink-300">
        표시 원단 {num(items.length)}종 (데모 데이터)
      </p>
    </div>
  );
}

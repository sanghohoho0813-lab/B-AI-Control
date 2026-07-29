"use client";

import * as React from "react";
import { UserPlus } from "lucide-react";
import { PageHeader } from "@/components/page-kit";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import { Bar } from "@/components/ui/progress";
import { SUMMARY, TAILOR_CUSTOMERS, TAILOR_ORDERS } from "@/lib/data";
import { cn, num, won } from "@/lib/utils";
import type { CustomerGrade } from "@/lib/types";

const GRADES: (CustomerGrade | "전체")[] = ["전체", "VIP", "우수", "신규", "일반"];

export default function CustomersPage() {
  const [grade, setGrade] = React.useState<CustomerGrade | "전체">("전체");
  const [q, setQ] = React.useState("");

  const items = TAILOR_CUSTOMERS.filter(
    (c) =>
      (grade === "전체" || c.grade === grade) &&
      (q === "" || c.name.includes(q) || c.company.includes(q)),
  );

  const total = TAILOR_CUSTOMERS.reduce((s, c) => s + c.totalAmount, 0);

  return (
    <div className="animate-fade-in">
      <PageHeader
        company="tailor"
        title="고객 관리"
        desc="상담 이력과 치수, 선호 원단을 기준으로 고객을 관리합니다."
        actions={
          <Button variant="tailor">
            <UserPlus className="h-3.5 w-3.5" />
            고객 등록
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          { l: "관리 고객", v: `${TAILOR_CUSTOMERS.length}명`, s: "주요 고객 기준" },
          { l: "VIP 고객", v: `${TAILOR_CUSTOMERS.filter((c) => c.grade === "VIP").length}명`, s: "누적 3천만원 이상" },
          { l: "이번 달 신규 상담", v: `${SUMMARY.tailor.newConsult}건`, s: "예약 상담 포함" },
          { l: "재구매 추천", v: `${SUMMARY.tailor.repurchase}명`, s: "구매 주기 도래" },
          { l: "누적 구매액", v: won(total), s: "주요 고객 합계" },
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
          title="고객 목록"
          desc={`${items.length}명`}
          action={
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="고객명 · 소속 검색"
                className="w-full max-w-[180px] rounded-md border border-ink-200 px-2.5 py-1.5 text-[16px] outline-none placeholder:text-ink-300 focus:border-ink-400"
              />
              <div className="flex flex-wrap items-center gap-1 rounded-md border border-ink-200 p-0.5">
                {GRADES.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGrade(g)}
                    className={cn(
                      "rounded px-2 py-1 text-[15.5px] transition-colors",
                      grade === g ? "bg-tailor-600 text-white" : "text-ink-500 hover:bg-ink-50",
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          }
        />
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>고객</Th>
                <Th>등급</Th>
                <Th>소속</Th>
                <Th>연락처</Th>
                <Th className="text-right">방문</Th>
                <Th className="text-right">누적 구매액</Th>
                <Th>선호 원단</Th>
                <Th>최근 방문</Th>
                <Th className="w-[130px]">재구매 추천도</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <Tr key={c.id}>
                  <Td>
                    <span className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tailor-50 text-[14.5px] font-semibold text-tailor-700">
                        {c.name.slice(0, 1)}
                      </span>
                      <span className="font-medium text-ink-800">{c.name}</span>
                    </span>
                  </Td>
                  <Td>
                    <StatusBadge status={c.grade} />
                  </Td>
                  <Td className="text-ink-600">{c.company}</Td>
                  <Td className="text-ink-500 num">{c.phone}</Td>
                  <Td className="text-right num">{c.visits}회</Td>
                  <Td className="text-right font-medium num">{won(c.totalAmount)}</Td>
                  <Td className="max-w-[220px] truncate text-ink-600">{c.preferredFabric}</Td>
                  <Td className="text-ink-500 num">{c.lastVisit}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Bar value={c.repurchaseScore} color="#86293d" className="w-[60px]" />
                      <span className="text-[15.5px] text-ink-500 num">{c.repurchaseScore}</span>
                    </div>
                  </Td>
                  <Td>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          상세
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        title={`${c.name} 님`}
                        desc={`${c.id} · ${c.company} · ${c.grade} 고객`}
                      >
                        <div className="grid gap-x-6 px-5 py-2 sm:grid-cols-2">
                          {[
                            { l: "연락처", v: c.phone },
                            { l: "첫 방문", v: c.firstVisit },
                            { l: "최근 방문", v: c.lastVisit },
                            { l: "방문 횟수", v: `${c.visits}회` },
                            { l: "누적 구매액", v: won(c.totalAmount) },
                            { l: "선호 원단", v: c.preferredFabric },
                            { l: "치수", v: c.size },
                            { l: "재구매 추천도", v: `${c.repurchaseScore}점` },
                          ].map((f) => (
                            <div key={f.l} className="border-b border-ink-100 py-2.5">
                              <p className="text-[15px] text-ink-400">{f.l}</p>
                              <p className="mt-1 text-[17.5px] text-ink-800 num">{f.v}</p>
                            </div>
                          ))}
                        </div>
                        <div className="px-5 py-4">
                          <p className="text-[15px] text-ink-400">다음 액션</p>
                          <p className="mt-1.5 rounded-md border border-tailor-200 bg-tailor-50/50 px-3 py-2.5 text-[17px] text-tailor-800">
                            {c.nextAction}
                          </p>
                          <p className="mt-3 text-[15px] text-ink-400">주문 이력</p>
                          <ul className="mt-1.5 space-y-1">
                            {TAILOR_ORDERS.filter((o) => o.customerId === c.id).map((o) => (
                              <li
                                key={o.id}
                                className="flex items-center justify-between rounded border border-ink-200 px-3 py-2 text-[16px]"
                              >
                                <span className="text-ink-700">{o.item}</span>
                                <span className="text-ink-400">{o.stage}</span>
                                <span className="font-medium text-ink-800 num">{won(o.amount)}</span>
                              </li>
                            ))}
                            {TAILOR_ORDERS.filter((o) => o.customerId === c.id).length === 0 ? (
                              <li className="rounded border border-ink-200 px-3 py-3 text-center text-[16px] text-ink-400">
                                진행 중인 주문이 없습니다.
                              </li>
                            ) : null}
                          </ul>
                        </div>
                        <div className="flex justify-end gap-2 border-t border-ink-200/60 bg-ivory-100/40 px-5 py-3">
                          <Button variant="outline" size="sm">
                            상담 예약
                          </Button>
                          <Button variant="tailor" size="sm">
                            주문 등록
                          </Button>
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

      <p className="mt-4 text-center text-[15px] text-ink-300">
        표시 고객 {num(items.length)}명 (데모 데이터)
      </p>
    </div>
  );
}

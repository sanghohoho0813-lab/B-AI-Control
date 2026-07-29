"use client";

import * as React from "react";
import { useApp } from "@/components/app-store";
import { CompanyChip, PageHeader } from "@/components/page-kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import { APPROVALS, APPROVAL_KINDS } from "@/lib/data";
import { cn, num, won } from "@/lib/utils";

export default function ApprovalsPage() {
  const { scope } = useApp();
  const [kind, setKind] = React.useState<string>("전체");
  const [decision, setDecision] = React.useState<Record<string, "승인" | "보류">>({});

  const all = APPROVALS.filter((a) => scope === "all" || a.company === scope);
  const items = all.filter((a) => kind === "전체" || a.kind === kind);
  const amount = all.reduce((s, a) => s + (a.amount ?? 0), 0);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="승인 업무"
        desc="대표자 결재가 필요한 자금 집행 · 주문 · 일정 변경 · 보고서를 모았습니다."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { l: "승인 대기", v: `${all.length}건`, s: "전체 결재 대상" },
          { l: "요청 금액", v: won(amount), s: "자금 집행 · 주문" },
          {
            l: "처리 완료",
            v: `${Object.keys(decision).length}건`,
            s: "이번 세션 기준",
          },
          {
            l: "긴급 결재",
            v: `${all.filter((a) => a.kind === "자금 집행 승인").length}건`,
            s: "자금 집행 승인",
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
        <CardHeader
          title="결재 목록"
          desc={`${items.length}건`}
          action={
            <div className="flex items-center gap-1 rounded-md border border-ink-200 p-0.5">
              {(["전체", ...APPROVAL_KINDS] as string[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setKind(k)}
                  className={cn(
                    "rounded px-2 py-1 text-[11.5px] transition-colors",
                    kind === k ? "bg-ink-800 text-white" : "text-ink-500 hover:bg-ink-50",
                  )}
                >
                  {k}
                </button>
              ))}
            </div>
          }
        />
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>회사</Th>
                <Th>구분</Th>
                <Th>결재 내용</Th>
                <Th>상세</Th>
                <Th className="text-right">금액</Th>
                <Th>요청자</Th>
                <Th>요청 시각</Th>
                <Th className="text-right">처리</Th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <Tr key={a.id}>
                  <Td>
                    <CompanyChip company={a.company} />
                  </Td>
                  <Td>
                    <Badge className="border-ink-200 bg-ink-50 text-ink-600">{a.kind}</Badge>
                  </Td>
                  <Td className="font-medium text-ink-800">{a.title}</Td>
                  <Td className="text-ink-500">{a.detail}</Td>
                  <Td className="text-right font-medium num">{a.amount ? won(a.amount) : "-"}</Td>
                  <Td className="text-ink-600">{a.requestedBy}</Td>
                  <Td className="text-ink-500">{a.at}</Td>
                  <Td className="text-right">
                    {decision[a.id] ? (
                      <span
                        className={cn(
                          "text-[12px] font-medium",
                          decision[a.id] === "승인" ? "text-emerald-600" : "text-ink-500",
                        )}
                      >
                        {decision[a.id]} 완료
                      </span>
                    ) : (
                      <span className="flex justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDecision((p) => ({ ...p, [a.id]: "보류" }))}
                        >
                          보류
                        </Button>
                        <Button
                          size="sm"
                          variant={a.company === "tailor" ? "tailor" : "corp"}
                          onClick={() => setDecision((p) => ({ ...p, [a.id]: "승인" }))}
                        >
                          승인
                        </Button>
                      </span>
                    )}
                  </Td>
                </Tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <Td colSpan={8} className="py-12 text-center text-ink-400">
                    해당 조건의 결재 건이 없습니다.
                  </Td>
                </tr>
              ) : null}
            </tbody>
          </Table>
        </TableWrap>
      </Card>

      <p className="mt-4 text-center text-[11px] text-ink-300">
        결재 대상 {num(all.length)}건 (데모 데이터)
      </p>
    </div>
  );
}

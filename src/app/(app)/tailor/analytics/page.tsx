"use client";

import { CategoryDonut, StageBarChart } from "@/components/charts";
import { PageHeader } from "@/components/page-kit";
import { StatusBadge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Bar } from "@/components/ui/progress";
import { Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import { FABRICS, SUMMARY, TAILOR_CUSTOMERS } from "@/lib/data";
import { num, pct, won, wonShort } from "@/lib/utils";
import type { CustomerGrade } from "@/lib/types";

const COLORS = ["#6f1f31", "#86293d", "#bf6b7c", "#d9a0ab"];
const GRADES: CustomerGrade[] = ["VIP", "우수", "신규", "일반"];

export default function TailorAnalyticsPage() {
  const gradeMix = GRADES.map((g) => ({
    name: g,
    value: TAILOR_CUSTOMERS.filter((c) => c.grade === g).length,
  }));

  const fabricPref = FABRICS.map((f) => ({
    name: f.brand.split(" ")[0],
    value: TAILOR_CUSTOMERS.filter((c) => c.preferredFabric.includes(f.brand)).length,
  })).filter((r) => r.value > 0);

  const repurchase = [...TAILOR_CUSTOMERS].sort((a, b) => b.repurchaseScore - a.repurchaseScore);
  const total = TAILOR_CUSTOMERS.reduce((s, c) => s + c.totalAmount, 0);
  const avgVisits =
    TAILOR_CUSTOMERS.reduce((s, c) => s + c.visits, 0) / TAILOR_CUSTOMERS.length;

  return (
    <div className="animate-fade-in">
      <PageHeader
        company="tailor"
        title="고객 분석"
        desc="등급 · 재구매 주기 · 선호 원단 관점에서 고객을 분석합니다."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          { l: "관리 고객", v: `${TAILOR_CUSTOMERS.length}명`, s: "주요 고객" },
          { l: "평균 방문 횟수", v: `${avgVisits.toFixed(1)}회`, s: "누적 기준" },
          { l: "평균 누적 구매액", v: won(Math.round(total / TAILOR_CUSTOMERS.length)), s: "1인 기준" },
          { l: "재구매 추천 고객", v: `${SUMMARY.tailor.repurchase}명`, s: "구매 주기 도래" },
          {
            l: "VIP 비중",
            v: `${pct(TAILOR_CUSTOMERS.filter((c) => c.grade === "VIP").length, TAILOR_CUSTOMERS.length)}%`,
            s: "등급 기준",
          },
        ].map((k) => (
          <Card key={k.l}>
            <div className="p-4">
              <p className="text-[12px] text-ink-500">{k.l}</p>
              <p className="mt-1.5 text-[18px] font-semibold text-ink-900 num">{k.v}</p>
              <p className="mt-1 text-[11px] text-ink-400">{k.s}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-12 gap-3">
        <div className="col-span-12 md:col-span-6 xl:col-span-4">
          <Card className="h-full">
            <CardHeader title="고객 등급 분포" desc="등급별 인원" />
            <div className="p-3.5">
              <CategoryDonut
                data={gradeMix}
                colors={COLORS}
                height={190}
                centerTop={`${TAILOR_CUSTOMERS.length}명`}
                centerBottom="관리 고객"
              />
              <ul className="mt-2 space-y-1.5 border-t border-ink-100 pt-2.5">
                {gradeMix.map((g, i) => (
                  <li key={g.name} className="flex items-center gap-2 text-[11.5px]">
                    <span className="h-2 w-2 rounded-sm" style={{ background: COLORS[i] }} />
                    <span className="flex-1 text-ink-500">{g.name}</span>
                    <span className="text-ink-700 num">{g.value}명</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        <div className="col-span-12 md:col-span-6 xl:col-span-4">
          <Card className="h-full">
            <CardHeader title="선호 원단 브랜드" desc="고객 선호 기준" />
            <div className="p-3.5">
              <StageBarChart data={fabricPref} color="#86293d" height={230} />
            </div>
          </Card>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <Card className="h-full">
            <CardHeader title="등급별 누적 구매액" desc="구매 기여도" />
            <ul className="p-3.5">
              {GRADES.map((g) => {
                const sum = TAILOR_CUSTOMERS.filter((c) => c.grade === g).reduce(
                  (s, c) => s + c.totalAmount,
                  0,
                );
                return (
                  <li key={g} className="border-b border-ink-100 py-3 last:border-b-0">
                    <div className="flex items-center justify-between">
                      <StatusBadge status={g} />
                      <span className="text-[12.5px] font-medium text-ink-800 num">
                        {won(sum)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Bar value={pct(sum, total)} color="#86293d" />
                      <span className="w-9 shrink-0 text-right text-[11px] text-ink-500 num">
                        {pct(sum, total)}%
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>

      <Card className="mt-3">
        <CardHeader
          title="재구매 추천 고객"
          desc="구매 주기 · 누적 금액 · 최근 방문일을 기준으로 산출한 추천도"
        />
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>고객</Th>
                <Th>등급</Th>
                <Th>소속</Th>
                <Th className="text-right">방문</Th>
                <Th className="text-right">누적 구매액</Th>
                <Th>최근 방문</Th>
                <Th className="w-[160px]">재구매 추천도</Th>
                <Th>권장 액션</Th>
              </tr>
            </thead>
            <tbody>
              {repurchase.map((c) => (
                <Tr key={c.id}>
                  <Td className="font-medium text-ink-800">{c.name}</Td>
                  <Td>
                    <StatusBadge status={c.grade} />
                  </Td>
                  <Td className="text-ink-600">{c.company}</Td>
                  <Td className="text-right num">{c.visits}회</Td>
                  <Td className="text-right num">{wonShort(c.totalAmount)}</Td>
                  <Td className="text-ink-500 num">{c.lastVisit}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Bar value={c.repurchaseScore} color="#86293d" className="w-[80px]" />
                      <span className="text-[11.5px] font-medium text-ink-700 num">
                        {c.repurchaseScore}
                      </span>
                    </div>
                  </Td>
                  <Td className="text-ink-600">{c.nextAction}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      </Card>

      <p className="mt-4 text-center text-[11px] text-ink-300">
        분석 대상 고객 {num(TAILOR_CUSTOMERS.length)}명 (데모 데이터)
      </p>
    </div>
  );
}

"use client";

import { StageBarChart } from "@/components/charts";
import { PageHeader, StageFlow } from "@/components/page-kit";
import { StatusBadge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Bar } from "@/components/ui/progress";
import { Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import { COMMERCIALIZATION_FUNNEL, DEALS, PROJECT_PHASES, SUMMARY } from "@/lib/data";
import { num, pct, won, wonShort } from "@/lib/utils";

export default function BizPage() {
  const closed = DEALS.filter((d) => d.status === "계약 완료");
  const pipeline = DEALS.filter((d) => d.status !== "계약 완료");
  const pipelineAmount = pipeline.reduce((s, d) => s + d.amount, 0);
  const weighted = pipeline.reduce((s, d) => s + (d.amount * d.probability) / 100, 0);
  const mrr = DEALS.reduce((s, d) => s + d.monthly, 0);
  const counts = Object.fromEntries(COMMERCIALIZATION_FUNNEL.map((f) => [f.phase, f.count]));

  return (
    <div className="animate-fade-in">
      <PageHeader
        company="corp"
        title="사업화 관리"
        desc="PoC부터 유료 계약, 반복 판매까지 사업화 성과를 관리합니다."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          { l: "PoC 고객", v: `${SUMMARY.corp.poc}개사`, s: "검증 진행" },
          { l: "유료 계약", v: `${SUMMARY.corp.paid}건`, s: `이번 달 신규 ${SUMMARY.corp.newContract}건` },
          { l: "계약 완료 금액", v: won(closed.reduce((s, d) => s + d.amount, 0)), s: `${closed.length}건` },
          { l: "파이프라인", v: won(pipelineAmount), s: `${pipeline.length}건 진행` },
          { l: "월 반복 매출", v: won(mrr), s: "구독 계약 합계" },
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

      <Card className="mt-3">
        <CardHeader title="사업화 단계" desc="아이디어 → 기획 → MVP → PoC → 유료화 → 반복 판매" />
        <div className="p-4">
          <StageFlow stages={PROJECT_PHASES} tone="corp" counts={counts} current="반복 판매" />
          <div className="mt-4 grid grid-cols-3 gap-2 md:grid-cols-6">
            {COMMERCIALIZATION_FUNNEL.map((f) => (
              <div key={f.phase} className="rounded-md border border-ink-200/70 bg-ivory-100/50 p-2.5">
                <p className="text-[11px] text-ink-400">{f.phase}</p>
                <p className="mt-1 text-[17px] font-semibold text-ink-800 num">
                  {f.count}
                  <span className="ml-0.5 text-[10.5px] font-normal text-ink-400">건</span>
                </p>
                <p className="mt-0.5 text-[10.5px] text-ink-400 num">
                  {f.amount ? wonShort(f.amount) : "매출 미발생"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="mt-3 grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-8">
          <Card>
            <CardHeader
              title="고객사 · 계약 현황"
              desc={`가중 예상 매출 ${won(Math.round(weighted))}`}
            />
            <TableWrap>
              <Table>
                <thead>
                  <tr>
                    <Th>고객사</Th>
                    <Th>관련 프로젝트</Th>
                    <Th>단계</Th>
                    <Th className="text-right">계약 규모</Th>
                    <Th className="text-right">월 구독료</Th>
                    <Th className="w-[130px]">성사 확률</Th>
                    <Th>담당</Th>
                    <Th>시작일</Th>
                    <Th>종료 예정</Th>
                    <Th>상태</Th>
                  </tr>
                </thead>
                <tbody>
                  {DEALS.map((d) => (
                    <Tr key={d.id}>
                      <Td className="font-medium text-ink-800">{d.client}</Td>
                      <Td className="text-ink-600">{d.project}</Td>
                      <Td className="text-ink-500">{d.phase}</Td>
                      <Td className="text-right num">{won(d.amount)}</Td>
                      <Td className="text-right text-ink-600 num">
                        {d.monthly ? won(d.monthly) : "-"}
                      </Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          <Bar value={d.probability} color="#234084" className="w-[60px]" />
                          <span className="text-[11.5px] text-ink-500 num">{d.probability}%</span>
                        </div>
                      </Td>
                      <Td className="text-ink-600">{d.owner}</Td>
                      <Td className="text-ink-500 num">{d.startedAt}</Td>
                      <Td className="text-ink-500 num">{d.closeAt}</Td>
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

        <div className="col-span-12 xl:col-span-4">
          <Card className="mb-3">
            <CardHeader title="단계별 과제 분포" desc="사업화 단계 기준" />
            <div className="p-3.5">
              <StageBarChart
                data={COMMERCIALIZATION_FUNNEL.map((f) => ({ name: f.phase, value: f.count }))}
                color="#234084"
                height={210}
              />
            </div>
          </Card>

          <Card>
            <CardHeader title="계약 상태 요약" desc="상태별 금액" />
            <ul className="p-3.5">
              {["계약 완료", "계약 협의", "PoC 진행", "제안"].map((s) => {
                const list = DEALS.filter((d) => d.status === s);
                const amt = list.reduce((a, d) => a + d.amount, 0);
                return (
                  <li key={s} className="border-b border-ink-100 py-2.5 last:border-b-0">
                    <div className="flex items-center justify-between">
                      <StatusBadge status={s} />
                      <span className="text-[12.5px] font-medium text-ink-800 num">{won(amt)}</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Bar
                        value={pct(amt, DEALS.reduce((a, d) => a + d.amount, 0))}
                        color="#234084"
                      />
                      <span className="w-14 shrink-0 text-right text-[11px] text-ink-400 num">
                        {list.length}건
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>

      <p className="mt-4 text-center text-[11px] text-ink-300">
        고객사 계약 {num(DEALS.length)}건 (데모 데이터)
      </p>
    </div>
  );
}

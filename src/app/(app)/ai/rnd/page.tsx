"use client";

import { PlanVsActualChart } from "@/components/charts";
import { PageHeader } from "@/components/page-kit";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Bar } from "@/components/ui/progress";
import { Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import { DATA_ASSETS, RND_TASKS } from "@/lib/data";
import { num, pct, won, wonShort } from "@/lib/utils";

export default function RndPage() {
  const budget = RND_TASKS.reduce((s, r) => s + r.budget, 0);
  const spent = RND_TASKS.reduce((s, r) => s + r.spent, 0);
  const gov = RND_TASKS.filter((r) => r.agency !== "자체 과제");
  const ip = DATA_ASSETS.filter((d) => d.type === "지식재산권");

  return (
    <div className="animate-fade-in">
      <PageHeader
        company="corp"
        title="R&D 관리"
        desc="정부 과제와 자체 연구 과제의 진행률과 예산 집행을 관리합니다."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          { l: "진행 과제", v: `${RND_TASKS.length}개`, s: `정부 과제 ${gov.length}건` },
          { l: "총 연구비", v: won(budget), s: "과제 합계" },
          { l: "집행액", v: won(spent), s: `집행률 ${pct(spent, budget)}%` },
          {
            l: "평균 진행률",
            v: `${Math.round(RND_TASKS.reduce((s, r) => s + r.progress, 0) / RND_TASKS.length)}%`,
            s: "과제 평균",
          },
          { l: "지식재산권", v: `${ip.length}건`, s: "특허 출원 진행" },
        ].map((k) => (
          <Card key={k.l}>
            <div className="p-4">
              <p className="text-[16px] text-ink-500">{k.l}</p>
              <p className="mt-1.5 text-[24px] font-semibold text-ink-900 num">{k.v}</p>
              <p className="mt-1 text-[15px] text-ink-400 num">{k.s}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-3">
        <CardHeader title="R&D 과제 목록" desc={`${RND_TASKS.length}개 과제`} />
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>과제명</Th>
                <Th>분야</Th>
                <Th>책임자</Th>
                <Th>수행 기관</Th>
                <Th className="w-[150px]">진행률</Th>
                <Th className="text-right">연구비</Th>
                <Th className="text-right">집행액</Th>
                <Th>기간</Th>
                <Th>주요 성과</Th>
                <Th>상태</Th>
              </tr>
            </thead>
            <tbody>
              {RND_TASKS.map((r) => (
                <Tr key={r.id}>
                  <Td className="max-w-[280px] truncate font-medium text-ink-800">{r.title}</Td>
                  <Td>
                    <Badge className="border-corp-200 bg-corp-50 text-corp-700">{r.category}</Badge>
                  </Td>
                  <Td className="text-ink-600">{r.owner}</Td>
                  <Td className="text-ink-600">{r.agency}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Bar value={r.progress} color="#5e79bd" className="w-[80px]" />
                      <span className="text-[15.5px] text-ink-500 num">{r.progress}%</span>
                    </div>
                  </Td>
                  <Td className="text-right num">{won(r.budget)}</Td>
                  <Td className="text-right text-ink-600 num">{won(r.spent)}</Td>
                  <Td className="text-ink-500 num">
                    {r.startedAt} ~ {r.dueAt}
                  </Td>
                  <Td className="text-ink-600">{r.output}</Td>
                  <Td>
                    <StatusBadge status={r.status} />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      </Card>

      <div className="mt-3 grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-7">
          <Card className="h-full">
            <CardHeader title="과제별 연구비 계획 대비 집행" desc="단위 원" />
            <div className="p-3.5">
              <PlanVsActualChart
                data={RND_TASKS.map((r) => ({
                  name: r.id.replace("RND-", "과제 "),
                  planned: r.budget,
                  executed: r.spent,
                }))}
                color="#234084"
                height={250}
              />
            </div>
          </Card>
        </div>
        <div className="col-span-12 xl:col-span-5">
          <Card className="h-full">
            <CardHeader title="지식재산권 · 연구 성과" desc="특허 출원 및 산출물" />
            <ul>
              {ip.map((d) => (
                <li key={d.id} className="border-b border-ink-100 px-4 py-3 last:border-b-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[17px] font-medium text-ink-800">{d.name}</span>
                    <StatusBadge status={d.status} />
                  </div>
                  <p className="mt-1 text-[15.5px] text-ink-500 num">{d.scale}</p>
                  <p className="mt-0.5 text-[15px] text-ink-400">
                    담당 {d.owner} · 갱신 <span className="num">{d.updatedAt}</span>
                  </p>
                </li>
              ))}
              {RND_TASKS.slice(0, 3).map((r) => (
                <li key={r.id} className="border-b border-ink-100 px-4 py-3 last:border-b-0">
                  <p className="text-[17px] text-ink-800">{r.output}</p>
                  <p className="mt-0.5 text-[15px] text-ink-400">
                    {r.title} · {wonShort(r.budget)}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <p className="mt-4 text-center text-[15px] text-ink-300">
        R&D 과제 {num(RND_TASKS.length)}건 (데모 데이터)
      </p>
    </div>
  );
}

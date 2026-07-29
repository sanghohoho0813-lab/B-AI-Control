"use client";

import { StageBarChart } from "@/components/charts";
import { PageHeader } from "@/components/page-kit";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Bar } from "@/components/ui/progress";
import { Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import { AI_PROJECTS, MEMBERS, SUMMARY } from "@/lib/data";
import { num, pct, won } from "@/lib/utils";

export default function PeoplePage() {
  const monthlyCost = MEMBERS.reduce((s, m) => s + m.monthlyCost, 0);
  const avgAllocation = MEMBERS.reduce((s, m) => s + m.allocation, 0) / MEMBERS.length;

  const byProject = AI_PROJECTS.map((p) => ({
    name: p.name.length > 10 ? `${p.name.slice(0, 9)}…` : p.name,
    value: p.headcount,
  }));

  const levels = Array.from(new Set(MEMBERS.map((m) => m.level)));

  return (
    <div className="animate-fade-in">
      <PageHeader
        company="corp"
        title="인력 관리"
        desc="개발 인력 배치와 프로젝트 투입률, 인건비를 관리합니다."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          { l: "전체 인원", v: `${SUMMARY.corp.headcount}명`, s: `핵심 인력 ${MEMBERS.length}명` },
          { l: "월 인건비", v: won(monthlyCost), s: "핵심 인력 기준" },
          { l: "평균 투입률", v: `${avgAllocation.toFixed(0)}%`, s: "프로젝트 배정" },
          {
            l: "프로젝트당 평균 인력",
            v: `${(AI_PROJECTS.reduce((s, p) => s + p.headcount, 0) / AI_PROJECTS.length).toFixed(1)}명`,
            s: "중복 배정 포함",
          },
          { l: "직무 구분", v: `${levels.length}단계`, s: levels.join(" · ") },
        ].map((k) => (
          <Card key={k.l}>
            <div className="p-4">
              <p className="text-[16px] text-ink-500">{k.l}</p>
              <p className="mt-1.5 text-[24px] font-semibold text-ink-900 num">{k.v}</p>
              <p className="mt-1 truncate text-[15px] text-ink-400">{k.s}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-8">
          <Card>
            <CardHeader title="인력 명단" desc={`핵심 인력 ${MEMBERS.length}명`} />
            <TableWrap>
              <Table>
                <thead>
                  <tr>
                    <Th>이름</Th>
                    <Th>직무</Th>
                    <Th>등급</Th>
                    <Th>투입 프로젝트</Th>
                    <Th className="w-[140px]">투입률</Th>
                    <Th className="text-right">월 인건비</Th>
                    <Th>입사</Th>
                    <Th>보유 역량</Th>
                  </tr>
                </thead>
                <tbody>
                  {MEMBERS.map((m) => (
                    <Tr key={m.id}>
                      <Td>
                        <span className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-corp-50 text-[14.5px] font-semibold text-corp-700">
                            {m.name.slice(0, 1)}
                          </span>
                          <span className="font-medium text-ink-800">{m.name}</span>
                        </span>
                      </Td>
                      <Td className="text-ink-600">{m.role}</Td>
                      <Td>
                        <Badge className="border-corp-200 bg-corp-50 text-corp-700">{m.level}</Badge>
                      </Td>
                      <Td className="max-w-[260px] truncate text-ink-600">
                        {m.projects.join(" · ")}
                      </Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          <Bar value={m.allocation} color="#5e79bd" className="w-[70px]" />
                          <span className="text-[15.5px] text-ink-500 num">{m.allocation}%</span>
                        </div>
                      </Td>
                      <Td className="text-right num">{won(m.monthlyCost)}</Td>
                      <Td className="text-ink-500 num">{m.joinedAt}</Td>
                      <Td className="text-ink-500">{m.skills.join(", ")}</Td>
                    </Tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-ivory-100/70">
                    <Td colSpan={5} className="font-medium text-ink-700">
                      월 인건비 합계
                    </Td>
                    <Td className="text-right font-semibold num">{won(monthlyCost)}</Td>
                    <Td colSpan={2} />
                  </tr>
                </tfoot>
              </Table>
            </TableWrap>
          </Card>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <Card className="mb-3">
            <CardHeader title="프로젝트별 투입 인력" desc="배정 인원 기준" />
            <div className="p-3.5">
              <StageBarChart data={byProject} color="#234084" height={240} />
            </div>
          </Card>

          <Card>
            <CardHeader title="등급별 구성" desc="핵심 인력" />
            <ul className="p-3.5">
              {levels.map((l) => {
                const cnt = MEMBERS.filter((m) => m.level === l).length;
                return (
                  <li key={l} className="border-b border-ink-100 py-2.5 last:border-b-0">
                    <div className="flex items-center justify-between text-[17px]">
                      <span className="text-ink-600">{l}</span>
                      <span className="font-medium text-ink-800 num">{cnt}명</span>
                    </div>
                    <Bar
                      value={pct(cnt, MEMBERS.length)}
                      className="mt-1.5"
                      color="#5e79bd"
                    />
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>

      <p className="mt-4 text-center text-[15px] text-ink-300">
        핵심 인력 {num(MEMBERS.length)}명 · 전체 {SUMMARY.corp.headcount}명 (데모 데이터)
      </p>
    </div>
  );
}

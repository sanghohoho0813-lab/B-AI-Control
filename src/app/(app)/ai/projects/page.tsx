"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { ProjectDetailModal } from "@/components/modals";
import { PageHeader, StageFlow } from "@/components/page-kit";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Bar } from "@/components/ui/progress";
import { Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import { AI_PROJECTS, COMMERCIALIZATION_FUNNEL, PROJECT_PHASES } from "@/lib/data";
import { cn, num, pct, won, wonShort } from "@/lib/utils";
import type { ProjectPhase } from "@/lib/types";

export default function ProjectsPage() {
  const [phase, setPhase] = React.useState<ProjectPhase | "전체">("전체");
  const items = AI_PROJECTS.filter((p) => phase === "전체" || p.phase === phase);

  const budget = AI_PROJECTS.reduce((s, p) => s + p.budget, 0);
  const spent = AI_PROJECTS.reduce((s, p) => s + p.spent, 0);
  const headcount = AI_PROJECTS.reduce((s, p) => s + p.headcount, 0);
  const expected = AI_PROJECTS.reduce((s, p) => s + p.expectedRevenue, 0);
  const counts = Object.fromEntries(COMMERCIALIZATION_FUNNEL.map((f) => [f.phase, f.count]));

  return (
    <div className="animate-fade-in">
      <PageHeader
        company="corp"
        title="프로젝트 관리"
        desc="개발 진행률과 예산 집행, 사업화 단계를 함께 관리합니다."
        actions={
          <Button variant="corp">
            <Plus className="h-3.5 w-3.5" />
            프로젝트 등록
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          { l: "진행 프로젝트", v: `${AI_PROJECTS.length}개`, s: "전체 관리 대상" },
          { l: "투입 인력", v: `${headcount}명`, s: "중복 배정 포함" },
          { l: "배정 예산", v: won(budget), s: "프로젝트 합계" },
          { l: "집행 금액", v: won(spent), s: `집행률 ${pct(spent, budget)}%` },
          { l: "예상 매출", v: won(expected), s: "계약 · 파이프라인" },
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
        <CardHeader title="사업화 단계" desc="단계를 클릭하면 해당 단계 프로젝트만 표시됩니다" />
        <div className="p-4">
          <StageFlow stages={PROJECT_PHASES} tone="corp" counts={counts} current="유료화" />
          <div className="mt-3 flex flex-wrap gap-1.5">
            <button
              onClick={() => setPhase("전체")}
              className={cn(
                "rounded border px-2.5 py-1 text-[12px] transition-colors",
                phase === "전체"
                  ? "border-ink-800 bg-ink-800 text-white"
                  : "border-ink-200 bg-white text-ink-500 hover:bg-ink-50",
              )}
            >
              전체
            </button>
            {PROJECT_PHASES.map((p) => (
              <button
                key={p}
                onClick={() => setPhase(p)}
                className={cn(
                  "rounded border px-2.5 py-1 text-[12px] transition-colors",
                  phase === p
                    ? "border-corp-700 bg-corp-700 text-white"
                    : "border-ink-200 bg-white text-ink-500 hover:bg-ink-50",
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="mt-3">
        <CardHeader
          title="프로젝트 테이블"
          desc={`${items.length}건 · 프로젝트명을 클릭하면 상세가 열립니다`}
        />
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>프로젝트명</Th>
                <Th>제품 구분</Th>
                <Th>담당자</Th>
                <Th>현재 단계</Th>
                <Th className="w-[150px]">진행률</Th>
                <Th>다음 마일스톤</Th>
                <Th>예상 완료일</Th>
                <Th>고객사</Th>
                <Th className="text-right">예산 / 집행</Th>
                <Th>상태</Th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <Tr key={p.id}>
                  <Td>
                    <ProjectDetailModal project={p}>
                      <button className="font-medium text-ink-800 hover:text-corp-700 hover:underline">
                        {p.name}
                      </button>
                    </ProjectDetailModal>
                  </Td>
                  <Td>
                    <Badge className="border-corp-200 bg-corp-50 text-corp-700">{p.product}</Badge>
                  </Td>
                  <Td className="text-ink-600">{p.owner}</Td>
                  <Td className="text-ink-600">{p.phase}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Bar value={p.progress} color="#234084" className="w-[80px]" />
                      <span className="text-[11.5px] text-ink-500 num">{p.progress}%</span>
                    </div>
                  </Td>
                  <Td className="max-w-[210px] truncate text-ink-600">{p.nextMilestone}</Td>
                  <Td className="num">{p.dueAt}</Td>
                  <Td className="text-ink-500">{p.client}</Td>
                  <Td className="text-right num">
                    {wonShort(p.budget)} / {wonShort(p.spent)}
                  </Td>
                  <Td>
                    <StatusBadge status={p.status} />
                  </Td>
                </Tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <Td colSpan={10} className="py-12 text-center text-ink-400">
                    해당 단계의 프로젝트가 없습니다.
                  </Td>
                </tr>
              ) : null}
            </tbody>
          </Table>
        </TableWrap>
      </Card>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {items.map((p) => (
          <Card key={p.id} className="overflow-hidden">
            <span className="block h-[3px] bg-corp-700" />
            <div className="p-3.5">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[13px] font-semibold text-ink-800">{p.name}</span>
                <StatusBadge status={p.status} />
              </div>
              <p className="mt-1 text-[11px] text-ink-400">
                {p.phase} · {p.owner} · {p.headcount}명
              </p>
              <div className="mt-2.5">
                <div className="flex items-center justify-between text-[11px] text-ink-400">
                  <span>개발 진행</span>
                  <span className="num">{p.progress}%</span>
                </div>
                <Bar value={p.progress} className="mt-1" color="#234084" />
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-[11px] text-ink-400">
                  <span>예산 집행</span>
                  <span className="num">{pct(p.spent, p.budget)}%</span>
                </div>
                <Bar value={pct(p.spent, p.budget)} className="mt-1" color="#94a9d8" />
              </div>
              <p className="mt-2.5 border-t border-ink-100 pt-2 text-[11px] text-ink-500">
                {p.nextMilestone}
              </p>
              <ProjectDetailModal project={p}>
                <Button variant="outline" size="sm" className="mt-2.5 w-full">
                  상세 보기
                </Button>
              </ProjectDetailModal>
            </div>
          </Card>
        ))}
      </div>

      <p className="mt-4 text-center text-[11px] text-ink-300">
        표시 프로젝트 {num(items.length)}건 (데모 데이터)
      </p>
    </div>
  );
}

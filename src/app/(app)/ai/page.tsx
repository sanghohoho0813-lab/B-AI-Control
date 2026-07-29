"use client";

import Link from "next/link";
import { AlertTriangle, Plus } from "lucide-react";
import { CategoryDonut, RevenueTrendChart, StageBarChart } from "@/components/charts";
import { ExpenseModal, ProjectDetailModal } from "@/components/modals";
import { KpiCard, MoreLink, PageHeader, StageFlow } from "@/components/page-kit";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Bar } from "@/components/ui/progress";
import { Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import {
  AI_PROJECTS,
  BUDGET_LINES,
  COMMERCIALIZATION_FUNNEL,
  CORP_REVENUE_MIX,
  DEALS,
  MEMBERS,
  PROJECT_PHASES,
  REVENUE_TREND,
  RND_TASKS,
  SUMMARY,
} from "@/lib/data";
import { cn, num, pct, won, wonShort } from "@/lib/utils";

const S = SUMMARY.corp;
const CORP_COLORS = ["#234084", "#33529f", "#5e79bd", "#94a9d8", "#c6d2ec"];

export default function AiDashboardPage() {
  const funnelCounts = Object.fromEntries(COMMERCIALIZATION_FUNNEL.map((f) => [f.phase, f.count]));
  const issues = AI_PROJECTS.filter((p) => p.issue);
  const corpBudget = BUDGET_LINES.filter((b) => b.company === "corp");
  const planned = corpBudget.reduce((s, b) => s + b.planned, 0);
  const executed = corpBudget.reduce((s, b) => s + b.executed, 0);
  const pipeline = DEALS.filter((d) => d.status !== "계약 완료").reduce((s, d) => s + d.amount, 0);

  return (
    <div className="animate-fade-in">
      <PageHeader
        company="corp"
        title="사업화 대시보드"
        desc="개발 진행, 자금 투입, 사업화 성과를 함께 확인합니다."
        actions={
          <>
            <ExpenseModal defaultCompany="corp">
              <Button variant="outline">
                <Plus className="h-3.5 w-3.5" />
                집행 등록
              </Button>
            </ExpenseModal>
            <Button variant="corp" asChild>
              <Link href="/ai/projects">프로젝트 관리</Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <KpiCard
          company="corp"
          label="이번 달 매출"
          value={won(S.revenue)}
          delta={S.revenueDelta}
          href="/ai/sales"
          sub="(전월 대비)"
          className="col-span-2 lg:col-span-1"
        />
        <KpiCard label="진행 프로젝트" value={`${S.projects}개`} sub="개발 · PoC 포함" href="/ai/projects" />
        <KpiCard label="개발 중 기능" value={`${S.features}개`} sub="이번 스프린트" href="/ai/projects" />
        <KpiCard label="R&D 과제" value={`${S.rnd}개`} sub="정부 · 자체 과제" href="/ai/rnd" />
        <KpiCard label="투입 인력" value={`${S.headcount}명`} sub="개발 · 리서치" href="/ai/people" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <KpiCard label="이번 달 개발비" value={won(S.devCost)} sub={`집행률 ${pct(executed, planned)}%`} href="/finance" />
        <KpiCard label="PoC 고객" value={`${S.poc}개사`} sub="검증 진행 중" href="/ai/biz" />
        <KpiCard label="유료 계약" value={`${S.paid}건`} sub={`신규 ${S.newContract}건`} href="/ai/biz" />
        <KpiCard label="예상 매출" value={won(pipeline)} sub="파이프라인 합계" href="/ai/biz" />
        <KpiCard label="지연 이슈" value={`${S.delayIssue}건`} sub="일정 재조정 필요" href="/ai/projects" />
      </div>

      {/* 사업화 단계 */}
      <Card className="mt-3">
        <CardHeader
          title="사업화 단계"
          desc="아이디어에서 반복 판매까지 단계별 과제 수"
          action={<MoreLink href="/ai/biz" />}
        />
        <div className="p-4">
          <StageFlow stages={PROJECT_PHASES} tone="corp" counts={funnelCounts} current="유료화" />
          <div className="mt-4 grid grid-cols-3 gap-2 md:grid-cols-6">
            {COMMERCIALIZATION_FUNNEL.map((f) => (
              <div key={f.phase} className="rounded-md border border-ink-200/70 bg-ivory-100/50 p-2.5">
                <p className="text-[15px] text-ink-400">{f.phase}</p>
                <p className="mt-1 text-[23px] font-semibold text-ink-800 num">
                  {f.count}
                  <span className="ml-0.5 text-[14.5px] font-normal text-ink-400">건</span>
                </p>
                <p className="mt-0.5 text-[14.5px] text-ink-400 num">
                  {f.amount ? wonShort(f.amount) : "매출 미발생"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 프로젝트 테이블 */}
      <Card className="mt-3">
        <CardHeader
          title="프로젝트 현황"
          desc="행을 클릭하면 상세 정보를 확인할 수 있습니다"
          action={<MoreLink href="/ai/projects" />}
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
                <Th>상태</Th>
              </tr>
            </thead>
            <tbody>
              {AI_PROJECTS.map((p) => (
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
                      <span className="text-[15.5px] text-ink-500 num">{p.progress}%</span>
                    </div>
                  </Td>
                  <Td className="max-w-[220px] truncate text-ink-600">{p.nextMilestone}</Td>
                  <Td className="num">{p.dueAt}</Td>
                  <Td>
                    <StatusBadge status={p.status} />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      </Card>

      <div className="mt-3 grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-5">
          <Card className="h-full">
            <CardHeader title="개발 진행과 자금 투입" desc="프로젝트별 예산 집행률" action={<MoreLink href="/finance" />} />
            <ul className="p-3.5">
              {AI_PROJECTS.slice(0, 6).map((p) => (
                <li key={p.id} className="border-b border-ink-100 py-2.5 last:border-b-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[17px] text-ink-800">{p.name}</span>
                    <span className="shrink-0 text-[15.5px] text-ink-500 num">
                      {wonShort(p.spent)} / {wonShort(p.budget)}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Bar value={p.progress} color="#234084" />
                    <span className="w-16 shrink-0 text-right text-[14.5px] text-ink-400">
                      개발 {p.progress}%
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Bar value={pct(p.spent, p.budget)} color="#94a9d8" />
                    <span className="w-16 shrink-0 text-right text-[14.5px] text-ink-400">
                      집행 {pct(p.spent, p.budget)}%
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="col-span-12 md:col-span-6 xl:col-span-4">
          <Card className="h-full">
            <CardHeader title="R&D 과제 진행" desc={`총 ${RND_TASKS.length}개 과제`} action={<MoreLink href="/ai/rnd" />} />
            <ul>
              {RND_TASKS.slice(0, 5).map((r) => (
                <li key={r.id} className="border-b border-ink-100 px-4 py-2.5 last:border-b-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[17px] text-ink-800">{r.title}</span>
                      <span className="block truncate text-[15px] text-ink-400">
                        {r.agency} · {r.owner}
                      </span>
                    </span>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Bar value={r.progress} color="#5e79bd" />
                    <span className="w-9 shrink-0 text-right text-[15px] text-ink-500 num">
                      {r.progress}%
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <Card className="h-full">
            <CardHeader title="지연 이슈" desc="확인이 필요한 프로젝트" />
            <ul>
              {issues.map((p) => (
                <li key={p.id} className="border-b border-ink-100 px-4 py-3 last:border-b-0">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle
                      className={cn(
                        "h-3.5 w-3.5",
                        p.status === "지연" ? "text-rose-500" : "text-amber-500",
                      )}
                    />
                    <span className="truncate text-[17px] font-medium text-ink-800">{p.name}</span>
                  </div>
                  <p className="mt-1 text-[15.5px] leading-relaxed text-ink-500">{p.issue}</p>
                  <p className="mt-1 text-[15px] text-ink-400">
                    담당 {p.owner} · 완료 예정 <span className="num">{p.dueAt}</span>
                  </p>
                </li>
              ))}
            </ul>
            <div className="p-3">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/ai/projects">프로젝트 전체 보기</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-5">
          <Card>
            <CardHeader title="매출 추이" desc="최근 6개월 · AI 소프트웨어 법인" />
            <div className="p-3.5">
              <RevenueTrendChart data={REVENUE_TREND} height={230} series="corp" showLegend={false} />
            </div>
          </Card>
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-4">
          <Card className="h-full">
            <CardHeader title="매출 유형 구성" desc="이번 달" action={<MoreLink href="/ai/sales" />} />
            <div className="grid grid-cols-2 items-center gap-2 p-3.5">
              <CategoryDonut
                data={CORP_REVENUE_MIX}
                colors={CORP_COLORS}
                height={170}
                centerTop={wonShort(S.revenue)}
                centerBottom="이번 달"
              />
              <ul className="space-y-1.5">
                {CORP_REVENUE_MIX.map((r, i) => (
                  <li key={r.name} className="flex items-center gap-2 text-[15.5px]">
                    <span
                      className="h-2 w-2 rounded-sm"
                      style={{ background: CORP_COLORS[i % CORP_COLORS.length] }}
                    />
                    <span className="flex-1 truncate text-ink-500">{r.name}</span>
                    <span className="text-ink-700 num">{wonShort(r.value)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <Card className="h-full">
            <CardHeader title="단계별 과제 분포" desc="사업화 단계" />
            <div className="p-3.5">
              <StageBarChart
                data={COMMERCIALIZATION_FUNNEL.map((f) => ({ name: f.phase, value: f.count }))}
                color="#234084"
                height={210}
              />
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-3">
        <CardHeader title="핵심 인력 배치" desc="프로젝트 투입 현황" action={<MoreLink href="/ai/people" />} />
        <div className="grid grid-cols-2 divide-x divide-y divide-ink-100 md:grid-cols-4">
          {MEMBERS.slice(0, 8).map((m) => (
            <div key={m.id} className="p-3.5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-corp-50 text-[15px] font-semibold text-corp-700">
                  {m.name.slice(0, 1)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[17px] font-medium text-ink-800">
                    {m.name}
                  </span>
                  <span className="block truncate text-[14.5px] text-ink-400">{m.role}</span>
                </span>
              </div>
              <p className="mt-2 truncate text-[15px] text-ink-500">{m.projects.join(" · ")}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <Bar value={m.allocation} color="#5e79bd" />
                <span className="shrink-0 text-[14.5px] text-ink-400 num">{m.allocation}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <p className="mt-4 text-center text-[15px] text-ink-300">
        AI 소프트웨어 법인 · 성수 오피스 · 누적 계약 {num(DEALS.length)}건 (데모 데이터)
      </p>
    </div>
  );
}

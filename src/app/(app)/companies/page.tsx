"use client";

import Link from "next/link";
import { ArrowRight, Building2, Check } from "lucide-react";
import { useApp } from "@/components/app-store";
import { RevenueTrendChart } from "@/components/charts";
import { PageHeader } from "@/components/page-kit";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { COMPANIES, REVENUE_TREND, SUMMARY } from "@/lib/data";
import { cn, num, won, wonShort } from "@/lib/utils";
import type { CompanyId } from "@/lib/types";

const DETAIL: Record<CompanyId, { menus: { label: string; href: string }[]; metrics: { label: string; value: string }[] }> = {
  tailor: {
    menus: [
      { label: "운영 대시보드", href: "/tailor" },
      { label: "고객 관리", href: "/tailor/customers" },
      { label: "주문 관리", href: "/tailor/orders" },
      { label: "원단·재고", href: "/tailor/fabrics" },
      { label: "제작·납기", href: "/tailor/production" },
      { label: "매출 관리", href: "/tailor/sales" },
      { label: "고객 분석", href: "/tailor/analytics" },
    ],
    metrics: [
      { label: "이번 달 매출", value: won(SUMMARY.tailor.revenue) },
      { label: "주문 접수", value: `${SUMMARY.tailor.orderCount}건` },
      { label: "제작 진행", value: `${SUMMARY.tailor.inProduction}건` },
      { label: "미수금", value: won(SUMMARY.tailor.receivable) },
      { label: "가용자금", value: won(SUMMARY.cash.tailorAvailable) },
    ],
  },
  corp: {
    menus: [
      { label: "사업화 대시보드", href: "/ai" },
      { label: "프로젝트 관리", href: "/ai/projects" },
      { label: "R&D 관리", href: "/ai/rnd" },
      { label: "인력 관리", href: "/ai/people" },
      { label: "기술·데이터", href: "/ai/tech" },
      { label: "사업화 관리", href: "/ai/biz" },
      { label: "매출 관리", href: "/ai/sales" },
    ],
    metrics: [
      { label: "이번 달 매출", value: won(SUMMARY.corp.revenue) },
      { label: "진행 프로젝트", value: `${SUMMARY.corp.projects}개` },
      { label: "R&D 과제", value: `${SUMMARY.corp.rnd}개` },
      { label: "유료 계약", value: `${SUMMARY.corp.paid}건` },
      { label: "가용자금", value: won(SUMMARY.cash.corpAvailable) },
    ],
  },
};

export default function CompaniesPage() {
  const { scope, setScope } = useApp();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="회사 전환"
        desc="관리할 회사를 선택하면 모든 화면의 데이터가 함께 전환됩니다."
        actions={
          <Button
            variant={scope === "all" ? "default" : "outline"}
            onClick={() => setScope("all")}
          >
            <Building2 className="h-3.5 w-3.5" />
            통합 보기
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        {(["tailor", "corp"] as CompanyId[]).map((id) => {
          const c = COMPANIES[id];
          const d = DETAIL[id];
          const active = scope === id;
          return (
            <Card
              key={id}
              className={cn(
                "overflow-hidden transition-shadow",
                active && "shadow-raise",
                id === "tailor" ? "stripe-tailor" : "stripe-corp",
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-3 px-5 py-4",
                  id === "tailor" ? "bg-tailor-700" : "bg-corp-800",
                )}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white/15 text-[13px] font-bold text-white">
                  {c.mark}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-white">{c.name}</p>
                  <p className="text-[11.5px] text-white/60">{c.business}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className={cn(
                    "border-white/25 bg-white/10 text-white hover:bg-white/20",
                    active && "border-white bg-white text-ink-800 hover:bg-white",
                  )}
                  onClick={() => setScope(active ? "all" : id)}
                >
                  {active ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      선택됨
                    </>
                  ) : (
                    "이 회사로 전환"
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-2 divide-x divide-y divide-ink-100 sm:grid-cols-3">
                {[
                  { l: "대표자", v: c.ceo },
                  { l: "설립", v: c.founded },
                  { l: "인원", v: `${c.employees}명` },
                  { l: "소재지", v: c.location },
                  { l: "이번 달 매출", v: wonShort(id === "tailor" ? SUMMARY.tailor.revenue : SUMMARY.corp.revenue) },
                  {
                    l: "가용자금",
                    v: wonShort(id === "tailor" ? SUMMARY.cash.tailorAvailable : SUMMARY.cash.corpAvailable),
                  },
                ].map((r) => (
                  <div key={r.l} className="px-4 py-3">
                    <p className="text-[11px] text-ink-400">{r.l}</p>
                    <p className="mt-1 text-[12.5px] font-medium text-ink-800 num">{r.v}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-ink-100 p-4">
                <p className="mb-2 text-[12px] font-medium text-ink-700">주요 지표</p>
                <ul className="space-y-1.5">
                  {d.metrics.map((m) => (
                    <li key={m.label} className="flex items-center justify-between text-[12px]">
                      <span className="text-ink-500">{m.label}</span>
                      <span className="font-medium text-ink-800 num">{m.value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-ink-100 p-4">
                <p className="mb-2 text-[12px] font-medium text-ink-700">전용 메뉴</p>
                <div className="flex flex-wrap gap-1.5">
                  {d.menus.map((m) => (
                    <Link
                      key={m.href}
                      href={m.href}
                      className={cn(
                        "rounded border px-2 py-1 text-[11.5px] transition-colors",
                        id === "tailor"
                          ? "border-tailor-200 bg-tailor-50 text-tailor-700 hover:bg-tailor-100"
                          : "border-corp-200 bg-corp-50 text-corp-700 hover:bg-corp-100",
                      )}
                    >
                      {m.label}
                    </Link>
                  ))}
                </div>
                <Button
                  variant={id === "tailor" ? "tailor" : "corp"}
                  size="sm"
                  className="mt-3 w-full"
                  asChild
                >
                  <Link href={id === "tailor" ? "/tailor" : "/ai"}>
                    {c.name} 대시보드 열기 <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-3">
        <CardHeader title="두 회사 매출 비교" desc="최근 6개월 · 회사별 구분" />
        <div className="p-4">
          <RevenueTrendChart data={REVENUE_TREND} height={260} />
        </div>
      </Card>

      <p className="mt-4 text-center text-[11px] text-ink-300">
        통합 인원 {num(COMPANIES.tailor.employees + COMPANIES.corp.employees)}명 · 통합 가용자금{" "}
        {won(SUMMARY.cash.available)} (데모 데이터)
      </p>
    </div>
  );
}

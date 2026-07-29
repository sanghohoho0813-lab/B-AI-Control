"use client";

import { Smartphone } from "lucide-react";
import { MobileBriefing } from "@/components/mobile/briefing";
import { PageHeader } from "@/components/page-kit";
import { Card, CardHeader } from "@/components/ui/card";
import { SCHEDULES, SUMMARY, URGENT_TASKS } from "@/lib/data";
import { won, wonShort } from "@/lib/utils";

export default function MobilePage() {
  return (
    <>
      {/* 모바일 : 실제 브리핑 화면 */}
      <div className="-mx-4 -mt-5 lg:hidden">
        <MobileBriefing />
      </div>

      {/* 데스크톱 : 브리핑 미리보기 */}
      <div className="hidden lg:block">
        <div className="animate-fade-in">
          <PageHeader
            title="대표자 모바일 브리핑"
            desc="대표자가 아침에 30초 안에 확인하는 브리핑 화면입니다. 하단 탭을 눌러 화면을 전환해 보세요."
          />
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 flex justify-center xl:col-span-5">
              <div className="relative">
                <div
                  className="overflow-hidden rounded-[42px] border-[10px] border-ink-900 bg-white shadow-panel"
                  style={{ width: 390, height: 844 }}
                >
                  <div className="relative h-full">
                    <div className="absolute left-1/2 top-2 z-10 h-6 w-28 -translate-x-1/2 rounded-full bg-ink-900" />
                    <div className="flex h-full flex-col pt-8">
                      <MobileBriefing embedded />
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-center text-[11.5px] text-ink-400 num">390 × 844</p>
              </div>
            </div>

            <div className="col-span-12 space-y-3 xl:col-span-7">
              <Card>
                <CardHeader
                  title="브리핑 구성"
                  desc="데스크톱 화면을 축소하지 않고 대표자 확인 순서에 맞춰 재구성했습니다"
                />
                <div className="divide-y divide-ink-100">
                  {[
                    {
                      t: "1. 회사 전환 탭",
                      d: "통합 · 비앤테일러샵 · AI 법인을 한 번에 전환합니다. 선택한 회사에 따라 아래 모든 카드가 함께 바뀝니다.",
                    },
                    {
                      t: "2. 오늘의 핵심 요약",
                      d: `회사별 오늘 매출, 납품 예정, 진행 프로젝트, 신규 계약, 가용자금 ${won(SUMMARY.cash.available)}을 상단에 배치했습니다.`,
                    },
                    {
                      t: "3. 긴급 확인 업무",
                      d: `납기 지연 · 원단 재고 부족 · AI 프로젝트 이슈 · 자금 집행 검토 등 ${URGENT_TASKS.reduce((s, t) => s + t.count, 0)}건을 건수와 함께 표시합니다.`,
                    },
                    {
                      t: "4. 오늘 일정",
                      d: "고객 미팅, 가봉 일정, 프로젝트 회의, R&D 보고를 시간 순으로 정리합니다.",
                    },
                    {
                      t: "5. 하단 탭",
                      d: "홈 · 업무 · 일정 · 자금 · 메뉴 다섯 개 탭으로 이동합니다.",
                    },
                  ].map((r) => (
                    <div key={r.t} className="px-4 py-3">
                      <p className="text-[13px] font-medium text-ink-800">{r.t}</p>
                      <p className="mt-1 text-[12px] leading-relaxed text-ink-500">{r.d}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <CardHeader title="모바일 최적화 기준" desc="데스크톱 대시보드와의 차이" />
                <div className="grid grid-cols-1 divide-y divide-ink-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                  <div className="p-4">
                    <p className="mb-2 flex items-center gap-1.5 text-[12.5px] font-medium text-ink-700">
                      <Smartphone className="h-3.5 w-3.5 text-ink-400" />
                      모바일 브리핑
                    </p>
                    <ul className="space-y-1.5 text-[11.5px] leading-relaxed text-ink-500">
                      <li>· 판단이 필요한 숫자만 카드 단위로 노출</li>
                      <li>· 표와 다중 축 그래프 제거</li>
                      <li>· 회사 구분은 색과 배지로만 표시</li>
                      <li>· 한 손 조작 기준 하단 탭 고정</li>
                    </ul>
                  </div>
                  <div className="p-4">
                    <p className="mb-2 text-[12.5px] font-medium text-ink-700">데스크톱 대시보드</p>
                    <ul className="space-y-1.5 text-[11.5px] leading-relaxed text-ink-500">
                      <li>· 회사별 KPI · 추이 · 구성 비중 동시 비교</li>
                      <li>· 원단 재고 · 프로젝트 테이블 전체 조회</li>
                      <li>· 자금 계획 대비 집행 상세 분석</li>
                      <li>· 상세 모달에서 항목 단위 확인</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader title="브리핑에 표시되는 값" desc="2026.07.29 기준 · 통합" />
                <div className="grid grid-cols-2 divide-x divide-y divide-ink-100 sm:grid-cols-4">
                  {[
                    { l: "비앤 오늘 매출", v: wonShort(SUMMARY.tailor.todayRevenue) },
                    { l: "비앤 납품 예정", v: `${SUMMARY.tailor.delivery}건` },
                    { l: "AI 진행 프로젝트", v: `${SUMMARY.corp.projects}개` },
                    { l: "AI 신규 계약", v: `${SUMMARY.corp.newContract}건` },
                    { l: "통합 가용자금", v: wonShort(SUMMARY.cash.available) },
                    { l: "예상 지출", v: wonShort(SUMMARY.cash.plannedSpend) },
                    { l: "긴급 확인 업무", v: `${URGENT_TASKS.reduce((s, t) => s + t.count, 0)}건` },
                    { l: "오늘 일정", v: `${SCHEDULES.filter((s) => s.date === "2026.07.29").length}건` },
                  ].map((r) => (
                    <div key={r.l} className="px-4 py-3">
                      <p className="text-[11px] text-ink-400">{r.l}</p>
                      <p className="mt-1 text-[14px] font-semibold text-ink-800 num">{r.v}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

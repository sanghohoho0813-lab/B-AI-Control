"use client";

import { Smartphone } from "lucide-react";
import { MobileApp } from "@/components/mobile/mobile-app";
import { PageHeader } from "@/components/page-kit";
import { Card, CardHeader } from "@/components/ui/card";
import { APPROVALS, SCHEDULES, SUMMARY, TODAY_URGENT } from "@/lib/data";
import { wonShort } from "@/lib/utils";

const STEPS = [
  {
    t: "1. 인사말",
    d: "“대표자님, 오늘 확인할 업무가 6건 있습니다.” 화면을 열자마자 오늘 처리할 양을 문장으로 알려줍니다.",
  },
  {
    t: "2. 오늘의 핵심 요약",
    d: "오늘 매출 · 가용자금 · 긴급업무 · 오늘 일정을 2열 카드 4개로만 배치했습니다. KPI는 4개를 넘지 않습니다.",
  },
  {
    t: "3. 회사별 요약",
    d: "회사당 카드 1개. 비앤테일러샵은 버건디, AI 법인은 딥 네이비 좌측 바로 구분합니다.",
  },
  {
    t: "4. 긴급 확인 업무",
    d: "최대 4건. 회사 배지 · 제목 · 상태 · 시간을 한 줄에 담고 나머지는 업무 탭으로 넘깁니다.",
  },
  { t: "5. 오늘 일정", d: "표가 아닌 타임라인으로 시간순 3~4건만 보여줍니다." },
  { t: "6. 대표자 확인 필요", d: "자금 집행 승인 · 주문 승인 · 일정 변경 · 보고서 확인을 건수만 표시합니다." },
];

export default function MobilePage() {
  const todaySchedules = SCHEDULES.filter((s) => s.date === "2026.07.29");

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="대표자 모바일 브리핑"
        desc="모바일은 데스크톱의 반응형 축소판이 아니라 별도 설계된 경영 브리핑 앱입니다. 프레임 안에서 직접 조작해 보세요."
      />

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 flex justify-center xl:col-span-5">
          <div>
            <div
              className="overflow-hidden rounded-[44px] border-[11px] border-ink-900 bg-white shadow-panel"
              style={{ width: 390, height: 844 }}
            >
              <div className="relative h-full">
                <div className="absolute left-1/2 top-2 z-20 h-6 w-28 -translate-x-1/2 rounded-full bg-ink-900" />
                <div className="h-full pt-7">
                  <MobileApp embedded />
                </div>
              </div>
            </div>
            <p className="mt-3 text-center text-[15.5px] text-ink-400 num">390 × 844</p>
          </div>
        </div>

        <div className="col-span-12 space-y-3 xl:col-span-7">
          <Card>
            <CardHeader
              title="첫 화면 구성"
              desc="열자마자 5초 안에 오늘 급한 일 · 두 회사 상태 · 승인할 일을 알 수 있도록 배치했습니다"
            />
            <div className="divide-y divide-ink-100">
              {STEPS.map((r) => (
                <div key={r.t} className="px-4 py-3">
                  <p className="text-[17.5px] font-medium text-ink-800">{r.t}</p>
                  <p className="mt-1 text-[16px] leading-relaxed text-ink-500">{r.d}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="모바일 전용 설계" desc="데스크톱과 무엇이 다른가" />
            <div className="grid grid-cols-1 divide-y divide-ink-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              <div className="p-4">
                <p className="mb-2 flex items-center gap-1.5 text-[17px] font-medium text-ink-700">
                  <Smartphone className="h-3.5 w-3.5 text-ink-400" />
                  모바일 브리핑 앱
                </p>
                <ul className="space-y-1.5 text-[15.5px] leading-relaxed text-ink-500">
                  <li>· 데스크톱 사이드바를 아예 렌더링하지 않음</li>
                  <li>· 표 대신 카드 리스트 · 타임라인 · 진행률</li>
                  <li>· 회사 전환은 헤더 아래 3분할 탭 한 곳에만</li>
                  <li>· 헤더 56px, 버튼은 알림 · 프로필 2개</li>
                  <li>· 하단 5개 탭 고정, 선택 탭만 회사 색으로 강조</li>
                  <li>· 요약 → 상세는 화면 이동, 한 화면에 몰지 않음</li>
                </ul>
              </div>
              <div className="p-4">
                <p className="mb-2 text-[17px] font-medium text-ink-700">데스크톱 대시보드</p>
                <ul className="space-y-1.5 text-[15.5px] leading-relaxed text-ink-500">
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
                {
                  l: "오늘 매출",
                  v: wonShort(SUMMARY.tailor.todayRevenue + SUMMARY.corp.todayRevenue),
                },
                { l: "가용자금", v: wonShort(SUMMARY.cash.available) },
                { l: "긴급업무", v: `${TODAY_URGENT.length}건` },
                { l: "오늘 일정", v: `${todaySchedules.length}건` },
                { l: "비앤 납품 예정", v: `${SUMMARY.tailor.delivery}건` },
                { l: "비앤 원단 부족", v: `${SUMMARY.tailor.fabricAlert}종` },
                { l: "AI 진행 프로젝트", v: `${SUMMARY.corp.projects}개` },
                { l: "승인 대기", v: `${APPROVALS.length}건` },
              ].map((r) => (
                <div key={r.l} className="px-4 py-3">
                  <p className="text-[15px] text-ink-400">{r.l}</p>
                  <p className="mt-1 text-[19px] font-semibold text-ink-800 num">{r.v}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

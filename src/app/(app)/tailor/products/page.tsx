"use client";

import * as React from "react";
import Image from "next/image";
import { FabricRoll } from "@/components/fabric-art";
import { PageHeader } from "@/components/page-kit";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Bar } from "@/components/ui/progress";
import { PRODUCTS, PRODUCT_CATEGORIES } from "@/lib/data";
import { cn, num, pct, won } from "@/lib/utils";

export default function ProductsPage() {
  const [cat, setCat] = React.useState<string>("전체");
  const items = PRODUCTS.filter((p) => cat === "전체" || p.category === cat);
  const orders = PRODUCTS.reduce((s, p) => s + p.monthlyOrders, 0);
  const blocked = PRODUCTS.filter((p) => p.status !== "제작 가능").length;

  return (
    <div className="animate-fade-in">
      <PageHeader
        company="tailor"
        title="상품 라인업"
        desc="원단과 연결된 제작 상품을 관리합니다. 원단 잔여량에 따라 제작 가능 여부가 자동으로 표시됩니다."
        actions={<Button variant="tailor">상품 등록</Button>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { l: "상품 라인업", v: `${PRODUCTS.length}종`, s: `분류 ${PRODUCT_CATEGORIES.length - 1}개` },
          { l: "이번 달 주문", v: `${orders}건`, s: "상품 기준 합계" },
          { l: "제작 제한", v: `${blocked}종`, s: "원단 부족 · 예약 마감" },
          {
            l: "평균 제작 기간",
            v: `${Math.round(PRODUCTS.reduce((s, p) => s + p.leadDays, 0) / PRODUCTS.length)}일`,
            s: "상담 ~ 납품",
          },
        ].map((k) => (
          <Card key={k.l}>
            <div className="p-4">
              <p className="text-[16px] text-ink-500">{k.l}</p>
              <p className="mt-1.5 text-[24px] font-semibold text-ink-900 num">{k.v}</p>
              <p className="mt-1 text-[15px] text-ink-400">{k.s}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {PRODUCT_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "rounded-full border px-4 py-2 text-[15px] font-medium transition-colors",
              cat === c
                ? "border-tailor-600 bg-tailor-600 text-white"
                : "border-ink-200 bg-white text-ink-500 hover:bg-ink-50",
            )}
          >
            {c}
          </button>
        ))}
        <span className="ml-auto text-[15px] text-ink-400">{items.length}종 표시</span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((p) => (
          <Card key={p.id} className="overflow-hidden">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-ivory-100">
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 340px"
                className="object-cover"
              />
              <span className="absolute left-3 top-3">
                <StatusBadge
                  status={p.status}
                  className={
                    p.status === "원단 부족"
                      ? "border-rose-200 bg-rose-50 text-rose-700"
                      : p.status === "예약 마감"
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }
                />
              </span>
            </div>
            <div className="p-4">
              <p className="text-[18px] font-semibold text-ink-800">{p.name}</p>
              <p className="mt-1 truncate text-[14px] text-ink-400">{p.fabricLabel}</p>
              <p className="mt-2.5 text-[22px] font-bold text-tailor-700 num">
                {won(p.priceFrom)}
                <span className="ml-1 text-[14px] font-normal text-ink-400">부터</span>
              </p>
              <div className="mt-3 space-y-1.5 border-t border-ink-100 pt-3">
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-ink-400">원단 잔여</span>
                  <span
                    className={cn(
                      "font-medium num",
                      p.stockM < 1.5 ? "text-rose-600" : "text-ink-700",
                    )}
                  >
                    {p.stockM.toFixed(1)}m
                  </span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-ink-400">제작 기간</span>
                  <span className="text-ink-700 num">{p.leadDays}일</span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-ink-400">이번 달 주문</span>
                  <span className="text-ink-700 num">{p.monthlyOrders}건</span>
                </div>
              </div>
              <p className="mt-3 rounded-md bg-ivory-100 px-3 py-2 text-[13.5px] leading-relaxed text-ink-500">
                {p.note}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-4">
        <CardHeader title="상품별 원단 소진 현황" desc="배정 대비 잔여 원단" />
        <div className="grid grid-cols-1 divide-y divide-ink-100 md:grid-cols-2 md:divide-x lg:grid-cols-4">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-4">
              <FabricRoll color={p.color} weave={p.weave} className="h-12 w-12" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium text-ink-800">{p.name}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Bar
                    value={pct(Math.min(p.stockM, 20), 20)}
                    color={p.stockM < 1.5 ? "#e11d48" : "#86293d"}
                  />
                  <span
                    className={cn(
                      "shrink-0 text-[14px] font-medium num",
                      p.stockM < 1.5 ? "text-rose-600" : "text-ink-600",
                    )}
                  >
                    {p.stockM.toFixed(1)}m
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <p className="mt-4 text-center text-[15px] text-ink-300">
        상품 {num(PRODUCTS.length)}종 (데모 데이터)
      </p>
    </div>
  );
}

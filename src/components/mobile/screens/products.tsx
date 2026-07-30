"use client";

import * as React from "react";
import { useApp } from "@/components/app-store";
import Image from "next/image";
import { FabricRoll } from "@/components/fabric-art";
import { useMobileNav } from "@/components/mobile/nav-context";
import {
  MCard,
  MChips,
  MEmpty,
  MProgress,
  MSection,
  MStat,
  MStatGrid,
  MStatusBadge,
} from "@/components/mobile/ui";
import { FABRICS, PRODUCTS, PRODUCT_CATEGORIES } from "@/lib/data";
import { cn, pct, won, wonShort } from "@/lib/utils";

function statusLevel(status: string) {
  return status === "원단 부족" ? "긴급" : status === "예약 마감" ? "주의" : "안내";
}

/* ── 상품 라인업 (쇼핑몰형 그리드) ──────────── */

export function MobileProducts() {
  const [cat, setCat] = React.useState("전체");
  const { go } = useMobileNav();
  const items = PRODUCTS.filter((p) => cat === "전체" || p.category === cat);

  return (
    <>
      <MStatGrid>
        <MStat
          label="상품 라인업"
          value={String(PRODUCTS.length)}
          unit="종"
          hint={`이번 달 주문 ${PRODUCTS.reduce((s, p) => s + p.monthlyOrders, 0)}건`}
        />
        <MStat
          label="원단 부족"
          value={String(PRODUCTS.filter((p) => p.status !== "제작 가능").length)}
          unit="종"
          hint="제작 제한"
          tone="alert"
        />
      </MStatGrid>

      <MSection className="mt-4">
        <MChips items={PRODUCT_CATEGORIES} value={cat} onChange={setCat} />
      </MSection>

      <MSection title={`${items.length}종`} className="mt-3">
        {items.length === 0 ? (
          <MEmpty text="해당 분류의 상품이 없습니다." />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {items.map((p) => (
              <button
                key={p.id}
                onClick={() => go("/tailor/fabrics")}
                className="overflow-hidden rounded-[16px] border border-ink-200/60 bg-white text-left shadow-[0_1px_3px_rgba(16,24,40,0.05)] active:bg-ivory-100"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-ivory-100">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 480px) 50vw, 240px"
                    className="object-cover"
                  />
                  <span className="absolute left-2 top-2">
                    <MStatusBadge status={p.status} level={statusLevel(p.status)} />
                  </span>
                </div>
                <div className="p-3">
                  <p className="break-keep text-[16px] font-semibold leading-snug text-ink-800">
                    {p.name}
                  </p>
                  <p className="mt-1 break-keep text-[13px] leading-snug text-ink-400">
                    {p.color} · {p.fabricLabel.split(" ").slice(0, 2).join(" ")}
                  </p>
                  <p className="mt-2 text-[19px] font-bold text-tailor-700 num">
                    {wonShort(p.priceFrom)}
                    <span className="ml-1 text-[13px] font-normal text-ink-400">부터</span>
                  </p>
                  <p className="mt-1.5 text-[12.5px] text-ink-400 num">
                    제작 {p.leadDays}일 · 이번 달 {p.monthlyOrders}건
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </MSection>

      <MSection title="상품별 원단 재고">
        <MCard>
          <div className="divide-y divide-ink-100">
            {items.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                <span className="relative h-14 w-11 shrink-0 overflow-hidden rounded-[8px] border border-ink-200/70 bg-ivory-100">
                  <Image src={p.image} alt={p.name} fill sizes="44px" className="object-cover" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="break-keep text-[15px] font-medium leading-snug text-ink-800">{p.name}</p>
                  <p className="mt-1 break-keep text-[12.5px] leading-snug text-ink-400">{p.fabricLabel}</p>
                </div>
                <span className="shrink-0 text-right">
                  <span
                    className={cn(
                      "block text-[16px] font-bold num",
                      p.stockM < 1.5 ? "text-rose-600" : "text-ink-800",
                    )}
                  >
                    {p.stockM.toFixed(1)}m
                  </span>
                  <span className="block text-[12px] text-ink-400">잔여</span>
                </span>
              </div>
            ))}
          </div>
        </MCard>
      </MSection>
    </>
  );
}

/* ── 원단 재고 (이미지형으로 재구성) ────────── */

export function MobileFabricsRich() {
  const [status, setStatus] = React.useState("전체");
  const items = FABRICS.filter((f) => status === "전체" || f.status === status);
  const { scope } = useApp();
  void scope;

  return (
    <>
      <MStatGrid>
        <MStat
          label="재고 부족"
          value={String(FABRICS.filter((f) => f.status === "재고 부족").length)}
          unit="종"
          hint="즉시 발주 필요"
          tone="alert"
        />
        <MStat
          label="총 잔여"
          value={`${FABRICS.reduce((s, f) => s + (f.stockM - f.assignedM), 0).toFixed(1)}m`}
          hint={`${FABRICS.length}종 합계`}
        />
      </MStatGrid>

      <MSection className="mt-4">
        <MChips
          items={["전체", "재고 부족", "발주 권장", "발주 완료", "충분"]}
          value={status}
          onChange={setStatus}
        />
      </MSection>

      <MSection title={`${items.length}종`} className="mt-3">
        <div className="space-y-3">
          {items.map((f) => {
            const remain = f.stockM - f.assignedM;
            return (
              <MCard key={f.id}>
                <div className="flex gap-3 p-3.5">
                  <FabricRoll color={f.color} weave={f.weave} className="h-16 w-16" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <p className="min-w-0 flex-1 break-keep text-[16px] font-semibold leading-snug text-ink-800">
                        {f.brand}
                      </p>
                      <MStatusBadge
                        status={f.status}
                        level={
                          f.status === "재고 부족"
                            ? "긴급"
                            : f.status === "발주 권장"
                              ? "주의"
                              : "안내"
                        }
                      />
                    </div>
                    <p className="mt-1 break-keep text-[13.5px] text-ink-400">
                      {f.name} · {f.color}
                    </p>
                    <p className="mt-1 text-[12.5px] text-ink-400">{f.composition}</p>
                  </div>
                </div>
                <div className="px-3.5 pb-3.5">
                  <MProgress value={pct(f.assignedM, f.stockM)} tone="tailor" />
                  <div className="mt-2 flex items-center justify-between text-[13px]">
                    <span className="text-ink-400 num">
                      재고 {f.stockM.toFixed(1)}m · 배정 {f.assignedM.toFixed(1)}m
                    </span>
                    <span
                      className={cn(
                        "font-semibold num",
                        remain < 1.5 ? "text-rose-600" : "text-ink-700",
                      )}
                    >
                      잔여 {remain.toFixed(1)}m
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-ink-100 pt-2 text-[12.5px] text-ink-400 num">
                    <span>{f.code}</span>
                    <span>
                      {won(f.unitPrice)}/m · 리드타임 {f.leadTimeDays}일
                    </span>
                  </div>
                </div>
              </MCard>
            );
          })}
        </div>
      </MSection>
    </>
  );
}

"use client";

import Link from "next/link";
import { Smartphone } from "lucide-react";
import { PageHeader } from "@/components/page-kit";
import { Card, CardHeader } from "@/components/ui/card";
import { Icon } from "@/components/icon";
import { NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";

export default function MorePage() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="전체 메뉴"
        desc="모든 화면을 한 곳에서 확인합니다. 모바일에서는 하단 '더보기' 탭과 연결됩니다."
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {NAV.map((group) => (
          <Card key={group.title ?? "common"} className="h-full">
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-[2px]",
                      group.tone === "tailor"
                        ? "bg-tailor-600"
                        : group.tone === "corp"
                          ? "bg-corp-700"
                          : "bg-ink-300",
                    )}
                  />
                  {group.title ?? "경영 전반"}
                </span>
              }
              desc={`${group.items.length}개 화면`}
            />
            <ul>
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2.5 border-b border-ink-100 px-4 py-2.5 text-[17px] text-ink-600 transition-colors last:border-b-0 hover:bg-ivory-100 hover:text-ink-800"
                  >
                    <Icon name={item.icon} className="h-[15px] w-[15px] text-ink-400" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge ? (
                      <span className="rounded bg-ink-100 px-1.5 py-0.5 text-[14.5px] font-medium text-ink-600 num">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <Card className="mt-3">
        <CardHeader title="대표자 계정" desc="양사 통합 관리자" />
        <div className="flex flex-wrap items-center gap-4 p-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-800 text-[20.5px] font-semibold text-white">
            박
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[20.5px] font-semibold text-ink-800">박정열 대표</p>
            <p className="mt-0.5 text-[16px] text-ink-400">
              비앤테일러샵 · AI 소프트웨어 법인 대표이사
            </p>
          </div>
          <Link
            href="/mobile"
            className="flex items-center gap-1.5 rounded-md border border-ink-200 px-3 py-2 text-[17px] text-ink-600 transition-colors hover:bg-ivory-100"
          >
            <Smartphone className="h-3.5 w-3.5" />
            모바일 브리핑 미리보기
          </Link>
        </div>
      </Card>
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { useApp } from "@/components/app-store";
import { CompanyChip, PageHeader } from "@/components/page-kit";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AlertLevel } from "@/lib/types";

const LEVELS: (AlertLevel | "전체")[] = ["전체", "긴급", "주의", "안내"];

export default function NotificationsPage() {
  const { alerts, scope, markAllRead, markRead, unread } = useApp();
  const [level, setLevel] = React.useState<AlertLevel | "전체">("전체");

  const items = alerts.filter(
    (a) => (scope === "all" || a.company === scope) && (level === "전체" || a.level === level),
  );

  const byCategory = Array.from(new Set(alerts.map((a) => a.category)));

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="알림 센터"
        desc={`읽지 않은 알림 ${unread}건 · 재고, 납기, 프로젝트, 자금 알림을 모아서 확인합니다.`}
        actions={
          <Button variant="outline" onClick={markAllRead}>
            모두 읽음 처리
          </Button>
        }
      />

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-8">
          <Card>
            <CardHeader
              title="알림 목록"
              desc={`${items.length}건`}
              action={
                <div className="flex items-center gap-1 rounded-md border border-ink-200 p-0.5">
                  {LEVELS.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className={cn(
                        "rounded px-2 py-1 text-[11.5px] transition-colors",
                        level === l ? "bg-ink-800 text-white" : "text-ink-500 hover:bg-ink-50",
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              }
            />
            <ul>
              {items.map((a) => (
                <li key={a.id}>
                  <Link
                    href={a.href}
                    onClick={() => markRead(a.id)}
                    className={cn(
                      "flex gap-3 border-b border-ink-100 px-4 py-3.5 transition-colors last:border-b-0 hover:bg-ivory-100/70",
                      !a.read && "bg-ivory-100/50",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                        a.level === "긴급"
                          ? "bg-rose-500"
                          : a.level === "주의"
                            ? "bg-amber-500"
                            : "bg-ink-300",
                      )}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-1.5">
                        <CompanyChip company={a.company} />
                        <StatusBadge status={a.level} />
                        <span className="text-[11px] text-ink-400">{a.category}</span>
                        <span className="ml-auto text-[11px] text-ink-400">{a.at}</span>
                      </span>
                      <span
                        className={cn(
                          "mt-1.5 block text-[13px]",
                          a.read ? "text-ink-600" : "font-medium text-ink-800",
                        )}
                      >
                        {a.title}
                      </span>
                      <span className="mt-0.5 block text-[11.5px] leading-relaxed text-ink-400">
                        {a.detail}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
              {items.length === 0 ? (
                <li className="px-4 py-12 text-center text-[12.5px] text-ink-400">
                  조건에 맞는 알림이 없습니다.
                </li>
              ) : null}
            </ul>
          </Card>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <Card className="mb-3">
            <CardHeader title="알림 요약" desc="등급별 건수" />
            <div className="grid grid-cols-3 divide-x divide-ink-100">
              {(["긴급", "주의", "안내"] as AlertLevel[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className="px-2 py-4 text-center transition-colors hover:bg-ivory-100"
                >
                  <p className="text-[11.5px] text-ink-400">{l}</p>
                  <p
                    className={cn(
                      "mt-1 text-[21px] font-semibold num",
                      l === "긴급"
                        ? "text-rose-600"
                        : l === "주의"
                          ? "text-amber-600"
                          : "text-ink-700",
                    )}
                  >
                    {alerts.filter((a) => a.level === l).length}
                  </p>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="알림 유형" desc="카테고리별 분포" />
            <ul className="p-3.5">
              {byCategory.map((c) => {
                const cnt = alerts.filter((a) => a.category === c).length;
                return (
                  <li
                    key={c}
                    className="flex items-center justify-between border-b border-ink-100 py-2 text-[12.5px] last:border-b-0"
                  >
                    <span className="text-ink-600">{c}</span>
                    <span className="font-medium text-ink-800 num">{cnt}건</span>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

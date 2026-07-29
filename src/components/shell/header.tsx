"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, Calendar, ChevronDown, Menu, Search } from "lucide-react";
import { PERIODS, RANGE_LABEL, useApp } from "@/components/app-store";
import { CompanySwitcher } from "@/components/shell/company-switcher";
import { SidebarContent } from "@/components/shell/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function DateFilter() {
  const { period, setPeriod, dateLabel } = useApp();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md border border-ink-200 bg-white px-3 py-[7px] text-[12.5px] text-ink-700 transition-colors hover:bg-ink-50"
      >
        <Calendar className="h-3.5 w-3.5 text-ink-400" />
        <span className="num">{dateLabel}</span>
        <span className="hidden text-ink-300 md:inline">|</span>
        <span className="hidden text-ink-500 md:inline">{period}</span>
        <ChevronDown className="h-3.5 w-3.5 text-ink-400" />
      </button>
      {open ? (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="animate-fade-in absolute right-0 z-40 mt-1.5 w-56 rounded-md border border-ink-200 bg-white p-1.5 shadow-panel">
            <p className="px-2 py-1 text-[11px] text-ink-400">조회 기간</p>
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPeriod(p);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-[12.5px] transition-colors hover:bg-ivory-100",
                  period === p ? "font-medium text-ink-800" : "text-ink-600",
                )}
              >
                <span>{p}</span>
                <span className="text-[10.5px] text-ink-400 num">{RANGE_LABEL[p]}</span>
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function ProfileMenu() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md border border-transparent px-1.5 py-1 transition-colors hover:border-ink-200 hover:bg-white"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-800 text-[11px] font-semibold text-white">
          김
        </span>
        <span className="hidden text-left leading-tight md:block">
          <span className="block text-[12.5px] font-medium text-ink-800">김상호 대표</span>
          <span className="block text-[10.5px] text-ink-400">양사 대표이사</span>
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-ink-400" />
      </button>
      {open ? (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="animate-fade-in absolute right-0 z-40 mt-1.5 w-52 rounded-md border border-ink-200 bg-white p-1.5 shadow-panel">
            <div className="border-b border-ink-100 px-2 pb-2 pt-1">
              <p className="text-[12.5px] font-medium text-ink-800">김상호</p>
              <p className="text-[11px] text-ink-400">비앤테일러샵 · AI 소프트웨어 법인</p>
            </div>
            <Link
              href="/companies"
              onClick={() => setOpen(false)}
              className="block rounded px-2 py-1.5 text-[12.5px] text-ink-600 hover:bg-ivory-100"
            >
              회사 정보 · 전환
            </Link>
            <Link
              href="/reports"
              onClick={() => setOpen(false)}
              className="block rounded px-2 py-1.5 text-[12.5px] text-ink-600 hover:bg-ivory-100"
            >
              보고서 보관함
            </Link>
            <Link
              href="/mobile"
              onClick={() => setOpen(false)}
              className="block rounded px-2 py-1.5 text-[12.5px] text-ink-600 hover:bg-ivory-100"
            >
              모바일 브리핑 미리보기
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}

export function Header() {
  const { setNotifyOpen, setSearchOpen, unread } = useApp();

  return (
    <header className="sticky top-0 z-30 border-b border-ink-200/70 bg-white/95 backdrop-blur">
      <div className="flex h-[58px] items-center gap-3 px-4 lg:px-6">
        {/* 모바일 : 사이드바 드로어 */}
        <Sheet>
          <SheetTrigger className="rounded-md border border-ink-200 p-1.5 text-ink-600 lg:hidden">
            <Menu className="h-4 w-4" />
          </SheetTrigger>
          <SheetContent
            title="메뉴"
            desc="B&AI Control"
            side="left"
            className="w-[260px] border-0 p-0"
            style={{ background: "var(--sidebar)" }}
          >
            <SidebarContent />
          </SheetContent>
        </Sheet>

        <Link href="/dashboard" className="flex items-baseline gap-1 lg:hidden">
          <span className="text-[15px] font-semibold tracking-tight text-ink-800">B&amp;AI</span>
          <span className="text-[15px] font-light tracking-[0.14em] text-ink-400">CONTROL</span>
        </Link>

        <div className="hidden lg:block">
          <CompanySwitcher compact />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 rounded-md border border-ink-200 bg-white px-3 py-[7px] text-[12.5px] text-ink-400 transition-colors hover:bg-ink-50"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">고객 · 주문 · 프로젝트 검색</span>
          </button>

          <div className="hidden md:block">
            <DateFilter />
          </div>

          <button
            onClick={() => setNotifyOpen(true)}
            className="relative rounded-md border border-ink-200 bg-white p-[7px] text-ink-500 transition-colors hover:bg-ink-50"
          >
            <Bell className="h-4 w-4" />
            {unread > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9.5px] font-semibold text-white">
                {unread}
              </span>
            ) : null}
          </button>

          <div className="mx-0.5 hidden h-6 w-px bg-ink-200 md:block" />
          <div className="hidden md:block">
            <ProfileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

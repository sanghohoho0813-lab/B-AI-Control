"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useApp } from "@/components/app-store";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AI_PROJECTS, FABRICS, TAILOR_CUSTOMERS, TAILOR_ORDERS } from "@/lib/data";
import { ALL_NAV_ITEMS } from "@/lib/nav";

interface Hit {
  group: string;
  label: string;
  sub: string;
  href: string;
  company: "tailor" | "corp" | null;
}

const INDEX: Hit[] = [
  ...ALL_NAV_ITEMS.map((n) => ({
    group: "메뉴",
    label: n.label,
    sub: n.href,
    href: n.href,
    company: n.scope === "tailor" ? ("tailor" as const) : n.scope === "corp" ? ("corp" as const) : null,
  })),
  ...TAILOR_CUSTOMERS.map((c) => ({
    group: "고객",
    label: c.name,
    sub: `${c.grade} · ${c.company}`,
    href: "/tailor/customers",
    company: "tailor" as const,
  })),
  ...TAILOR_ORDERS.map((o) => ({
    group: "주문",
    label: `${o.id} ${o.customer}`,
    sub: `${o.item} · ${o.stage}`,
    href: "/tailor/orders",
    company: "tailor" as const,
  })),
  ...FABRICS.map((f) => ({
    group: "원단",
    label: `${f.brand} ${f.name}`,
    sub: `${f.code} · ${f.color}`,
    href: "/tailor/fabrics",
    company: "tailor" as const,
  })),
  ...AI_PROJECTS.map((p) => ({
    group: "프로젝트",
    label: p.name,
    sub: `${p.phase} · ${p.owner}`,
    href: "/ai/projects",
    company: "corp" as const,
  })),
];

export function SearchDialog() {
  const { searchOpen, setSearchOpen } = useApp();
  const [q, setQ] = React.useState("");
  const router = useRouter();

  const hits = React.useMemo(() => {
    const key = q.trim();
    if (!key) return INDEX.filter((h) => h.group === "메뉴").slice(0, 7);
    return INDEX.filter(
      (h) => h.label.includes(key) || h.sub.includes(key) || h.group.includes(key),
    ).slice(0, 12);
  }, [q]);

  React.useEffect(() => {
    if (!searchOpen) setQ("");
  }, [searchOpen]);

  return (
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogContent
        title="통합 검색"
        desc="고객 · 주문 · 원단 · 프로젝트 · 메뉴를 한 번에 검색합니다"
        className="max-w-xl"
      >
        <div className="border-b border-ink-200/60 px-5 py-3">
          <div className="flex items-center gap-2 rounded-md border border-ink-200 bg-ivory-100/60 px-3 py-2">
            <Search className="h-4 w-4 text-ink-400" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="예) 김진우, Zegna, 챗봇, 원단"
              className="w-full bg-transparent text-[13px] text-ink-800 outline-none placeholder:text-ink-300"
            />
          </div>
        </div>
        <ul className="p-2">
          {hits.length === 0 ? (
            <li className="px-3 py-8 text-center text-[12.5px] text-ink-400">
              검색 결과가 없습니다.
            </li>
          ) : (
            hits.map((h, i) => (
              <li key={`${h.href}-${i}`}>
                <button
                  onClick={() => {
                    router.push(h.href);
                    setSearchOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-ivory-100"
                >
                  <Badge
                    className={
                      h.company === "tailor"
                        ? "border-tailor-200 bg-tailor-50 text-tailor-700"
                        : h.company === "corp"
                          ? "border-corp-200 bg-corp-50 text-corp-700"
                          : "border-ink-200 bg-ink-50 text-ink-500"
                    }
                  >
                    {h.group}
                  </Badge>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] text-ink-800">{h.label}</span>
                    <span className="block truncate text-[11.5px] text-ink-400">{h.sub}</span>
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

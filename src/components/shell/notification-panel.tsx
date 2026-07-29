"use client";

import Link from "next/link";
import { useApp } from "@/components/app-store";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COMPANIES } from "@/lib/data";
import { cn, statusStyle } from "@/lib/utils";

export function NotificationPanel() {
  const { alerts, notifyOpen, setNotifyOpen, markAllRead, markRead, unread } = useApp();

  return (
    <Sheet open={notifyOpen} onOpenChange={setNotifyOpen}>
      <SheetContent title="알림 센터" desc={`읽지 않은 알림 ${unread}건`}>
        <div className="flex items-center justify-between border-b border-ink-200/60 px-4 py-2.5">
          <span className="text-[15.5px] text-ink-400">최근 알림 {alerts.length}건</span>
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            모두 읽음 처리
          </Button>
        </div>
        <ul>
          {alerts.map((a) => {
            const c = COMPANIES[a.company];
            return (
              <li key={a.id}>
                <Link
                  href={a.href}
                  onClick={() => {
                    markRead(a.id);
                    setNotifyOpen(false);
                  }}
                  className={cn(
                    "flex gap-3 border-b border-ink-100 px-4 py-3 transition-colors hover:bg-ivory-100",
                    !a.read && "bg-ivory-100/60",
                  )}
                >
                  <span
                    className={cn(
                      "mt-1 h-1.5 w-1.5 shrink-0 rounded-full",
                      a.level === "긴급"
                        ? "bg-rose-500"
                        : a.level === "주의"
                          ? "bg-amber-500"
                          : "bg-ink-300",
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Badge
                        className={
                          a.company === "tailor"
                            ? "border-tailor-200 bg-tailor-50 text-tailor-700"
                            : "border-corp-200 bg-corp-50 text-corp-700"
                        }
                      >
                        {c.shortName}
                      </Badge>
                      <Badge className={statusStyle(a.level)}>{a.level}</Badge>
                      <span className="ml-auto shrink-0 text-[15px] text-ink-400">{a.at}</span>
                    </div>
                    <p
                      className={cn(
                        "mt-1.5 text-[17px] leading-snug",
                        a.read ? "text-ink-600" : "font-medium text-ink-800",
                      )}
                    >
                      {a.title}
                    </p>
                    <p className="mt-0.5 text-[15.5px] leading-relaxed text-ink-400">{a.detail}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="p-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/notifications" onClick={() => setNotifyOpen(false)}>
              알림 센터 전체 보기
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import * as React from "react";
import { AppStoreProvider } from "@/components/app-store";
import { MobileApp } from "@/components/mobile/mobile-app";
import { Header } from "@/components/shell/header";
import { NotificationPanel } from "@/components/shell/notification-panel";
import { SearchDialog } from "@/components/shell/search-dialog";
import { Sidebar } from "@/components/shell/sidebar";

const DESKTOP_QUERY = "(min-width: 1024px)";

/**
 * 데스크톱과 모바일은 완전히 다른 셸을 사용한다.
 * 첫 렌더에서는 CSS로 양쪽을 준비해 두고, 마운트 이후에는 해당하는 쪽만 남겨
 * 모바일에서 데스크톱 표·차트·사이드바가 DOM에 남지 않도록 한다.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<"both" | "desktop" | "mobile">("both");

  React.useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const apply = () => setMode(mq.matches ? "desktop" : "mobile");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <AppStoreProvider>
      {mode !== "mobile" ? (
        <div className="hidden lg:block">
          <Sidebar />
          <div className="min-h-screen lg:pl-[296px]">
            <Header />
            <main className="mx-auto w-full max-w-[1440px] px-4 pb-10 pt-5 lg:px-6">
              {children}
            </main>
          </div>
          <NotificationPanel />
          <SearchDialog />
        </div>
      ) : null}

      {mode !== "desktop" ? (
        <div className="lg:hidden">
          <MobileApp />
        </div>
      ) : null}
    </AppStoreProvider>
  );
}

"use client";

import * as React from "react";

interface MobileNav {
  /** 현재 모바일 화면 경로 */
  path: string;
  /** 화면 이동 (미리보기 모드에서는 내부 상태만 변경) */
  go: (href: string) => void;
  /** 뒤로 가기 */
  back: () => void;
  /** 데스크톱 미리보기 프레임 안에서 동작 중인지 */
  embedded: boolean;
}

const Ctx = React.createContext<MobileNav | null>(null);

export function MobileNavProvider({
  value,
  children,
}: {
  value: MobileNav;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMobileNav() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useMobileNav must be used within MobileNavProvider");
  return ctx;
}

import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "B&AI Control — 통합 경영 OS",
  description:
    "비앤테일러샵과 AI 소프트웨어 법인의 매출, 운영, 프로젝트, 자금과 주요 일정을 하나의 계정에서 관리하는 통합 경영 OS",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d1526",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

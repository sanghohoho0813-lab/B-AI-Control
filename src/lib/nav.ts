import type { Scope } from "./types";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  scope: Scope;
  badge?: number;
}

export interface NavGroup {
  title: string | null;
  tone: "neutral" | "tailor" | "corp";
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    title: null,
    tone: "neutral",
    items: [
      { label: "통합 대시보드", href: "/dashboard", icon: "LayoutDashboard", scope: "all" },
      { label: "회사 전환", href: "/companies", icon: "Building2", scope: "all" },
      { label: "매출·재무", href: "/revenue", icon: "TrendingUp", scope: "all" },
      { label: "자금 관리", href: "/finance", icon: "Wallet", scope: "all" },
      { label: "승인 업무", href: "/approvals", icon: "ClipboardCheck", scope: "all", badge: 8 },
      { label: "일정 관리", href: "/schedule", icon: "CalendarDays", scope: "all" },
      { label: "보고서", href: "/reports", icon: "FileText", scope: "all" },
      { label: "알림 센터", href: "/notifications", icon: "Bell", scope: "all", badge: 4 },
    ],
  },
  {
    title: "비앤테일러샵",
    tone: "tailor",
    items: [
      { label: "운영 대시보드", href: "/tailor", icon: "Gauge", scope: "tailor" },
      { label: "고객 관리", href: "/tailor/customers", icon: "Users", scope: "tailor" },
      { label: "주문 관리", href: "/tailor/orders", icon: "ClipboardList", scope: "tailor" },
      { label: "원단·재고", href: "/tailor/fabrics", icon: "Layers", scope: "tailor", badge: 5 },
      { label: "제작·납기", href: "/tailor/production", icon: "Scissors", scope: "tailor" },
      { label: "매출 관리", href: "/tailor/sales", icon: "Receipt", scope: "tailor" },
      { label: "고객 분석", href: "/tailor/analytics", icon: "PieChart", scope: "tailor" },
    ],
  },
  {
    title: "AI 소프트웨어 법인",
    tone: "corp",
    items: [
      { label: "사업화 대시보드", href: "/ai", icon: "Gauge", scope: "corp" },
      { label: "프로젝트 관리", href: "/ai/projects", icon: "FolderKanban", scope: "corp" },
      { label: "R&D 관리", href: "/ai/rnd", icon: "FlaskConical", scope: "corp" },
      { label: "인력 관리", href: "/ai/people", icon: "UsersRound", scope: "corp" },
      { label: "기술·데이터", href: "/ai/tech", icon: "Database", scope: "corp" },
      { label: "사업화 관리", href: "/ai/biz", icon: "Handshake", scope: "corp" },
      { label: "매출 관리", href: "/ai/sales", icon: "Receipt", scope: "corp" },
    ],
  },
  {
    title: "대표자 도구",
    tone: "neutral",
    items: [
      { label: "모바일 브리핑", href: "/mobile", icon: "Smartphone", scope: "all" },
      { label: "전체 메뉴", href: "/more", icon: "LayoutGrid", scope: "all" },
    ],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = NAV.flatMap((g) => g.items);

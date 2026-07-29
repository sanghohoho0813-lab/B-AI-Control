import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CompanyId, Scope } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 1,234,000 → ₩1,234,000 */
export function won(value: number) {
  return `₩${value.toLocaleString("ko-KR")}`;
}

/** 128450000 → 1억 2,845만 */
export function wonShort(value: number) {
  if (value === 0) return "0원";
  const eok = Math.floor(value / 100_000_000);
  const man = Math.floor((value % 100_000_000) / 10_000);
  if (eok > 0) return man > 0 ? `${eok}억 ${man.toLocaleString("ko-KR")}만` : `${eok}억`;
  if (man > 0) return `${man.toLocaleString("ko-KR")}만`;
  return value.toLocaleString("ko-KR");
}

/** 차트 축 전용 짧은 표기 : 140000000 → 1.4억 */
export function wonAxis(value: number) {
  if (value === 0) return "0";
  if (Math.abs(value) >= 100_000_000) {
    const eok = value / 100_000_000;
    return `${eok % 1 === 0 ? eok : eok.toFixed(1)}억`;
  }
  if (Math.abs(value) >= 10_000) return `${Math.round(value / 10_000).toLocaleString("ko-KR")}만`;
  return value.toLocaleString("ko-KR");
}

export function pct(part: number, total: number) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

export function num(value: number) {
  return value.toLocaleString("ko-KR");
}

/** 회사별 컬러 토큰 모음 — 두 법인의 데이터가 섞이지 않도록 화면 전체에서 재사용한다. */
export const TONE = {
  tailor: {
    key: "tailor" as const,
    label: "비앤테일러샵",
    text: "text-tailor-700",
    textSoft: "text-tailor-600",
    bg: "bg-tailor-600",
    bgSoft: "bg-tailor-50",
    bgMid: "bg-tailor-100",
    border: "border-tailor-200",
    ring: "ring-tailor-200",
    chart: "#86293d",
    chartSoft: "#d9a0ab",
    gradient: "from-tailor-700 to-tailor-800",
    chip: "bg-tailor-50 text-tailor-700 border-tailor-200",
    dot: "bg-tailor-600",
  },
  corp: {
    key: "corp" as const,
    label: "AI 소프트웨어 법인",
    text: "text-corp-700",
    textSoft: "text-corp-600",
    bg: "bg-corp-600",
    bgSoft: "bg-corp-50",
    bgMid: "bg-corp-100",
    border: "border-corp-200",
    ring: "ring-corp-200",
    chart: "#234084",
    chartSoft: "#94a9d8",
    gradient: "from-corp-700 to-corp-900",
    chip: "bg-corp-50 text-corp-700 border-corp-200",
    dot: "bg-corp-600",
  },
};

export function tone(company: CompanyId) {
  return TONE[company];
}

export function inScope(company: CompanyId, scope: Scope) {
  return scope === "all" || scope === company;
}

export const STATUS_STYLE: Record<string, string> = {
  정상: "bg-emerald-50 text-emerald-700 border-emerald-200",
  완료: "bg-slate-100 text-slate-600 border-slate-200",
  "지연 위험": "bg-amber-50 text-amber-700 border-amber-200",
  주의: "bg-amber-50 text-amber-700 border-amber-200",
  지연: "bg-rose-50 text-rose-700 border-rose-200",
  충분: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "발주 권장": "bg-amber-50 text-amber-700 border-amber-200",
  "재고 부족": "bg-rose-50 text-rose-700 border-rose-200",
  "발주 완료": "bg-sky-50 text-sky-700 border-sky-200",
  "집행 완료": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "승인 대기": "bg-amber-50 text-amber-700 border-amber-200",
  예정: "bg-slate-100 text-slate-600 border-slate-200",
  긴급: "bg-rose-50 text-rose-700 border-rose-200",
  안내: "bg-slate-100 text-slate-600 border-slate-200",
  "계약 완료": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "계약 협의": "bg-sky-50 text-sky-700 border-sky-200",
  "PoC 진행": "bg-indigo-50 text-indigo-700 border-indigo-200",
  제안: "bg-slate-100 text-slate-600 border-slate-200",
  보류: "bg-rose-50 text-rose-700 border-rose-200",
  "운영 중": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "구축 중": "bg-sky-50 text-sky-700 border-sky-200",
  "검증 중": "bg-amber-50 text-amber-700 border-amber-200",
  "출원 중": "bg-indigo-50 text-indigo-700 border-indigo-200",
  VIP: "bg-tailor-50 text-tailor-700 border-tailor-200",
  우수: "bg-amber-50 text-amber-700 border-amber-200",
  신규: "bg-sky-50 text-sky-700 border-sky-200",
  일반: "bg-slate-100 text-slate-600 border-slate-200",
};

export function statusStyle(status: string) {
  return STATUS_STYLE[status] ?? "bg-slate-100 text-slate-600 border-slate-200";
}

/** 원단 색상명을 미리보기 색상으로 변환 */
export function colorOf(color: string) {
  if (color.includes("네이비") || color.includes("미드나잇")) return "#1f2b46";
  if (color.includes("차콜")) return "#3f434a";
  if (color.includes("블랙")) return "#17181b";
  if (color.includes("카멜")) return "#a5763f";
  if (color.includes("브라운")) return "#5b4130";
  if (color.includes("화이트")) return "#f2f2ef";
  if (color.includes("그레이")) return "#a8aaad";
  return "#b9b3a7";
}

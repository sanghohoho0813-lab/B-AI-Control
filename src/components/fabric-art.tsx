"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type Weave = "herringbone" | "pinstripe" | "twill" | "plain" | "cashmere" | "poplin";
export type Garment = "suit" | "shirt" | "coat" | "pantsuit" | "tuxedo";

/** 색상명 → 원단 기본색 */
export function fabricColor(color: string) {
  if (color.includes("네이비") || color.includes("미드나잇")) return "#22304f";
  if (color.includes("차콜")) return "#41454c";
  if (color.includes("블랙")) return "#1b1c1f";
  if (color.includes("카멜")) return "#a97b46";
  if (color.includes("브라운")) return "#5f4433";
  if (color.includes("화이트")) return "#f0efec";
  if (color.includes("라이트 그레이") || color.includes("그레이")) return "#9a9da2";
  return "#b8b2a6";
}

function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const r = clamp(((n >> 16) & 255) + amount);
  const g = clamp(((n >> 8) & 255) + amount);
  const b = clamp((n & 255) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

/** 원단 조직을 SVG 패턴으로 표현한다 (외부 이미지 없이 자체 렌더링) */
export function WeaveDefs({ id, color, weave }: { id: string; color: string; weave: Weave }) {
  const light = shade(color, 26);
  const dark = shade(color, -22);

  if (weave === "herringbone") {
    return (
      <pattern id={id} width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="16" height="16" fill={color} />
        <path d="M0 8 L4 4 L8 8 L12 4 L16 8" stroke={light} strokeWidth="1.6" fill="none" />
        <path d="M0 16 L4 12 L8 16 L12 12 L16 16" stroke={dark} strokeWidth="1.6" fill="none" />
      </pattern>
    );
  }
  if (weave === "pinstripe") {
    return (
      <pattern id={id} width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="12" height="12" fill={color} />
        <line x1="3" y1="0" x2="3" y2="12" stroke={light} strokeWidth="1.4" />
        <line x1="9" y1="0" x2="9" y2="12" stroke={light} strokeWidth="0.7" opacity="0.5" />
      </pattern>
    );
  }
  if (weave === "twill") {
    return (
      <pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="10" height="10" fill={color} />
        <path d="M-2 2 L2 -2 M0 10 L10 0 M8 12 L12 8" stroke={light} strokeWidth="1.6" />
      </pattern>
    );
  }
  if (weave === "cashmere") {
    return (
      <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse">
        <rect width="14" height="14" fill={color} />
        <circle cx="4" cy="4" r="1.5" fill={light} opacity="0.55" />
        <circle cx="11" cy="9" r="1.5" fill={light} opacity="0.4" />
        <circle cx="7" cy="12" r="1" fill={dark} opacity="0.5" />
      </pattern>
    );
  }
  if (weave === "poplin") {
    return (
      <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill={color} />
        <line x1="0" y1="4" x2="8" y2="4" stroke={dark} strokeWidth="0.8" opacity="0.4" />
        <line x1="4" y1="0" x2="4" y2="8" stroke={dark} strokeWidth="0.8" opacity="0.4" />
      </pattern>
    );
  }
  // plain : 평직
  return (
    <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse">
      <rect width="6" height="6" fill={color} />
      <line x1="0" y1="3" x2="6" y2="3" stroke={light} strokeWidth="1" opacity="0.5" />
      <line x1="3" y1="0" x2="3" y2="6" stroke={dark} strokeWidth="1" opacity="0.35" />
    </pattern>
  );
}

let seq = 0;
function useId(prefix: string) {
  const [id] = React.useState(() => `${prefix}-${(seq += 1)}`);
  return id;
}

/** 원단 스와치 (재고 목록 · 상품 카드에서 사용) */
export function FabricSwatch({
  color,
  weave,
  className,
  rounded = 10,
}: {
  color: string;
  weave: Weave;
  className?: string;
  rounded?: number;
}) {
  const id = useId("weave");
  const base = fabricColor(color);
  return (
    <svg viewBox="0 0 48 48" className={cn("shrink-0", className)} aria-hidden>
      <defs>
        <WeaveDefs id={id} color={base} weave={weave} />
      </defs>
      <rect width="48" height="48" rx={rounded} fill={`url(#${id})`} />
      <rect
        width="48"
        height="48"
        rx={rounded}
        fill="none"
        stroke="rgba(0,0,0,0.14)"
        strokeWidth="1.5"
      />
      {/* 원단 접힘 하이라이트 */}
      <path d="M0 34 Q 24 24 48 34 L48 48 L0 48 Z" fill="rgba(255,255,255,0.07)" />
    </svg>
  );
}

/* ── 의류 실루엣 ────────────────────────────── */

const SHADE = "rgba(0,0,0,0.18)";
const HILITE = "rgba(255,255,255,0.45)";

/** 몸판 + 소매로 구성한 재킷 실루엣 */
function Jacket({ hem, sleeve, tux }: { hem: number; sleeve: number; tux?: boolean }) {
  return (
    <>
      {/* 소매 */}
      <path d={`M34 26 L18 34 L15 ${sleeve} L28 ${sleeve + 3} L31 50 Z`} fill="currentColor" />
      <path d={`M66 26 L82 34 L85 ${sleeve} L72 ${sleeve + 3} L69 50 Z`} fill="currentColor" />
      <path d={`M34 26 L18 34 L15 ${sleeve} L28 ${sleeve + 3} L31 50 Z`} fill={SHADE} />
      <path d={`M66 26 L82 34 L85 ${sleeve} L72 ${sleeve + 3} L69 50 Z`} fill={SHADE} />
      {/* 몸판 */}
      <path
        d={`M34 26 L30 33 L29 ${hem} L71 ${hem} L70 33 L66 26 L50 48 Z`}
        fill="currentColor"
      />
      {/* 라펠 */}
      {tux ? (
        <path d="M34 26 L50 48 L66 26 L59 24 L50 36 L41 24 Z" fill={HILITE} />
      ) : null}
      <path d={`M34 26 L50 48 L43 ${Math.min(hem - 26, 88)}`} fill="none" stroke={HILITE} strokeWidth="2" />
      <path d={`M66 26 L50 48 L57 ${Math.min(hem - 26, 88)}`} fill="none" stroke={HILITE} strokeWidth="2" />
      {/* 앞여밈 · 단추 */}
      <line x1="50" y1="48" x2="50" y2={hem} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <circle cx="54" cy={hem - 32} r="2.4" fill="rgba(255,255,255,0.8)" />
      <circle cx="54" cy={hem - 18} r="2.4" fill="rgba(255,255,255,0.8)" />
      {/* 어깨 라인 */}
      <path d="M34 26 L50 30 L66 26" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
    </>
  );
}

/** 원단 위에 의류 실루엣을 얹은 상품 이미지 */
export function GarmentArt({
  garment,
  color,
  weave,
  className,
}: {
  garment: Garment;
  color: string;
  weave: Weave;
  className?: string;
}) {
  const id = useId("g");
  const base = fabricColor(color);
  const dark = shade(base, -34);

  return (
    <svg viewBox="0 0 100 170" className={cn("h-full w-full", className)} aria-hidden>
      <defs>
        <WeaveDefs id={id} color={base} weave={weave} />
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#faf7f2" />
          <stop offset="100%" stopColor="#ece5da" />
        </linearGradient>
      </defs>
      <rect width="100" height="170" fill={`url(#${id}-bg)`} />
      <rect x="8" y="10" width="84" height="150" rx="10" fill={`url(#${id})`} opacity="0.2" />
      {/* 옷걸이 */}
      <path
        d="M50 10 L50 18 M50 18 L34 26 M50 18 L66 26"
        stroke="rgba(60,50,40,0.28)"
        strokeWidth="1.6"
        fill="none"
      />

      <g color={base}>
        {garment === "suit" ? <Jacket hem={122} sleeve={98} /> : null}
        {garment === "tuxedo" ? <Jacket hem={122} sleeve={98} tux /> : null}
        {garment === "coat" ? (
          <>
            <Jacket hem={154} sleeve={116} />
            <rect x="29" y="98" width="42" height="5" rx="2.5" fill={HILITE} />
            <rect x="46" y="97" width="9" height="7" rx="1.5" fill="rgba(255,255,255,0.7)" />
          </>
        ) : null}

        {garment === "pantsuit" ? (
          <>
            <path d="M31 100 L47 100 L45 158 L33 158 Z" fill="currentColor" />
            <path d="M53 100 L69 100 L67 158 L55 158 Z" fill="currentColor" />
            <line x1="39" y1="106" x2="38" y2="156" stroke="rgba(255,255,255,0.28)" strokeWidth="1.2" />
            <line x1="61" y1="106" x2="60" y2="156" stroke="rgba(255,255,255,0.28)" strokeWidth="1.2" />
            <Jacket hem={100} sleeve={82} />
          </>
        ) : null}

        {garment === "shirt" ? (
          <>
            <path d={`M34 26 L19 34 L16 96 L29 99 L32 50 Z`} fill="currentColor" />
            <path d={`M66 26 L81 34 L84 96 L71 99 L68 50 Z`} fill="currentColor" />
            <path d={`M34 26 L19 34 L16 96 L29 99 L32 50 Z`} fill={SHADE} />
            <path d={`M66 26 L81 34 L84 96 L71 99 L68 50 Z`} fill={SHADE} />
            <path d="M34 26 L30 33 L29 126 L71 126 L70 33 L66 26 L50 40 Z" fill="currentColor" />
            {/* 카라 */}
            <path d="M36 24 L50 40 L43 22 Z" fill={HILITE} />
            <path d="M64 24 L50 40 L57 22 Z" fill={HILITE} />
            <line x1="50" y1="40" x2="50" y2="126" stroke="rgba(255,255,255,0.4)" strokeWidth="3.5" />
            {[54, 68, 82, 96, 110].map((y) => (
              <circle key={y} cx="50" cy={y} r="1.7" fill={dark} />
            ))}
          </>
        ) : null}
      </g>
    </svg>
  );
}

/** 원단 롤 아이콘 (재고 화면용) */
export function FabricRoll({
  color,
  weave,
  className,
}: {
  color: string;
  weave: Weave;
  className?: string;
}) {
  const id = useId("roll");
  const base = fabricColor(color);
  return (
    <svg viewBox="0 0 64 64" className={cn("shrink-0", className)} aria-hidden>
      <defs>
        <WeaveDefs id={id} color={base} weave={weave} />
      </defs>
      {/* 펼쳐진 원단 */}
      <path d="M6 40 Q 20 30 32 38 Q 44 46 58 36 L58 56 L6 56 Z" fill={`url(#${id})`} />
      {/* 롤 몸통 */}
      <rect x="10" y="12" width="44" height="22" rx="6" fill={`url(#${id})`} />
      <ellipse cx="14" cy="23" rx="5" ry="11" fill={shade(base, -26)} />
      <ellipse cx="14" cy="23" rx="2" ry="5" fill={shade(base, 22)} />
      <path
        d="M10 12 h44 a6 6 0 0 1 6 6 v10 a6 6 0 0 1 -6 6 h-44"
        fill="none"
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="1.4"
      />
    </svg>
  );
}

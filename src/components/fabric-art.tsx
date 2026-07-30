"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type Weave = "herringbone" | "pinstripe" | "twill" | "plain" | "cashmere" | "poplin";

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

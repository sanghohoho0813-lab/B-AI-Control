"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TONE, won, wonAxis, wonShort } from "@/lib/utils";

const AXIS = { fontSize: 12.5, fill: "#8a94a8" } as const;
const GRID = "#eceef2";

function TooltipBox({
  active,
  payload,
  label,
  unit = "won",
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string; payload?: Record<string, unknown> }[];
  label?: string;
  unit?: "won" | "raw" | "pct";
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-ink-200 bg-white px-3 py-2 shadow-panel">
      {label ? <p className="mb-1 text-[13px] font-medium text-ink-700">{label}</p> : null}
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2 text-[13px] text-ink-600">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: p.color ?? "#8a94a8" }}
          />
          <span>{p.name}</span>
          <span className="ml-auto font-medium text-ink-800 num">
            {unit === "won"
              ? won(Number(p.value))
              : unit === "pct"
                ? `${p.value}%`
                : Number(p.value).toLocaleString("ko-KR")}
          </span>
        </p>
      ))}
    </div>
  );
}

/* 회사별 매출 추이 (라인) — series 로 단일 회사만 표시할 수 있다 */
export function RevenueTrendChart({
  data,
  height = 240,
  showLegend = true,
  series = "both",
}: {
  data: { month: string; tailor: number; corp: number }[];
  height?: number;
  showLegend?: boolean;
  series?: "both" | "tailor" | "corp";
}) {
  const showTailor = series !== "corp";
  const showCorp = series !== "tailor";
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -6, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="month" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis
          tick={AXIS}
          axisLine={false}
          tickLine={false}
          width={62}
          tickFormatter={(v: number) => wonAxis(v)}
        />
        <Tooltip content={<TooltipBox />} />
        {showLegend ? (
          <Legend
            verticalAlign="top"
            align="right"
            height={24}
            iconType="circle"
            iconSize={7}
            wrapperStyle={{ fontSize: 13, color: "#5f6a80" }}
          />
        ) : null}
        {showTailor ? (
          <Line
            type="monotone"
            dataKey="tailor"
            name="비앤테일러샵"
            stroke={TONE.tailor.chart}
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 0, fill: TONE.tailor.chart }}
            activeDot={{ r: 4.5 }}
          />
        ) : null}
        {showCorp ? (
          <Line
            type="monotone"
            dataKey="corp"
            name="AI 소프트웨어 법인"
            stroke={TONE.corp.chart}
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 0, fill: TONE.corp.chart }}
            activeDot={{ r: 4.5 }}
          />
        ) : null}
      </LineChart>
    </ResponsiveContainer>
  );
}

/* KPI 카드용 미니 막대 */
export function MiniBars({
  data,
  color,
  height = 44,
}: {
  data: number[];
  color: string;
  height?: number;
}) {
  const rows = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={rows} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <Bar dataKey="v" radius={[2, 2, 0, 0]} maxBarSize={9}>
          {rows.map((_, i) => (
            <Cell key={i} fill={color} fillOpacity={i === rows.length - 1 ? 1 : 0.32} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* KPI 카드용 미니 라인 */
export function MiniLine({
  data,
  color,
  height = 44,
}: {
  data: number[];
  color: string;
  height?: number;
}) {
  const rows = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={rows} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <YAxis hide domain={["dataMin", "dataMax"]} />
        <defs>
          <linearGradient id={`mini-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.28} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.8}
          fill={`url(#mini-${color.replace("#", "")})`}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* 집행률 도넛 */
export function RateDonut({
  value,
  color,
  size = 86,
  label,
}: {
  value: number;
  color: string;
  size?: number;
  label?: string;
}) {
  const data = [
    { name: "집행", value },
    { name: "잔여", value: Math.max(0, 100 - value) },
  ];
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={size * 0.34}
            outerRadius={size * 0.47}
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#eceef2" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[17px] font-semibold text-ink-800 num">{value}%</span>
        {label ? <span className="text-[11px] text-ink-400">{label}</span> : null}
      </div>
    </div>
  );
}

/* 카테고리 도넛 */
export function CategoryDonut({
  data,
  colors,
  height = 220,
  centerTop,
  centerBottom,
}: {
  data: { name: string; value: number }[];
  colors: string[];
  height?: number;
  centerTop?: string;
  centerBottom?: string;
}) {
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="58%"
            outerRadius="82%"
            paddingAngle={1.5}
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<TooltipBox />} />
        </PieChart>
      </ResponsiveContainer>
      {centerTop ? (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[12.5px] text-ink-400">{centerBottom}</span>
          <span className="text-[18px] font-semibold text-ink-800 num">{centerTop}</span>
        </div>
      ) : null}
    </div>
  );
}

/* 계획 vs 집행 막대 */
export function PlanVsActualChart({
  data,
  color,
  height = 260,
}: {
  data: { name: string; planned: number; executed: number }[];
  color: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }} barGap={3}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="name" tick={{ ...AXIS, fontSize: 11.5 }} axisLine={false} tickLine={false} interval={0} />
        <YAxis
          tick={AXIS}
          axisLine={false}
          tickLine={false}
          width={62}
          tickFormatter={(v: number) => wonAxis(v)}
        />
        <Tooltip content={<TooltipBox />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
        <Legend
          verticalAlign="top"
          align="right"
          height={24}
          iconType="circle"
          iconSize={7}
          wrapperStyle={{ fontSize: 13, color: "#5f6a80" }}
        />
        <Bar dataKey="planned" name="계획" fill="#d9dde5" radius={[3, 3, 0, 0]} maxBarSize={26} />
        <Bar dataKey="executed" name="집행" fill={color} radius={[3, 3, 0, 0]} maxBarSize={26} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* 입출금 비교 막대 */
export function CashFlowChart({
  data,
  height = 240,
}: {
  data: { month: string; tailorIn: number; tailorOut: number; corpIn: number; corpOut: number }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }} barGap={2}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="month" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis
          tick={AXIS}
          axisLine={false}
          tickLine={false}
          width={62}
          tickFormatter={(v: number) => wonAxis(v)}
        />
        <Tooltip content={<TooltipBox />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
        <Legend
          verticalAlign="top"
          align="right"
          height={24}
          iconType="circle"
          iconSize={7}
          wrapperStyle={{ fontSize: 13, color: "#5f6a80" }}
        />
        <Bar dataKey="tailorIn" name="비앤 수입" fill={TONE.tailor.chart} radius={[3, 3, 0, 0]} maxBarSize={14} />
        <Bar dataKey="tailorOut" name="비앤 지출" fill={TONE.tailor.chartSoft} radius={[3, 3, 0, 0]} maxBarSize={14} />
        <Bar dataKey="corpIn" name="AI 수입" fill={TONE.corp.chart} radius={[3, 3, 0, 0]} maxBarSize={14} />
        <Bar dataKey="corpOut" name="AI 지출" fill={TONE.corp.chartSoft} radius={[3, 3, 0, 0]} maxBarSize={14} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* 가로 막대 (단계별 건수) */
export function StageBarChart({
  data,
  color,
  height = 220,
}: {
  data: { name: string; value: number }[];
  color: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid stroke={GRID} horizontal={false} />
        <XAxis type="number" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ ...AXIS, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={86}
        />
        <Tooltip content={<TooltipBox unit="raw" />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
        <Bar dataKey="value" name="건수" fill={color} radius={[0, 3, 3, 0]} maxBarSize={16} />
      </BarChart>
    </ResponsiveContainer>
  );
}

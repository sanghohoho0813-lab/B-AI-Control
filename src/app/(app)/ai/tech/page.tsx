"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-kit";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import { DATA_ASSETS } from "@/lib/data";
import { cn, num } from "@/lib/utils";
import type { DataAsset } from "@/lib/types";

const TYPES: (DataAsset["type"] | "전체")[] = [
  "전체",
  "학습 데이터",
  "모델",
  "API",
  "인프라",
  "지식재산권",
];

export default function TechPage() {
  const [type, setType] = React.useState<DataAsset["type"] | "전체">("전체");
  const items = DATA_ASSETS.filter((d) => type === "전체" || d.type === type);

  return (
    <div className="animate-fade-in">
      <PageHeader
        company="corp"
        title="기술·데이터"
        desc="학습 데이터, 모델, API, 인프라와 지식재산권 자산을 관리합니다."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {TYPES.filter((t) => t !== "전체").map((t) => {
          const cnt = DATA_ASSETS.filter((d) => d.type === t).length;
          return (
            <Card key={t}>
              <button
                onClick={() => setType(t as DataAsset["type"])}
                className="w-full p-4 text-left transition-colors hover:bg-ivory-100/60"
              >
                <p className="text-[13.5px] text-ink-500">{t}</p>
                <p className="mt-1.5 text-[21px] font-semibold text-ink-900 num">
                  {cnt}
                  <span className="ml-0.5 text-[12.5px] font-normal text-ink-400">건</span>
                </p>
                <p className="mt-1 text-[12.5px] text-ink-400">
                  운영 {DATA_ASSETS.filter((d) => d.type === t && d.status === "운영 중").length}건
                </p>
              </button>
            </Card>
          );
        })}
      </div>

      <Card className="mt-3">
        <CardHeader
          title="기술 · 데이터 자산"
          desc={`${items.length}건`}
          action={
            <div className="flex items-center gap-1 rounded-md border border-ink-200 p-0.5">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    "rounded px-2 py-1 text-[13px] transition-colors",
                    type === t ? "bg-corp-700 text-white" : "text-ink-500 hover:bg-ink-50",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          }
        />
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>자산명</Th>
                <Th>구분</Th>
                <Th>규모 · 성능</Th>
                <Th>담당</Th>
                <Th>상태</Th>
                <Th>최근 갱신</Th>
                <Th>비고</Th>
              </tr>
            </thead>
            <tbody>
              {items.map((d) => (
                <Tr key={d.id}>
                  <Td className="font-medium text-ink-800">{d.name}</Td>
                  <Td>
                    <Badge className="border-corp-200 bg-corp-50 text-corp-700">{d.type}</Badge>
                  </Td>
                  <Td className="text-ink-600 num">{d.scale}</Td>
                  <Td className="text-ink-600">{d.owner}</Td>
                  <Td>
                    <StatusBadge status={d.status} />
                  </Td>
                  <Td className="text-ink-500 num">{d.updatedAt}</Td>
                  <Td className="text-ink-500">{d.note}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      </Card>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {DATA_ASSETS.map((d) => (
          <Card key={d.id}>
            <div className="p-3.5">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[14px] font-semibold text-ink-800">{d.name}</span>
                <StatusBadge status={d.status} />
              </div>
              <p className="mt-1.5 text-[17px] font-semibold text-corp-700 num">{d.scale}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-ink-400">{d.note}</p>
              <p className="mt-2 border-t border-ink-100 pt-2 text-[12.5px] text-ink-400">
                {d.type} · {d.owner} · <span className="num">{d.updatedAt}</span>
              </p>
            </div>
          </Card>
        ))}
      </div>

      <p className="mt-4 text-center text-[12.5px] text-ink-300">
        기술 · 데이터 자산 {num(DATA_ASSETS.length)}건 (데모 데이터)
      </p>
    </div>
  );
}

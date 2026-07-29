"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bar } from "@/components/ui/progress";
import { StageFlow } from "@/components/page-kit";
import { useApp } from "@/components/app-store";
import { AI_PROJECTS, BUDGET_LINES, ORDER_STAGES, PROJECT_PHASES } from "@/lib/data";
import { cn, num, pct, won } from "@/lib/utils";
import type { AiProject, CompanyId, TailorOrder } from "@/lib/types";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border-b border-ink-100 py-2.5">
      <p className="text-[11px] text-ink-400">{label}</p>
      <div className="mt-1 text-[13px] text-ink-800">{value}</div>
    </div>
  );
}

/* ── 주문 상세 모달 ─────────────────────────── */

export function OrderDetailModal({
  order,
  children,
}: {
  order: TailorOrder;
  children: React.ReactNode;
}) {
  const remain = order.amount - order.deposit;
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        title={`${order.customer} 님 · ${order.item}`}
        desc={`${order.id} · 담당 ${order.manager}`}
      >
        <div className="border-b border-ink-200/60 bg-ivory-100/50 px-5 py-4">
          <p className="mb-2 text-[11.5px] text-ink-400">주문 진행단계</p>
          <StageFlow stages={ORDER_STAGES} current={order.stage} tone="tailor" />
        </div>
        <div className="grid gap-x-6 px-5 pb-2 sm:grid-cols-2">
          <Field label="고객" value={`${order.customer} (${order.customerId})`} />
          <Field label="상태" value={<StatusBadge status={order.status} />} />
          <Field label="제작 품목" value={order.item} />
          <Field label="원단" value={order.fabric} />
          <Field label="주문 금액" value={<span className="num font-semibold">{won(order.amount)}</span>} />
          <Field label="계약금 / 잔금" value={<span className="num">{won(order.deposit)} / {won(remain)}</span>} />
          <Field label="주문일" value={<span className="num">{order.orderedAt}</span>} />
          <Field label="가봉일" value={<span className="num">{order.fittingAt ?? "미정"}</span>} />
          <Field label="납기일" value={<span className="num font-medium text-tailor-700">{order.dueAt}</span>} />
          <Field label="담당" value={order.manager} />
        </div>
        <div className="px-5 py-4">
          <p className="text-[11px] text-ink-400">제작 요청사항</p>
          <p className="mt-1.5 rounded-md border border-ink-200 bg-ivory-100/60 px-3 py-2.5 text-[12.5px] leading-relaxed text-ink-700">
            {order.note}
          </p>
        </div>
        <div className="flex justify-end gap-2 border-t border-ink-200/60 bg-ivory-100/40 px-5 py-3">
          <Button variant="outline" size="sm">고객 연락</Button>
          <Button variant="tailor" size="sm">진행단계 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── 프로젝트 상세 모달 ─────────────────────── */

export function ProjectDetailModal({
  project,
  children,
}: {
  project: AiProject;
  children: React.ReactNode;
}) {
  const rate = pct(project.spent, project.budget);
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent title={project.name} desc={`${project.id} · ${project.product} · 담당 ${project.owner}`}>
        <div className="border-b border-ink-200/60 bg-ivory-100/50 px-5 py-4">
          <p className="mb-2 text-[11.5px] text-ink-400">사업화 단계</p>
          <StageFlow stages={PROJECT_PHASES} current={project.phase} tone="corp" />
        </div>

        <div className="grid gap-4 border-b border-ink-100 px-5 py-4 sm:grid-cols-2">
          <div>
            <div className="mb-1.5 flex items-center justify-between text-[11.5px]">
              <span className="text-ink-400">개발 진행률</span>
              <span className="font-medium text-ink-800 num">{project.progress}%</span>
            </div>
            <Bar value={project.progress} color="#234084" />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between text-[11.5px]">
              <span className="text-ink-400">예산 집행률</span>
              <span className="font-medium text-ink-800 num">{rate}%</span>
            </div>
            <Bar value={rate} color="#5e79bd" />
          </div>
        </div>

        <div className="grid gap-x-6 px-5 pb-2 sm:grid-cols-2">
          <Field label="상태" value={<StatusBadge status={project.status} />} />
          <Field label="계약 구분" value={<Badge className="border-corp-200 bg-corp-50 text-corp-700">{project.contractType}</Badge>} />
          <Field label="고객사" value={project.client} />
          <Field label="투입 인력" value={`${project.headcount}명`} />
          <Field label="배정 예산" value={<span className="num">{won(project.budget)}</span>} />
          <Field label="집행 금액" value={<span className="num">{won(project.spent)}</span>} />
          <Field label="다음 마일스톤" value={project.nextMilestone} />
          <Field label="예상 완료일" value={<span className="num font-medium text-corp-700">{project.dueAt}</span>} />
          <Field
            label="예상 매출"
            value={<span className="num">{project.expectedRevenue ? won(project.expectedRevenue) : "내부 과제 (매출 없음)"}</span>}
          />
          <Field label="이슈" value={project.issue ?? "특이사항 없음"} />
        </div>

        <div className="flex justify-end gap-2 border-t border-ink-200/60 bg-ivory-100/40 px-5 py-3">
          <Button variant="outline" size="sm">주간 보고 열기</Button>
          <Button variant="corp" size="sm">마일스톤 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── 자금 집행 등록 모달 ────────────────────── */

const METHODS = ["계좌이체", "법인카드", "자동이체", "현금"] as const;

export function ExpenseModal({
  defaultCompany = "tailor",
  children,
}: {
  defaultCompany?: CompanyId;
  children: React.ReactNode;
}) {
  const { addTransaction } = useApp();
  const [open, setOpen] = React.useState(false);
  const [company, setCompany] = React.useState<CompanyId>(defaultCompany);
  const [category, setCategory] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [vendor, setVendor] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [method, setMethod] = React.useState<(typeof METHODS)[number]>("계좌이체");
  const [done, setDone] = React.useState(false);

  const categories = BUDGET_LINES.filter((b) => b.company === company).map((b) => b.category);

  React.useEffect(() => {
    setCategory(categories[0] ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company]);

  React.useEffect(() => {
    if (open) {
      setDone(false);
      setTitle("");
      setVendor("");
      setAmount("");
    }
  }, [open]);

  const valid = title.trim() !== "" && Number(amount.replace(/,/g, "")) > 0;

  const submit = () => {
    if (!valid) return;
    addTransaction({
      company,
      date: "2026.07.29",
      category: category || "기타",
      title: title.trim(),
      vendor: vendor.trim() || "미지정",
      amount: Number(amount.replace(/,/g, "")),
      method,
      approver: "김상호",
      status: "승인 대기",
    });
    setDone(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        title="자금 집행 등록"
        desc="등록된 집행 건은 승인 대기 상태로 집행 내역에 추가됩니다"
        className="max-w-lg"
      >
        {done ? (
          <div className="px-5 py-10 text-center">
            <p className="text-[14px] font-medium text-ink-800">집행 건이 등록되었습니다.</p>
            <p className="mt-1 text-[12.5px] text-ink-400">
              {company === "tailor" ? "비앤테일러샵" : "AI 소프트웨어 법인"} · {category} · {won(Number(amount.replace(/,/g, "")) || 0)}
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setDone(false)}>
                이어서 등록
              </Button>
              <Button size="sm" onClick={() => setOpen(false)}>
                닫기
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3.5 px-5 py-4">
              <div>
                <label className="mb-1.5 block text-[11.5px] text-ink-500">회사 구분</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["tailor", "corp"] as CompanyId[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCompany(c)}
                      className={cn(
                        "rounded-md border px-3 py-2 text-[12.5px] font-medium transition-colors",
                        company === c
                          ? c === "tailor"
                            ? "border-tailor-600 bg-tailor-600 text-white"
                            : "border-corp-700 bg-corp-700 text-white"
                          : "border-ink-200 bg-white text-ink-600 hover:bg-ink-50",
                      )}
                    >
                      {c === "tailor" ? "비앤테일러샵" : "AI 소프트웨어 법인"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[11.5px] text-ink-500">집행 항목</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-[12.5px] text-ink-800 outline-none focus:border-ink-400"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[11.5px] text-ink-500">지급 방식</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as (typeof METHODS)[number])}
                    className="w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-[12.5px] text-ink-800 outline-none focus:border-ink-400"
                  >
                    {METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11.5px] text-ink-500">집행 내용</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예) Zegna Trofeo 600 네이비 12m 발주"
                  className="w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-[12.5px] text-ink-800 outline-none placeholder:text-ink-300 focus:border-ink-400"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[11.5px] text-ink-500">거래처</label>
                  <input
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    placeholder="예) 제냐 코리아"
                    className="w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-[12.5px] text-ink-800 outline-none placeholder:text-ink-300 focus:border-ink-400"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11.5px] text-ink-500">집행 금액 (원)</label>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^\d,]/g, ""))}
                    inputMode="numeric"
                    placeholder="0"
                    className="w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-right text-[12.5px] text-ink-800 outline-none placeholder:text-ink-300 focus:border-ink-400 num"
                  />
                </div>
              </div>

              <p className="rounded-md bg-ivory-100 px-3 py-2 text-[11.5px] text-ink-400">
                등록 시 결재자는 김상호 대표로 지정되며, 상태는 <b className="text-ink-600">승인 대기</b>로 저장됩니다.
              </p>
            </div>
            <div className="flex justify-end gap-2 border-t border-ink-200/60 bg-ivory-100/40 px-5 py-3">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                취소
              </Button>
              <Button
                size="sm"
                variant={company === "tailor" ? "tailor" : "corp"}
                disabled={!valid}
                onClick={submit}
              >
                집행 등록
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ── 프로젝트 선택 모달 (KPI에서 진입) ──────── */

export function ProjectPickerModal({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent title="진행 중 프로젝트" desc={`총 ${AI_PROJECTS.length}건`}>
        <ul className="p-2">
          {AI_PROJECTS.map((p) => (
            <li key={p.id} className="rounded-md px-3 py-2.5 hover:bg-ivory-100">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] font-medium text-ink-800">{p.name}</span>
                <StatusBadge status={p.status} />
              </div>
              <div className="mt-1.5 flex items-center gap-3">
                <Bar value={p.progress} color="#234084" className="max-w-[180px]" />
                <span className="text-[11.5px] text-ink-500 num">{p.progress}%</span>
                <span className="text-[11.5px] text-ink-400">{p.phase}</span>
                <span className="ml-auto text-[11.5px] text-ink-400 num">{p.dueAt}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="border-t border-ink-200/60 px-5 py-3 text-[11.5px] text-ink-400">
          투입 인력 합계 {num(AI_PROJECTS.reduce((s, p) => s + p.headcount, 0))}명 · 배정 예산 합계{" "}
          {won(AI_PROJECTS.reduce((s, p) => s + p.budget, 0))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

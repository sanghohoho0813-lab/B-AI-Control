"use client";

import * as React from "react";
import { ALERTS, MEMOS, TODAY, TODAY_LABEL, TRANSACTIONS } from "@/lib/data";
import type { AlertItem, MemoItem, Scope, Transaction } from "@/lib/types";

export const PERIODS = ["이번 달", "지난 달", "최근 3개월", "올해"] as const;
export type Period = (typeof PERIODS)[number];

export const RANGE_LABEL: Record<Period, string> = {
  "이번 달": "2026.07.01 ~ 07.29",
  "지난 달": "2026.06.01 ~ 06.30",
  "최근 3개월": "2026.05.01 ~ 07.29",
  올해: "2026.01.01 ~ 07.29",
};

interface AppState {
  scope: Scope;
  setScope: (s: Scope) => void;
  period: Period;
  setPeriod: (p: Period) => void;
  date: string;
  dateLabel: string;
  alerts: AlertItem[];
  unread: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  memos: MemoItem[];
  addMemo: (text: string, company: Scope) => void;
  removeMemo: (id: string) => void;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  notifyOpen: boolean;
  setNotifyOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
}

const Ctx = React.createContext<AppState | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [scope, setScope] = React.useState<Scope>("all");
  const [period, setPeriod] = React.useState<Period>("이번 달");
  const [alerts, setAlerts] = React.useState<AlertItem[]>(ALERTS);
  const [memos, setMemos] = React.useState<MemoItem[]>(MEMOS);
  const [transactions, setTransactions] = React.useState<Transaction[]>(TRANSACTIONS);
  const [notifyOpen, setNotifyOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const seq = React.useRef(0);

  const value: AppState = {
    scope,
    setScope,
    period,
    setPeriod,
    date: TODAY,
    dateLabel: TODAY_LABEL,
    alerts,
    unread: alerts.filter((a) => !a.read).length,
    markRead: (id) =>
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a))),
    markAllRead: () => setAlerts((prev) => prev.map((a) => ({ ...a, read: true }))),
    memos,
    addMemo: (text, company) => {
      seq.current += 1;
      setMemos((prev) => [
        { id: `MM-N${seq.current}`, company, text, at: "2026.07.29" },
        ...prev,
      ]);
    },
    removeMemo: (id) => setMemos((prev) => prev.filter((m) => m.id !== id)),
    transactions,
    addTransaction: (tx) => {
      seq.current += 1;
      setTransactions((prev) => [{ ...tx, id: `TX-N${seq.current}` }, ...prev]);
    },
    notifyOpen,
    setNotifyOpen,
    searchOpen,
    setSearchOpen,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppStoreProvider");
  return ctx;
}

export type CompanyId = "tailor" | "corp";
export type Scope = CompanyId | "all";

export interface Company {
  id: CompanyId;
  name: string;
  shortName: string;
  mark: string;
  business: string;
  ceo: string;
  founded: string;
  employees: number;
  location: string;
  /** 회사 구분 컬러 토큰 접두어 (tailor = 버건디, corp = 딥 네이비) */
  tone: "tailor" | "corp";
}

/* ── 비앤테일러샵 ───────────────────────────── */

export type OrderStage =
  | "상담"
  | "치수 측정"
  | "원단 선택"
  | "제작"
  | "가봉"
  | "수정"
  | "납품";

export type OrderStatus = "정상" | "지연 위험" | "지연" | "완료";

export interface TailorOrder {
  id: string;
  customer: string;
  customerId: string;
  item: string;
  fabric: string;
  stage: OrderStage;
  status: OrderStatus;
  amount: number;
  deposit: number;
  orderedAt: string;
  fittingAt: string | null;
  dueAt: string;
  manager: string;
  note: string;
}

export type CustomerGrade = "VIP" | "우수" | "신규" | "일반";

export interface TailorCustomer {
  id: string;
  name: string;
  grade: CustomerGrade;
  company: string;
  phone: string;
  firstVisit: string;
  lastVisit: string;
  visits: number;
  totalAmount: number;
  preferredFabric: string;
  size: string;
  repurchaseScore: number;
  nextAction: string;
}

export type FabricStatus = "충분" | "발주 권장" | "재고 부족" | "발주 완료";

export interface Fabric {
  id: string;
  brand: string;
  name: string;
  code: string;
  color: string;
  composition: string;
  stockM: number;
  assignedM: number;
  unitPrice: number;
  status: FabricStatus;
  leadTimeDays: number;
  updatedAt: string;
}

export interface ProductionJob {
  id: string;
  orderId: string;
  customer: string;
  item: string;
  stage: OrderStage;
  progress: number;
  worker: string;
  startedAt: string;
  dueAt: string;
  riskDays: number;
  status: OrderStatus;
}

/* ── AI 소프트웨어 법인 ─────────────────────── */

export type ProjectPhase = "아이디어" | "기획" | "MVP" | "PoC" | "유료화" | "반복 판매";
export type ProjectStatus = "정상" | "주의" | "지연" | "완료";
export type ProductLine = "플랫폼" | "솔루션" | "모델" | "자동화" | "데이터";

export interface AiProject {
  id: string;
  name: string;
  product: ProductLine;
  owner: string;
  phase: ProjectPhase;
  progress: number;
  nextMilestone: string;
  dueAt: string;
  status: ProjectStatus;
  headcount: number;
  budget: number;
  spent: number;
  client: string;
  contractType: "PoC" | "유료 계약" | "내부 과제" | "정부 과제";
  expectedRevenue: number;
  issue: string | null;
}

export interface RndTask {
  id: string;
  title: string;
  category: string;
  owner: string;
  agency: string;
  progress: number;
  budget: number;
  spent: number;
  startedAt: string;
  dueAt: string;
  status: ProjectStatus;
  output: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  level: string;
  projects: string[];
  allocation: number;
  monthlyCost: number;
  joinedAt: string;
  skills: string[];
}

export interface DataAsset {
  id: string;
  name: string;
  type: "학습 데이터" | "모델" | "API" | "인프라" | "지식재산권";
  scale: string;
  owner: string;
  status: "운영 중" | "구축 중" | "검증 중" | "출원 중";
  updatedAt: string;
  note: string;
}

export interface Deal {
  id: string;
  client: string;
  project: string;
  phase: ProjectPhase;
  amount: number;
  monthly: number;
  startedAt: string;
  closeAt: string;
  probability: number;
  owner: string;
  status: "제안" | "PoC 진행" | "계약 협의" | "계약 완료" | "보류";
}

/* ── 공통 : 자금 · 일정 · 알림 ───────────────── */

export interface BudgetLine {
  id: string;
  company: CompanyId;
  category: string;
  purpose: string;
  relatedProject: string;
  planned: number;
  executed: number;
}

export interface Transaction {
  id: string;
  company: CompanyId;
  date: string;
  category: string;
  title: string;
  vendor: string;
  amount: number;
  method: "계좌이체" | "법인카드" | "자동이체" | "현금";
  approver: string;
  status: "집행 완료" | "승인 대기" | "예정";
}

export interface RevenuePoint {
  month: string;
  tailor: number;
  corp: number;
}

export interface CashPoint {
  month: string;
  tailorIn: number;
  tailorOut: number;
  corpIn: number;
  corpOut: number;
}

export type ScheduleKind =
  | "납품"
  | "가봉"
  | "상담"
  | "발주"
  | "회의"
  | "보고"
  | "계약"
  | "정산";

export interface ScheduleItem {
  id: string;
  company: CompanyId;
  date: string;
  time: string;
  kind: ScheduleKind;
  title: string;
  place: string;
  owner: string;
  done: boolean;
}

export type AlertLevel = "긴급" | "주의" | "안내";

export interface AlertItem {
  id: string;
  company: CompanyId;
  level: AlertLevel;
  category: string;
  title: string;
  detail: string;
  at: string;
  href: string;
  read: boolean;
}

export interface TaskItem {
  id: string;
  company: CompanyId;
  title: string;
  detail: string;
  count: number;
  due: string;
  level: AlertLevel;
  href: string;
}

export interface MemoItem {
  id: string;
  company: Scope;
  text: string;
  at: string;
}

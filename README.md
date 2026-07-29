# B&AI Control

비앤테일러샵과 AI 소프트웨어 법인의 **매출 · 운영 · 프로젝트 · 자금 · 주요 일정**을
하나의 계정에서 관리하는 통합 경영 OS (MVP 프론트엔드).

별도의 백엔드 없이 현실적인 mock data로 동작하며, Vercel에 그대로 배포할 수 있습니다.

## 기술 구성

| 항목 | 내용 |
| --- | --- |
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS v4 |
| 컴포넌트 | shadcn/ui 방식 (Radix UI 기반 자체 구성) |
| 아이콘 | Lucide Icons |
| 차트 | Recharts |
| 데이터 | `src/lib/data.ts` mock data (백엔드 없음) |

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 프로덕션 빌드
npm start
```

## 화면 구성

### 공통
| 경로 | 화면 |
| --- | --- |
| `/dashboard` | 통합 대시보드 (모바일에서는 대표자 브리핑으로 전환) |
| `/companies` | 회사 전환 |
| `/revenue` | 매출·재무 |
| `/finance` | 자금 관리 (회사별 탭) |
| `/schedule` | 일정 관리 |
| `/reports` | 보고서 |
| `/notifications` | 알림 센터 |
| `/tasks` | 대표자 확인 필요 업무 |
| `/mobile` | 대표자 모바일 브리핑 (데스크톱에서는 390×844 미리보기) |

### 비앤테일러샵 (버건디 계열)
`/tailor` 운영 대시보드 · `/tailor/customers` 고객 관리 · `/tailor/orders` 주문 관리 ·
`/tailor/fabrics` 원단·재고 · `/tailor/production` 제작·납기 · `/tailor/sales` 매출 관리 ·
`/tailor/analytics` 고객 분석

### AI 소프트웨어 법인 (딥 네이비·인디고 계열)
`/ai` 사업화 대시보드 · `/ai/projects` 프로젝트 관리 · `/ai/rnd` R&D 관리 ·
`/ai/people` 인력 관리 · `/ai/tech` 기술·데이터 · `/ai/biz` 사업화 관리 ·
`/ai/sales` 매출 관리

## 설계 기준

- **두 법인의 데이터를 절대 섞지 않는다.** 비앤테일러샵은 버건디, AI 법인은 딥 네이비로
  카드·차트·배지·진행바 색을 통일했고, 합산 수치를 보여줄 때도 항상 회사별 내역을 함께 표시합니다.
- **Company Switcher가 화면 전체를 제어합니다.** 헤더 · 사이드바 · 자금 관리 탭 · 회사 전환 페이지에서
  선택한 회사가 전역 상태(`src/components/app-store.tsx`)로 공유되어 KPI, 차트 시리즈, 목록,
  메모까지 함께 필터링됩니다.
- **모바일은 데스크톱 축소판이 아닙니다.** 화면 폭 `lg` 미만에서는 통합 대시보드 대신
  대표자 브리핑(`src/components/mobile/briefing.tsx`)이 렌더링되고, 헤더에서 회사 전환·날짜
  필터가 빠지며 하단 탭(홈·업무·일정·자금·메뉴)으로 이동합니다.

## 동작하는 인터랙션

- Company Switcher (헤더 · 사이드바 · 자금 관리 탭 · 회사 전환 페이지)
- 사이드바 메뉴 이동 / 모바일 드로어
- 날짜·조회 기간 필터, 차트 기간 변경 (6개월 ↔ 12개월)
- KPI 카드 클릭 → 상세 화면 이동
- 알림 패널 열기 · 개별/전체 읽음 처리
- 통합 검색 (고객 · 주문 · 원단 · 프로젝트 · 메뉴)
- 프로젝트 상세 모달 · 주문 상세 모달 · 고객 상세 모달 · 원단 발주 모달 · 보고서 모달
- 자금 집행 등록 모달 (등록 시 집행 내역에 `승인 대기`로 추가)
- 대표자 메모 추가
- 주문 단계 / 사업화 단계 / 고객 등급 / 원단 상태 / 알림 등급 / 일정 유형 필터
- 일정 완료 체크
- 모바일 하단 탭 전환

## 디렉터리

```
src/
├── app/
│   ├── (app)/            # 사이드바 + 헤더가 적용되는 모든 화면
│   ├── globals.css       # 디자인 토큰 (컬러 · 그림자 · 반경)
│   └── layout.tsx
├── components/
│   ├── shell/            # 사이드바 · 헤더 · 회사 전환 · 알림 · 검색
│   ├── mobile/           # 대표자 모바일 브리핑
│   ├── ui/               # Button · Card · Dialog · Sheet · Tabs · Table · Badge
│   ├── charts.tsx        # Recharts 래퍼
│   ├── modals.tsx        # 주문 · 프로젝트 · 자금 집행 모달
│   ├── page-kit.tsx      # PageHeader · KpiCard · StageFlow 등
│   └── app-store.tsx     # 회사 선택 · 기간 · 알림 · 메모 · 집행 내역 상태
└── lib/
    ├── data.ts           # mock data (전부 한국어)
    ├── types.ts
    ├── nav.ts
    └── utils.ts          # 통화 포맷 · 회사별 컬러 토큰 · 상태 배지 스타일
```

## 참고

모든 수치와 고객·프로젝트 정보는 데모용 mock data입니다.
기준일은 `src/lib/data.ts`의 `TODAY` 상수(2026.07.29)로 고정되어 있어
서버·클라이언트 렌더 결과가 항상 동일합니다.

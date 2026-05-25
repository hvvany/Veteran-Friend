# 베프 (VF: Veteran Friend) 🏅

> 짬에서 나오는 인생 조언 커뮤니티 - 5060 베테랑의 경험이 2030 주니어의 고민을 해결합니다.

## 🚀 시작하기

### 1. 의존성 설치
```bash
cd vf-app
npm install
```

### 2. 환경 변수 설정
```bash
cp .env.example .env.local
# .env.local 파일을 열어 각 값을 채워주세요
```

### 3. 데이터베이스 설정
```bash
# PostgreSQL DB 생성 후 DATABASE_URL 설정
npm run db:push       # 스키마 동기화
npm run db:generate   # Prisma 클라이언트 생성
npx ts-node prisma/seed.ts  # 샘플 데이터 생성
```

### 4. 개발 서버 실행
```bash
npm run dev
# http://localhost:3000
```

---

## 📁 프로젝트 구조

```
vf-app/
├── app/                        # Next.js 14 App Router
│   ├── page.tsx                # 메인 피드 (고민 목록)
│   ├── layout.tsx              # 루트 레이아웃
│   ├── login/page.tsx          # 소셜 로그인
│   ├── onboarding/page.tsx     # 최초 가입 온보딩
│   ├── post/
│   │   ├── new/page.tsx        # 고민 작성
│   │   └── [id]/page.tsx       # 고민 상세 + 댓글
│   ├── profile/page.tsx        # 마이 프로필
│   ├── hall-of-fame/page.tsx   # 명예의 전당
│   └── api/
│       ├── auth/[...nextauth]/ # NextAuth 인증
│       └── ai/manager-lee/     # 이 과장님 AI API
│
├── actions/                    # Next.js Server Actions
│   ├── post.ts                 # 게시글 CRUD
│   ├── comment.ts              # 댓글 + 리스펙트
│   └── user.ts                 # 유저 프로필, 인증
│
├── components/
│   ├── auth/SessionProvider    # NextAuth 세션
│   ├── layout/Navbar           # 상단 네비게이션
│   ├── post/
│   │   ├── PostCard            # 게시글 카드
│   │   ├── CommentSection      # 댓글 섹션 + 리스펙트
│   │   └── CategoryFilter      # 카테고리 필터
│   ├── profile/ProfileClient   # 프로필 수정 폼
│   └── veteran/JjamCard        # 베테랑 짬 카드
│
├── lib/
│   ├── auth.ts                 # NextAuth 설정
│   ├── db.ts                   # Prisma 클라이언트
│   ├── gemini.ts               # 이 과장님 AI (Gemini)
│   └── utils.ts                # 공통 유틸리티
│
├── prisma/
│   ├── schema.prisma           # DB 스키마
│   └── seed.ts                 # 샘플 데이터
│
└── types/index.ts              # 공통 타입 정의
```

---

## ✨ 핵심 기능

| 기능 | 설명 |
|------|------|
| 🔐 소셜 로그인 | 카카오 / 구글 OAuth |
| 📝 고민 게시 | 카테고리별 익명 게시글 |
| 🏅 짬 카드 | 베테랑 경력 검증 + 디지털 카드 |
| 👏 리스펙트 | 좋아요 대신 리스펙트 포인트 |
| 🤖 이 과장님 | AI 즉시 답변 (Gemini 1.5 Pro) |
| 🏆 명예의 전당 | 리스펙트 10개+ 베스트 답변 |

---

## 🔑 필요한 API 키

| 서비스 | 용도 | 발급처 |
|--------|------|--------|
| Kakao OAuth | 카카오 로그인 | [developers.kakao.com](https://developers.kakao.com) |
| Google OAuth | 구글 로그인 | [console.cloud.google.com](https://console.cloud.google.com) |
| Gemini API | 이 과장님 AI | [aistudio.google.com](https://aistudio.google.com) |
| PostgreSQL | 데이터베이스 | Supabase / Neon / 로컬 |

---

## 🗺️ 로드맵

- [ ] NHI(건강보험공단) API 실제 연동
- [ ] 리스펙트 30분 딜레이 후 이 과장님 자동 응답
- [ ] 베테랑 전문 분야 태그 시스템
- [ ] 푸시 알림 (새 답변 도착 시)
- [ ] 베테랑 1:1 멘토링 매칭

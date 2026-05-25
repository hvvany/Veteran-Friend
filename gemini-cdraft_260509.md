# 🚀 Project VF (Veteran Friend) Development Brief

## 1. Project Overview
*   **Project Name:** 베프 (VF: Veteran Friend)
*   **Service Concept:** A community platform where 5060 veterans (Seniors) provide "Jjam-based" (experienced-based) advice to 2030 juniors.
*   **Core Value:** Transforming anonymous complaints into actionable wisdom using AI and verified senior experiences.
*   **Target Audience:** Juniors (2030) seeking career/life advice, Seniors (5060) wanting to share wisdom and regain social value.

## 2. Tech Stack (Recommended for MVP)
| Category | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14+ (App Router), TypeScript, Tailwind CSS |
| **Backend** | Next.js Server Actions or Node.js (Express) |
| **Database** | PostgreSQL (Prisma ORM) |
| **Authentication** | NextAuth.js (Kakao/PASS Integration) |
| **AI Integration** | Gemini 1.5 Pro or GPT-4o API |
| **Verification** | NHI (National Health Insurance) Data API / Scraping |

## 3. Core Features & Functional Requirements

### A. Authentication & Verification (The Trust Layer)
*   **Junior:** Basic social login (Kakao, Google).
*   **Veteran (Essential):**
    *   Verification via Kakao/PASS Identity API.
    *   Integration with National Health Insurance (NHI) data to fetch "Qualification Gain/Loss History" (건강보험 자격득실확인서).
    *   **Logic:** Automatically calculate total years of experience and assign badges (e.g., "30-Year Master").

### B. Anonymous Community (The Wisdom Square)
*   **Junior Feed:** Posting concerns in categories: [Career], [Relationship], [Life].
*   **Respect System:** Instead of "Likes", use "Respect" points. High-respect answers are pinned to the "Hall of Fame".
*   **Digital Jjam-Card:** A profile card for Veterans showing verified years of experience and expertise.

### C. AI Persona: "Manager Lee" (The Hipster Veteran)
*   **Role:** Immediate AI response when human Veterans are absent.
*   **Persona:** A 50-something "cool" manager who uses witty metaphors and values junior's growth.
*   **Key Logic:** Text-to-Senior-Style (Refining Senior's voice inputs into structured wisdom).

## 4. Database Schema (Prisma Example)
```prisma
model User {
  id            String    @id @default(cuid())
  role          Role      @default(JUNIOR) // JUNIOR or VETERAN
  nickname      String    @unique
  verified      Boolean   @default(false)
  yearsOfExp    Int?      // Verified by NHI data
  respectPoints Int       @default(0)
  posts         Post[]
  comments      Comment[]
}

model Post {
  id        String    @id @default(cuid())
  title     String
  content   String
  category  Category
  authorId  String
  author    User      @relation(fields: [authorId], references: [id])
  comments  Comment[]
  createdAt DateTime  @default(now())
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  isAI      Boolean  @default(false) // True for "Manager Lee"
  postId    String
  authorId  String
  respects  Int      @default(0)
  post      Post     @relation(fields: [postId], references: [id])
  author    User     @relation(fields: [authorId], references: [id])
}

enum Role { JUNIOR, VETERAN }
enum Category { CAREER, RELATIONSHIP, LIFE }
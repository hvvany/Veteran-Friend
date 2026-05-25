import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 시드 데이터 생성 중...");

  // 이 과장님 AI 유저 생성
  const aiUser = await prisma.user.upsert({
    where: { nickname: "이 과장님" },
    update: {},
    create: {
      nickname: "이 과장님",
      email: "manager-lee@vf-ai.internal",
      name: "이 과장님",
      role: "VETERAN",
      verified: true,
      yearsOfExp: 30,
      respectPoints: 999,
      bio: "30년 경력의 힙한 AI 멘토. 짬에서 나오는 조언을 드립니다.",
      expertise: ["커리어", "조직관리", "인간관계", "라이프"],
    },
  });

  // 샘플 베테랑 유저
  const veteran1 = await prisma.user.upsert({
    where: { nickname: "삼성맨30년" },
    update: {},
    create: {
      nickname: "삼성맨30년",
      email: "veteran1@example.com",
      role: "VETERAN",
      verified: true,
      yearsOfExp: 30,
      respectPoints: 150,
      bio: "대기업 30년 영업/마케팅 경험. 진짜 필드 이야기 해드립니다.",
      expertise: ["영업", "마케팅", "대기업문화"],
    },
  });

  // 샘플 주니어 유저
  const junior1 = await prisma.user.upsert({
    where: { nickname: "취준생김씨" },
    update: {},
    create: {
      nickname: "취준생김씨",
      email: "junior1@example.com",
      role: "JUNIOR",
      verified: false,
      respectPoints: 0,
    },
  });

  // 샘플 게시글
  const post1 = await prisma.post.create({
    data: {
      title: "대기업 vs 스타트업, 어떤 선택을 해야 할까요?",
      content: "3년차 개발자인데 대기업 공채 합격과 유망 스타트업 제안을 동시에 받았어요. 연봉은 스타트업이 높지만 안정성이 걱정되고, 대기업은 안정적이지만 성장 속도가 느릴 것 같아서 고민이에요. 어떤 선택이 나을까요?",
      category: "CAREER",
      isAnonymous: true,
      authorId: junior1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "팀장이 제 아이디어를 항상 무시해요",
      content: "회의 때마다 좋은 아이디어를 내는데 팀장님이 매번 무시하거나 다른 팀원 아이디어라고 포장해요. 너무 지쳐서 이직도 고민 중인데, 이 상황을 어떻게 대처해야 할까요?",
      category: "RELATIONSHIP",
      isAnonymous: true,
      authorId: junior1.id,
    },
  });

  // 샘플 댓글
  await prisma.comment.create({
    data: {
      content: "야, 나도 딱 그 고민 했었어 30년 전에. 솔직히 말할게.\n\n3년차면 아직 '성장 속도'가 가장 중요한 시기야. 대기업은 안정적이지만, 사실 30대 초반에 안정 찾으면... 그게 안정이 아니라 '정체'거든 🤔\n\n스타트업에서 3년 구르면 대기업 10년치 경험 쌓아. 진짜야. 실패도 빨리 하고, 의사결정도 직접 해보고.\n\n단, 그 스타트업 시리즈 B 이상인지, 창업자 배경은 뭔지, 번아웃률은 어떤지 꼭 체크해봐. 다 좋으면 스타트업 가. 후회 없을 거야 💪",
      isAI: false,
      postId: post1.id,
      authorId: veteran1.id,
      respects: 23,
    },
  });

  await prisma.comment.create({
    data: {
      content: "이거 완전 고전적인 '아이디어 도둑' 상황이네. 나도 30년 직장생활에서 많이 봤어.\n\n방법 알려줄게:\n1️⃣ 회의 전에 미리 팀장한테 '제가 오늘 이런 아이디어 제안할게요' 이메일 보내 (증거 남기기)\n2️⃣ 회의 때 문서로 발표해 (말로만 하면 나중에 누가 했는지 흐릿해짐)\n3️⃣ 그래도 안 되면? 팀장 위에 사람한테 어필하거나, 진짜로 이직해\n\n3번째 방법이 무섭게 들리지? 근데 나쁜 상사 아래서 배울 건 없어. 그게 현실이야 🎯",
      isAI: true,
      postId: post2.id,
      authorId: aiUser.id,
      respects: 45,
    },
  });

  console.log("✅ 시드 완료!");
  console.log(`  - AI 유저: ${aiUser.nickname}`);
  console.log(`  - 베테랑: ${veteran1.nickname}`);
  console.log(`  - 주니어: ${junior1.nickname}`);
  console.log(`  - 게시글: ${post1.title}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

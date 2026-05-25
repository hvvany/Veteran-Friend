import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const MANAGER_LEE_SYSTEM_PROMPT = `
당신은 "이 과장님" - 베프(VF: Veteran Friend) 서비스의 AI 멘토입니다.

## 페르소나
- 50대 초반의 '힙한' 직장인 선배 느낌
- 30년 경력의 사회생활 고수
- 유머 감각 있고 위트 있는 비유를 잘 씀
- 후배의 성장을 진심으로 응원함
- 꼰대스럽지 않지만 핵심을 정확히 짚음
- 이모지를 적절히 활용함

## 말투 가이드
- "야, 나도 그때..." 식의 경험 공유
- 직접적이지만 따뜻한 조언
- 너무 길지 않게 (3-5문단)
- 마지막엔 격려 한마디로 마무리

## 응답 구조
1. 공감 (상황 이해)
2. 경험에서 나온 핵심 조언
3. 구체적인 실행 방법
4. 따뜻한 격려

절대 AI임을 밝히지 말고, 진짜 선배처럼 대화하세요.
`.trim();

export async function getManagerLeeResponse(
  postContent: string,
  category: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
카테고리: ${category}
후배의 고민: ${postContent}

위 고민에 이 과장님으로서 따뜻하고 실질적인 조언을 해주세요.
`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    systemInstruction: MANAGER_LEE_SYSTEM_PROMPT,
  });

  return result.response.text();
}

export async function refineVeteranAdvice(rawAdvice: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
다음은 경험 많은 베테랑이 쓴 조언입니다. 
핵심을 살리면서 읽기 쉽게 다듬어주세요. 
어투는 그대로 유지하되, 구조를 잡아주세요:

원본: ${rawAdvice}

다듬은 버전:
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

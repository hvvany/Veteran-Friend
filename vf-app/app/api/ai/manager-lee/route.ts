import { NextRequest, NextResponse } from "next/server";
import { getManagerLeeResponse } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { content, category } = await req.json();

    if (!content || !category) {
      return NextResponse.json({ error: "content and category are required" }, { status: 400 });
    }

    const response = await getManagerLeeResponse(content, category);
    return NextResponse.json({ response });
  } catch (error) {
    console.error("이 과장님 API 에러:", error);
    return NextResponse.json({ error: "AI 응답 생성 실패" }, { status: 500 });
  }
}

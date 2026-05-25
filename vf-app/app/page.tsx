import Link from "next/link";
import { getPosts } from "@/actions/post";
import PostCard from "@/components/post/PostCard";
import CategoryFilter from "@/components/post/CategoryFilter";
import { Category } from "@prisma/client";

interface HomePageProps {
  searchParams: { category?: string; page?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const category = searchParams.category as Category | undefined;
  const page = Number(searchParams.page) || 1;

  const { posts, totalPages } = await getPosts(category, page);

  return (
    <div>
      {/* 히어로 배너 */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-2xl p-6 mb-6 text-white">
        <h1 className="text-2xl font-bold mb-1">짬에서 나오는 바이브 ✨</h1>
        <p className="text-blue-100 text-sm">
          5060 베테랑의 진짜 경험에서 나온 조언을 만나보세요
        </p>
        <Link
          href="/post/new"
          className="mt-4 inline-block bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors"
        >
          고민 털어놓기 →
        </Link>
      </div>

      {/* 카테고리 필터 */}
      <CategoryFilter currentCategory={category} />

      {/* 게시글 목록 */}
      <div className="space-y-3 mt-4">
        {posts.length === 0 ? (
          <div className="card text-center py-12 text-gray-500">
            <p className="text-4xl mb-3">📭</p>
            <p>아직 게시글이 없어요. 첫 고민을 올려보세요!</p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/?page=${p}${category ? `&category=${category}` : ""}`}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? "bg-blue-700 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

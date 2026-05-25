import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "베프 (VF) - Veteran Friend",
    short_name: "베프",
    description: "5060 베테랑의 짬에서 나오는 인생 조언 커뮤니티",
    start_url: "/",
    display: "standalone",
    background_color: "#E2E8F0",
    theme_color: "#2E5BFF",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "k.kakaocdn.net" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // SWC 최적화 활성화
  
  // 이미지 최적화 설정
  images: {
    domains: ['placehold.co'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 빌드 최적화
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig

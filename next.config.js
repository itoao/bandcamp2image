/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["bandcamp2image.vercel.app"],
  },
}

module.exports = nextConfig

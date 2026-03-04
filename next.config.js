/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/methodology',
        destination: '/app?tab=methodology',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
// trigger redeploy Sat Feb 14 21:30:51 UTC 2026

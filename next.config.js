/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  redirects: async () => [
    {
      source: '/',
      destination: '/profile',
      permanent: true
    },
    {
      source: '/profile/:address',
      destination: '/profile/:address/portfolio',
      permanent: true
    },
    {
      source: '/profile/:address/nft',
      destination: '/profile/:address/portfolio',
      permanent: true
    },
    {
      source: '/bundle/:address',
      destination: '/bundle/:address/portfolio',
      permanent: true
    },
    {
      source: '/bundle/:address/nft',
      destination: '/bundle/:address/portfolio',
      permanent: true
    },
    {
      source: '/bundle/:address/history',
      destination: '/bundle/:address/portfolio',
      permanent: true
    }
  ]
};

module.exports = nextConfig;

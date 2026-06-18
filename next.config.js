/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/gitspin',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
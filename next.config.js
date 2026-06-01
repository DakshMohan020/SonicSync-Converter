/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Docker deployment — bundles the server into a single standalone folder
  output: 'standalone',
};

module.exports = nextConfig;

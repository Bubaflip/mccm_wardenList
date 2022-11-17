/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["myst.mypinata.cloud"],
  },
  env: {
    ALCHEMY_KEY: process.env.ALCHEMY_KEY,
    INFURA_KEY: process.env.INFURA_KEY,
  },
};

module.exports = nextConfig;

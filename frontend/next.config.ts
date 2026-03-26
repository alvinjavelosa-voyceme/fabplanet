import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'dlkfxmdtxtzpb.cloudfront.net' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
    ],
  },
};

export default nextConfig;

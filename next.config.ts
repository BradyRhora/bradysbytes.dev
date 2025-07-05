import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/paf",
        destination: "/games/paf",
        permanent:true
      }
    ]
  }
};

export default nextConfig;

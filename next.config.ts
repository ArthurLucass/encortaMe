import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = {
  reactStrictMode: true,
};

module.exports = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "encorta.me" }],
        destination: "https://localhost:3000/:path*",
        // destination: "https://encorta.me/:path*",
        permanent: true,
      },
    ];
  },
};


export default nextConfig;

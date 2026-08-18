import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination: "https://eveops2-50ef8.firebaseapp.com/__/auth/:path*",
      },
    ];
  },

  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],

  images: {
    unoptimized: true,
  },

  turbopack: {
    rules: {
      "*.mdx": {
        loaders: ["@mdx-js/loader"],
        as: "*.tsx",
      },
    },
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);

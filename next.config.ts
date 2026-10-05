import type { NextConfig } from "next";

const pagesBasePath = process.env.PAGES_BASE_PATH?.replace(/\/$/, "") ?? "";
const basePath = pagesBasePath.startsWith("/") ? pagesBasePath : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  ...(basePath ? { basePath } : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;

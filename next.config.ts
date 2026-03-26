import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  outputFileTracingRoot: path.resolve(process.cwd())
};

export default nextConfig;

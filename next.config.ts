/* File: next.config.ts */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "@prisma/client/runtime"],
};

export default nextConfig;

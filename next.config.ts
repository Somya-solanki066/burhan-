import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;

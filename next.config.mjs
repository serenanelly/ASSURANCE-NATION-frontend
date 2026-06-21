/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Rewrite barrel imports to direct per-icon imports so dev/prod only
    // compile the icons actually used instead of the whole Hugeicons set.
    optimizePackageImports: ["@hugeicons/core-free-icons", "@hugeicons/react"],
  },
};

export default nextConfig;

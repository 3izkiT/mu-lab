import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: false },
  generateBuildId: async () => `build-${Date.now()}`,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

const sentryEnabled = Boolean(process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN);

const sentryBuildOptions = {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  hideSourceMaps: true,
  tunnelRoute: "/monitoring/sentry",
  disableLogger: true,
  automaticVercelMonitors: true,
};

export default sentryEnabled ? withSentryConfig(nextConfig, sentryBuildOptions) : nextConfig;

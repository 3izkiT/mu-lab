import type { NextConfig } from "next";

const nextConfig = {
  // บังคับให้ใช้การบิ้วแบบมาตรฐาน ไม่เอาเครื่องยนต์พิเศษที่อาจจะค้างแคช
  typescript: { ignoreBuildErrors: false },
  // เพิ่มบรรทัดนี้เพื่อล้างแคชตอนส่งขึ้นไป
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  // Enable instrumentation hook for database sync on server startup
  experimental: {
    instrumentationHook: true,
  },
};
export default nextConfig;

import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Pridi, Prompt } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-prompt",
  display: "swap",
});

const pridi = Pridi({
  subsets: ["latin", "thai"],
  weight: ["200", "300", "400", "600"],
  variable: "--font-pridi",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const siteTitle =
  "Mu-Lab: ไขรหัสชีวิตรายบุคคลด้วย AI ห้องทดลองโหราศาสตร์ยุคใหม่";

const siteDescription =
  "ดูดวงส่วนตัวแบบพรีเมียม — วิเคราะห์ลักขณาและดวงชะตาจากวันเวลาและจังหวัดเกิด พร้อมคำแนะจาก Mu-Lab Algorithm";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s · Mu-Lab",
  },
  description: siteDescription,
  keywords: [
    "Mu-Lab",
    "ดูดวง",
    "โหราศาสตร์",
    "ลักขณา",
    "ดวงส่วนตัว",
    "ห้องทดลองโหรา",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "/",
    siteName: "Mu-Lab",
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${prompt.variable} ${pridi.variable} h-full`}>
      <body className="min-h-full bg-[#07060d] font-sans text-zinc-100 antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

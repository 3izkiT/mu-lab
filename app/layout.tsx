import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Pridi, Prompt } from "next/font/google";
import { getSiteUrl } from "@/lib/site-url";
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

const siteUrl = getSiteUrl();

const siteTitle =
  "Mu-Lab: ไขรหัสชีวิตรายบุคคลด้วยห้องทดลองโหราศาสตร์ยุคใหม่";

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
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mu-Lab",
    url: siteUrl,
    logo: `${siteUrl}/logo-brand-v2.png`,
    description: siteDescription,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "hello@mu-lab.app",
        availableLanguage: ["th", "en"],
      },
    ],
    sameAs: ["https://www.facebook.com/mulab", "https://www.tiktok.com/@mulab"],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: siteTitle,
    url: siteUrl,
    description: siteDescription,
    inLanguage: "th-TH",
    isPartOf: {
      "@type": "WebSite",
      name: "Mu-Lab",
      url: siteUrl,
    },
    about: {
      "@type": "Organization",
      name: "Mu-Lab",
      url: siteUrl,
    },
  };

  return (
    <html lang="th" className={`${prompt.variable} ${pridi.variable} h-full`}>
      <body className="min-h-full bg-[#0a1128] font-sans text-[#e7ecff] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

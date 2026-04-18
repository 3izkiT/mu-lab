import type { Metadata, Viewport } from "next";
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
  "ดูดวงส่วนตัว | ลักขณา ดวงชะตา | Mu-Lab";

const siteDescription =
  "ดูดวงส่วนตัวแบบพรีเมียมจากลักขณา ชั่วโมงเกิด จังหวัดเกิด ดวงชะตา โหรา ได้คำแนะนำจริง พร้อมวิเคราะห์ลึกจาก Mu-Lab";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s · Mu-Lab",
  },
  description: siteDescription,
  keywords: [
    "ดูดวง",
    "ดูดวงส่วนตัว",
    "ลักขณา",
    "โหราศาสตร์",
    "ดวงชะตา",
    "วิเคราะห์ลักขณา",
    "ดูดวงออนไลน์",
    "ทำนายโหรา",
    "โหรา",
    "Mu-Lab",
    "ห้องทดลองโหรา",
    "โหราศาสตร์ไทย",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "th-TH": "/",
      "en-US": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "/",
    siteName: "Mu-Lab",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Mu-Lab - ดูดวงส่วนตัวแบบพรีเมียม",
        type: "image/png",
      },
    ],
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
    image: `${siteUrl}/opengraph-image.png`,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "hello@mu-lab.app",
        availableLanguage: ["th", "en"],
      },
    ],
    sameAs: ["https://www.facebook.com/mulab", "https://www.tiktok.com/@mulab"],
    areaServed: {
      "@type": "Country",
      name: "Thailand",
    },
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "บริการดูดวงส่วนตัว",
    description: siteDescription,
    provider: {
      "@type": "Organization",
      name: "Mu-Lab",
      url: siteUrl,
    },
    areaServed: {
      "@type": "Country",
      name: "Thailand",
    },
    availableLanguage: ["th", "en"],
    serviceType: "Astrology Consultation",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "ลักขณาคืออะไร",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ลักขณา คือ ระบบการอ่านดวงในโหราศาสตร์ไทยที่อ้างอิงจากการเกิด",
        },
      },
      {
        "@type": "Question",
        name: "ดูดวงส่วนตัวต้องทำไม",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ดูดวงส่วนตัวช่วยให้คุณเข้าใจตัวเองมากขึ้น และได้คำแนะนำในการตัดสินใจ",
        },
      },
    ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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

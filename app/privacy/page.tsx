import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ParallaxNebula } from "@/components/CinematicCelestial";
import {
  POLICY_LAST_UPDATED,
  PRIVACY_INTRO,
  PRIVACY_SECTIONS,
} from "@/lib/policy-content";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Privacy Policy | Mu-Lab",
  description:
    "นโยบายความเป็นส่วนตัวของ Mu-Lab อธิบายการประมวลผลข้อมูลวันเวลาเกิดเพื่อการพยากรณ์โดยไม่ใช้เพื่อโปรไฟล์ถาวร",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Mu-Lab",
    description:
      "นโยบายความเป็นส่วนตัวของ Mu-Lab อธิบายการประมวลผลข้อมูลวันเวลาเกิดเพื่อการพยากรณ์โดยไม่ใช้เพื่อโปรไฟล์ถาวร",
    url: "/privacy",
    type: "article",
  },
};

const goldBorder = "border border-[rgba(247,231,206,0.22)]";

export default function PrivacyPage() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mu-Lab",
    url: siteUrl,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Mu-Lab",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Privacy Policy",
        item: `${siteUrl}/privacy`,
      },
    ],
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <ParallaxNebula />
      <div className="pointer-events-none fixed inset-0 z-[3] mu-lab-starfield" aria-hidden />

      <section className="relative z-10 mx-auto max-w-4xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <Link href="/" className="mb-6 inline-flex items-center gap-3" aria-label="Go to Mu-Lab homepage">
          <Image
            src="/logo-brand-v2.png"
            alt="Mu Lab"
            width={40}
            height={40}
            className="mu-lab-logo-solid mu-lab-logo-living h-10 w-10 rounded-full object-cover"
          />
          <span className="font-serif text-2xl tracking-tight text-[var(--gold)]">Mu-Lab</span>
        </Link>
        <div className={`mu-lab-glass rounded-[1.35rem] ${goldBorder} p-7 shadow-[0_16px_42px_rgba(1,4,16,0.42)] backdrop-blur-xl sm:rounded-3xl sm:p-10`}>
          <p className="text-[10px] font-light uppercase tracking-[0.34em] text-[var(--gold)]/70">Mu-Lab Policy</p>
          <h1 className="mt-4 font-serif text-3xl font-light tracking-tight text-[#eef1ff] sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm font-light leading-relaxed text-[#dbe1ff]/80">
            {PRIVACY_INTRO}
          </p>
          <p className="mt-2 text-xs text-[#dbe1ff]/65">อัปเดตล่าสุด: {POLICY_LAST_UPDATED}</p>

          <div className="mt-8 space-y-6 text-sm font-light leading-relaxed text-[#dbe1ff]/78">
            {PRIVACY_SECTIONS.map((section) => (
              <section key={section.id}>
                <h2 className="font-serif text-xl text-[#eef1ff]">{section.title}</h2>
                <p className="mt-2">{section.body}</p>
              </section>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            <Link
              href="/terms"
              className={`rounded-full ${goldBorder} bg-[rgba(247,231,206,0.08)] px-4 py-1.5 text-xs font-light tracking-wide text-[var(--gold)] transition hover:bg-[rgba(247,231,206,0.16)]`}
            >
              View Terms of Service
            </Link>
            <Link
              href="/cookie-policy"
              className={`rounded-full ${goldBorder} bg-[rgba(247,231,206,0.08)] px-4 py-1.5 text-xs font-light tracking-wide text-[var(--gold)] transition hover:bg-[rgba(247,231,206,0.16)]`}
            >
              View Cookie Policy
            </Link>
            <Link
              href="/data-request"
              className={`rounded-full ${goldBorder} bg-[rgba(247,231,206,0.08)] px-4 py-1.5 text-xs font-light tracking-wide text-[var(--gold)] transition hover:bg-[rgba(247,231,206,0.16)]`}
            >
              Data Request Form
            </Link>
            <Link
              href="/"
              className={`rounded-full ${goldBorder} bg-[rgba(247,231,206,0.08)] px-4 py-1.5 text-xs font-light tracking-wide text-[var(--gold)] transition hover:bg-[rgba(247,231,206,0.16)]`}
            >
              Back to Mu-Lab
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

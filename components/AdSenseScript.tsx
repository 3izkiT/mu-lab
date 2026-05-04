import Script from "next/script";

/**
 * Loads Google AdSense main script — only when NEXT_PUBLIC_ADSENSE_CLIENT is set
 * Place once in app/layout.tsx
 */
export function AdSenseScript() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!clientId) return null;
  return (
    <Script
      id="google-adsense"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
    />
  );
}

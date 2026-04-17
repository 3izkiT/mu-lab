import { SiteNavHeader } from "@/components/SiteNavHeader";

export default function DailyHoroscopeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNavHeader />
      <div className="pt-1">{children}</div>
    </>
  );
}

import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-utils";
import TarotExperience from "@/components/TarotExperience";
import { getTarotReadingForUser } from "@/lib/tarot-engine";

export const dynamic = 'force-dynamic';

type TarotPageProps = {
  searchParams: Promise<{ readingId?: string }>;
};

export default async function TarotPage({ searchParams }: TarotPageProps) {
  const user = await getCurrentUser();
  const { readingId } = await searchParams;
  
  let initialResult = null;
  if (user && readingId && readingId.trim()) {
    initialResult = await getTarotReadingForUser(user.id, readingId.trim());
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-14">
      <TarotExperience initialResult={initialResult} />
    </main>
  );
}

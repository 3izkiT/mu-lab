import { NextResponse } from "next/server";
import { getDailyForecast } from "@/lib/daily-forecast-data";

export async function GET() {
  try {
    const data = await getDailyForecast();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 502 });
  }
}

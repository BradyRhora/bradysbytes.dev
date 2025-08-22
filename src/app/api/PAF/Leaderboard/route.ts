import { getTodaysLeaderboard } from "@/scripts/lib/paf";
import { NextResponse } from "next/server";

export async function GET() {
    const leaderboard = await getTodaysLeaderboard();
    return await NextResponse.json(leaderboard);
}
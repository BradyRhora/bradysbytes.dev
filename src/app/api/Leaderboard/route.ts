import { getTodaysLeaderboard } from "@/scripts/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const leaderboard = await getTodaysLeaderboard();
    return await NextResponse.json(leaderboard);
}
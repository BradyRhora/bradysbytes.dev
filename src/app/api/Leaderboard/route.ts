import { getLeaderboardFromOffset, getTodaysLeaderboard } from "@/scripts/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req : NextRequest) {
    const offsetStr = req.nextUrl.searchParams.get('offset');
    let leaderboard = null;
    if (!offsetStr) {
        leaderboard = await getTodaysLeaderboard();
    } else {
        const offset = Number.parseInt(offsetStr);
        if (Number.isNaN(offset)) leaderboard = [];
        else {
            leaderboard = await getLeaderboardFromOffset(offset);
        }
    }
    leaderboard = await getTodaysLeaderboard()
    return await NextResponse.json(leaderboard);
}
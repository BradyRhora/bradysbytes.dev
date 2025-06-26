import { NextRequest, NextResponse } from "next/server";
import { getTodaysSong, readMeta } from "@/scripts/heardle";

export async function GET(req: NextRequest) {
    const todaysSong = await getTodaysSong();
    const meta = await readMeta(todaysSong.path);
    const guess = req.nextUrl.searchParams.get('guess') as string;
    
    if (guess == meta.common.title) return new NextResponse(null, {status: 204});
    else return new NextResponse(null, {status: 406});
}
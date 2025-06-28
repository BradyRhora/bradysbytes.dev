import { NextRequest, NextResponse } from "next/server";
import { getTodaysSong } from "@/scripts/lib/db";

export async function GET(req: NextRequest) {
    const todaysSong = await getTodaysSong();

    let status = 500;
    if (todaysSong) {
        const guess = req.nextUrl.searchParams.get('id') as string;        
        if (guess == todaysSong.id) status = 204;
        else status = 406;
    }

    return new NextResponse(null, {status: status});
}
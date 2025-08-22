import { NextRequest, NextResponse } from "next/server";
import { succeed, getTodaysSong } from "@/scripts/lib/paf";

export async function GET(req: NextRequest) {
    const todaysSong = await getTodaysSong();

    let status = 500;
    if (todaysSong) {
        const guess = req.nextUrl.searchParams.get('id') as string;
        const userID = req.nextUrl.searchParams.get('user') as string;

        if (guess == todaysSong.id) {
            status = 204;
            if (userID) {
                succeed(userID);
            }
        }
        else {
            // TODO: should we add a skip here?
            status = 406;
        }
    }

    return new NextResponse(null, {status: status});
}
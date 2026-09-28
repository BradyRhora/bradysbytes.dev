import { GetCurrentMatch } from "@/scripts/lib/db/sbps";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const activeMatch = await GetCurrentMatch();
    if (activeMatch) {
        return NextResponse.json(activeMatch);
    } else {
        return new NextResponse(null, {status: 404, statusText: "No active match found."})
    }
}
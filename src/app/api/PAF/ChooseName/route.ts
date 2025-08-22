import { getOrCreateUserByName } from "@/scripts/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const name = req.nextUrl.searchParams.get('name')?.slice(0,30);
    if (name && name.length >= 3) {        
        const user = await getOrCreateUserByName(name);
        return NextResponse.json(user, {status:200});
    }
    return new NextResponse(null, {status:400});
}
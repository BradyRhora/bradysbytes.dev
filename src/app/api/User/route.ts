import { getUser } from "@/scripts/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id');
    if (id) {        
        const user = await getUser(id);
        return NextResponse.json(user, {status:200});
    }
    return new NextResponse(null, {status:400});
}
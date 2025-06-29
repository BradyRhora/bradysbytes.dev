import { addSkip, getSkips, getSuccess } from "@/scripts/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const userID = req.nextUrl.searchParams.get('user');
    if (userID) {
        const skips = await getSkips(userID);
        const success = await getSuccess(userID);
        return NextResponse.json({skips:skips, success:success});
    }

    return new NextResponse(null, {status:400});
}

export async function POST(req: NextRequest) {
    const { user } = await req.json();

    if (user) {
        const newSkips = await addSkip(user);
        return NextResponse.json({skips:newSkips});
    }

    return new NextResponse(null, {status:400});
}
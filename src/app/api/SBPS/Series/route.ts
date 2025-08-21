import { NextResponse, NextRequest } from 'next/server';
import { CreateSeries, GetAllSeries, GetSeries } from '@/scripts/lib/sbps';

export async function GET(req : NextRequest) {
    const id = req.nextUrl.searchParams.get("id");
    if (id)
        return NextResponse.json(await GetSeries(id));
    else
        return NextResponse.json(await GetAllSeries());
}

export async function POST(req : NextRequest) {
    const data = await req.text();
    const entries = data.split('\n');

    const objs = [];
    for (const entry of entries) {
        const seriesData = entry.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
        for (let i = 0; i < seriesData.length; i++) seriesData[i] = seriesData[i].replace(/^["]+|["]+$/g, '');

        if (seriesData.length == 3) {
            objs.push({
                name: seriesData[0],
                releaseYear: Number(seriesData[1]),
                genre: seriesData[2]
            });
        }
    }

    const added = await CreateSeries(objs);
    return NextResponse.json({success:true,count:added});
}
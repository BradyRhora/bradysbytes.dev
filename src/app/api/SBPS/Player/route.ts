import { NextResponse, NextRequest } from 'next/server';
import { CreatePlayers, GetAllPlayers, GetPlayer } from '@/scripts/lib/sbps';
import { roundToDecimalPlaces } from '@/scripts/lib/helpers';

export async function GET(req : NextRequest) {
    const id = req.nextUrl.searchParams.get("id");
    if (id)
        return NextResponse.json(await GetPlayer(id));
    else
        return NextResponse.json(await GetAllPlayers());
}

export async function POST(req : NextRequest) {
    const data = await req.text();
    const entries = data.split('\n');

    const objs = [];
    for (const entry of entries) {
        const playerData = entry.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
        for (let i = 0; i < playerData.length; i++) playerData[i] = playerData[i].replace(/^["]+|["]+$/g, '');

        if (playerData.length == 14) {
            objs.push({
                tag: playerData[0],
                name: playerData[1],
                mainId: playerData[2],
                secondaryId: playerData[3] || undefined,
                weight: roundToDecimalPlaces(Number(playerData[4]),3),
                charm: roundToDecimalPlaces(Number(playerData[5]),3),
                anger: roundToDecimalPlaces(Number(playerData[6]),3),
                depression: roundToDecimalPlaces(Number(playerData[7]),3),
                intoxication: roundToDecimalPlaces(Number(playerData[8]),3),
                fingerCount: roundToDecimalPlaces(Number(playerData[9]),3),
                coordination: roundToDecimalPlaces(Number(playerData[10]),3),
                intelligence: roundToDecimalPlaces(Number(playerData[11]),3),
                techSkill: roundToDecimalPlaces(Number(playerData[12]),3),
                stink: roundToDecimalPlaces(Number(playerData[13]),3),
            });
        }
    }

    const added = await CreatePlayers(objs);
    return NextResponse.json({success:true,count:added});
}
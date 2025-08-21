import { NextResponse, NextRequest } from 'next/server';
import { CreateCharacters, GetAllCharacters, GetCharacter } from '@/scripts/lib/sbps';
import { roundToDecimalPlaces } from '@/scripts/lib/helpers';

export async function GET(req : NextRequest) {
    const id = req.nextUrl.searchParams.get("id");
    if (id)
        return NextResponse.json(await GetCharacter(id));
    else
        return NextResponse.json(await GetAllCharacters());
}

export async function POST(req : NextRequest) {
    const data = await req.text();
    const entries = data.split('\n');

    const objs = [];
    for (const entry of entries) {
        const characterData = entry.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
        for (let i = 0; i < characterData.length; i++) characterData[i] = characterData[i].replace(/^["]+|["]+$/g, '');

        if (characterData.length == 11) {
            objs.push({
                name: characterData[0],
                range: roundToDecimalPlaces(Number(characterData[1]),3),
                weight: roundToDecimalPlaces(Number(characterData[2]),3),
                power: roundToDecimalPlaces(Number(characterData[3]),3),
                speed: roundToDecimalPlaces(Number(characterData[4]),3),
                weapon_size: roundToDecimalPlaces(Number(characterData[5]),3),
                sex_appeal: roundToDecimalPlaces(Number(characterData[6]),3),
                style: roundToDecimalPlaces(Number(characterData[7]),3),
                colour: characterData[8],
                blurb: characterData[9],
                seriesId: characterData[10]
            });
        }
    }

    const added = await CreateCharacters(objs);
    return NextResponse.json({success:true,count:added});
}
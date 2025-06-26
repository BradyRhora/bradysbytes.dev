import { NextRequest, NextResponse } from "next/server";
import { getAllSongs, readMeta } from "@/scripts/heardle";

function stripString(string: string) {
    let returnString = string.trim().toLowerCase();
    returnString = returnString.replace(/[^a-z0-9\s]/g, '');
    return returnString;
}

export async function GET(req: NextRequest) {
    const songs = await getAllSongs();
    const input = req.nextUrl.searchParams.get('input') as string;
    const songData = [];

    for (const song in songs) {
        const meta = await readMeta(songs[song]);
        if (!meta.common.title) continue;

        if (stripString(meta.common.title).includes(stripString(input))) {
            songData.push({
                title: meta.common.title,
                artist: meta.common.artist
            });
        }
    }
    
    return NextResponse.json({
        songData
    });
}
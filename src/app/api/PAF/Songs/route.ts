import { NextRequest, NextResponse } from "next/server";
import { getAllSongs } from "@/scripts/lib/paf";

function stripString(string: string) {
    let returnString = string.trim().toLowerCase();
    returnString = returnString.replace(/[^a-z0-9\s]/g, '');
    return returnString;
}

function containsAllTerms(string: string, terms: string[]) {
    for (const t in terms) {
        if (!string.includes(terms[t])) return false;
    }

    return true;
}

export async function GET(req: NextRequest) {
    const songs = await getAllSongs();
    const input = req.nextUrl.searchParams.get('input') as string;
    const songData = [];

    const strippedSearch = stripString(input);
    const searchTerms = strippedSearch.split(/\s/);

    for (const s in songs) {
        const strippedTitle = stripString(songs[s].title);
        const strippedArtist = stripString(songs[s].artist);
        const combinedSongData = strippedTitle + strippedArtist;
        if (containsAllTerms(combinedSongData, searchTerms)) {
            songData.push({
                title: songs[s].title,
                artist: songs[s].artist,
                id: songs[s].id
            });
        }
    }
    
    return NextResponse.json({
        songData
    });
}
import { NextResponse } from "next/server";
import { getTodaysSong } from "@/scripts/lib/db";
import { getAlbumCover } from "@/scripts/heardle";

// Get todays song information
export async function GET() {
    const song = await getTodaysSong();
    if (!song) return new NextResponse(null, { status: 404 });

    const image = await getAlbumCover('public/' + song.filePath);

    return NextResponse.json({
        songPath: song.filePath,
        startTime: song.startTime,
        dayIndex: song.dayIndex,
        meta: {
            title: song.title,
            artist: song.artist,
            date: song.date,
            imageData: image ? `data:image/jpeg;base64,${image}` : null
        }
    });
}

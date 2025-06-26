import { NextResponse } from "next/server";
import { loadConfig, getTodaysSong, readMeta } from "@/scripts/heardle";

// Get todays song information
export async function GET() {
    const song = await getTodaysSong();
    const meta = await readMeta(song.path); 
    
    return NextResponse.json({
        songPath: song.path,
        startTime: song.startTime,
        meta: {
            title: meta.common.title,
            artist: meta.common.artist,
            date: meta.common.date,
            imageData: meta.common.picture && meta.common.picture.length > 0 ?
                Buffer.from(meta.common.picture[0].data).toString('base64') :
                null
        }
    });
}

loadConfig();
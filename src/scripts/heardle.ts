import fs from 'fs';
import { IAudioMetadata, parseFile } from 'music-metadata';

//import { roundToDecimalPlaces, shuffle } from './lib/helpers';
import { addSong, addSongsToSchedule, getAllSongs } from './lib/db';

const SONG_DIR = 'songs/';
const PUBLIC_SONG_DIR = 'public/' + SONG_DIR;
//const MAX_CLIP_DURATION : number = 12;


/*
async function updateSong() {
    config.date = DateToString(new Date(Date.now()));

    const song = await getTodaysSong();
    const songLength = await readAudioMeta(song.path).then(meta => meta.format.duration);

    let startTime = 0;
    if (songLength) startTime = roundToDecimalPlaces(Math.random() * (songLength - MAX_CLIP_DURATION), 5);

    config.startTime = startTime;
}
*/

export async function readAudioMeta(filePath: string): Promise<IAudioMetadata> {
    const metadata = await parseFile(filePath);
    return metadata;
}

export async function getAlbumCover(filePath: string) {
    const metadata = await readAudioMeta(filePath);
    if (metadata.common.picture && metadata.common.picture.length > 0) {
        return Buffer.from(metadata.common.picture[0].data).toString('base64');
    }
    return null;
}

async function getAllSongFiles() {
    const songFiles = await fs.readdirSync(PUBLIC_SONG_DIR);
    return songFiles;
}


export async function loadSongsToDB() {
    const songFiles = await getAllSongFiles();
    const dbSongs = await getAllSongs();


    const dbPaths: string[] = dbSongs.map((song) => song.filePath);

    const newSongs = [];
    for (const s in songFiles) {
        if (!dbPaths.includes(SONG_DIR + songFiles[s])) {
            const meta = await readAudioMeta('public/' + SONG_DIR + songFiles[s]);
            const newSong = await addSong(
                meta.common.title || 'Unknown Title',
                meta.common.artist || "Unknown Artist",
                meta.format.duration || 0,
                SONG_DIR + songFiles[s],
                meta.common.date ? new Date(meta.common.date) : undefined);
            newSongs.push(newSong);
        }
    }

    // Add to schedule
    addSongsToSchedule(newSongs);

    return newSongs.length;
}
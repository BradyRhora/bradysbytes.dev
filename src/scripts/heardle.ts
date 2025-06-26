import fs from 'fs';
import { IAudioMetadata, parseFile } from 'music-metadata';

import { roundToDecimalPlaces, shuffle } from './helpers';

// show live players?

const SONG_DIR = 'public/songs/';
const CONFIG_FILE = 'paf.json';
const MAX_CLIP_DURATION : number = 12;

type Config = {
    schedule : number[],
    dayCounter: number,
    startTime: number,
    date: string
}

let config : Config = { schedule: [], dayCounter: 0,  startTime:0, date: DateToString(new Date(Date.now())) };

function DateToString(date: Date) {
    return date.toISOString().slice(0,10);
}

async function saveConfig() {
    await fs.writeFileSync(CONFIG_FILE, JSON.stringify(config));
}

async function createSongSchedule() {
    const songCount = await fs.readdirSync(SONG_DIR).length;
    let indices = Array.from({ length: songCount }, (_, i) => i);
    indices = shuffle(indices);
    config.schedule = indices;
    await updateSong();
}

async function updateSong() {
    config.date = DateToString(new Date(Date.now()));

    const song = await getTodaysSong();
    const songLength = await readMeta(song.path).then(meta => meta.format.duration);

    let startTime = 0;
    if (songLength) startTime = roundToDecimalPlaces(Math.random() * (songLength - MAX_CLIP_DURATION), 5);

    config.startTime = startTime;
}

export async function loadConfig() {
    if (!(await fs.existsSync(CONFIG_FILE))) {
        await createSongSchedule();
        await saveConfig();
    } else {
        const data = await fs.readFileSync(CONFIG_FILE);
        config = JSON.parse(data.toString());
    }
}

export async function readMeta(filePath: string): Promise<IAudioMetadata> {
    const metadata = await parseFile(SONG_DIR + filePath);
    return metadata;
}

export async function getTodaysSong() {
    if (config.date < DateToString(new Date(Date.now()))) {
        config.dayCounter++;
        await updateSong();        
        await saveConfig();
    }

    const songIndex = config.schedule[config.dayCounter];
    const songFiles = await fs.readdirSync(SONG_DIR);
    return { path: songFiles[songIndex], startTime: config.startTime };
}

export async function getAllSongs() {
    const songFiles = await fs.readdirSync(SONG_DIR);
    return songFiles;
}
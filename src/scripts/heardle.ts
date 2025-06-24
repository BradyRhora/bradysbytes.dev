import fs from 'fs';
import { IAudioMetadata, parseFile } from 'music-metadata';

import { shuffle } from './helpers';

// automatically advance based on day
// if no one played today dont bother advancing
// show live players?

const SONG_DIR = 'public/songs/';
const CONFIG_FILE = 'paf.json';

type Config = {
    schedule : number[],
    day: number,
    lastDay: string
}

let config : Config = { schedule: [], day: 0, lastDay: DateToString(new Date(Date.now())) };

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
    await saveConfig();
}

export async function loadConfig() {
    if (!(await fs.existsSync(CONFIG_FILE))) {
        createSongSchedule();
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
    if (config.lastDay < DateToString(new Date(Date.now()))) {
        config.lastDay = DateToString(new Date(Date.now()));
        config.day++;
        saveConfig();
    }

    const songIndex = config.schedule[config.day];
    const songFiles = await fs.readdirSync(SONG_DIR);
    return songFiles[songIndex];
}
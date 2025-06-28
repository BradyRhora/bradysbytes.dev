"use server";
import { loadSongsToDB } from "../heardle";
import { prisma } from "../lib/db";

async function generateConfig() {
    if (! (await prisma.paFConfig.findFirst())) {
        prisma.paFConfig.create({ data: {} }).then(() => console.log("Created new config data"));
    } else console.log("Config data confirmed.");
}

loadSongsToDB().then((songCount) => {
    if (songCount > 0) console.log(`Loaded ${songCount} new songs into database`);
    else console.log("No new songs detected");

    generateConfig();
})
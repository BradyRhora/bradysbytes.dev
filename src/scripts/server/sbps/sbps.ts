import { GetActiveTournament } from "@/scripts/lib/sbps";
import { createTournament } from "./tournament";

function Start() {
    console.log("SBPS Server started.");
    Update();
    //setInterval(Update, 10000); // Update every 10 seconds
}

async function Update() {
    console.log("Update!")
    let tournament = await GetActiveTournament();
    console.log(`Tournament: ${tournament}`)
    if (!tournament) {
        tournament = await createTournament();
    }

    // Update tournament

    // Outside of tournament activity?
}

Start();
import { WebSocketServer } from 'ws';
import { EndTournament, GetActiveTournament, GetTournamentMatches } from "@/scripts/lib/sbps";
import { createTournament } from "./tournament";
import { createOrUpdateGame } from "./match";

const WSS = new WebSocketServer({port:5975});

function Start() {
    console.log("SBPS Server started.");
    Update();
    setInterval(Update, 20000)//1000 * 60 * 8); // Update every 8 minutes
}

async function Update() {
    let tournament = await GetActiveTournament();
    if (!tournament) {
        tournament = await createTournament();
        console.log(`Sending new tournament ID to ${WSS.clients.size} clients!`)
        WSS.clients.forEach((client) => client.send(JSON.stringify({type: "newTournament", tournamentId: tournament!.id})));
        console.log("Sent!")
        return;
    }

    // Update tournament
    const matches = await GetTournamentMatches(tournament.id);
    let flag = true;

    for (const match of matches) {
        if (!match.winnerId) {
            flag = false;
            // Update Match
            createOrUpdateGame(match.id, match.score1 + match.score2);
            // Push updated data to websocketserver for live updates?
            // This should be done with the text/commentator updates too eventually
            break; // For now, only update one match at a time
        }
    }

    // No more matches to update, tournament over!
    if (flag) {
        await EndTournament(tournament.id);
    }

    // Outside of tournament activity?
}

Start();
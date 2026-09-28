// import { WebSocketServer } from 'ws';
import { EndTournament, GetActiveTournament, GetCurrentMatch, GetTournamentMatches } from "@/scripts/lib/db/sbps";
import { createTournament } from "./tournament";
import { createOrUpdateGame } from "./match";

// const WSS = new WebSocketServer({port:5975});
const WS = new WebSocket("ws://localhost:5975");

function Start() {
    console.log("SBPS Server started.");
    Update();
    setInterval(Update, 20000)//1000 * 60 * 8); // Update every 8 minutes (currently 20 seconds for debug)
}

async function Update() {
    let tournament = await GetActiveTournament();
    if (!tournament) {
        tournament = await createTournament();
        // console.log(`Sending new tournament ID to ${WSS.clients.size} clients!`)
        // WSS.clients.forEach((client) => client.send(JSON.stringify({type: "newTournament", tournamentId: tournament!.id})));
        WS.send(JSON.stringify({type: "newTournament", tournamentId: tournament!.id}));
        console.log("Sent tournament info to websocket (" + WS.url + ")");
        return;
    }

    // Update tournament
    /*const matches = await GetTournamentMatches(tournament.id);
    let noMatchesLeft = true;


    for (const match of matches) {
        if (!match.winnerId) {
            noMatchesLeft = false;

            // Update Match
            createOrUpdateGame(match.id, match.score1 + match.score2);
            // Push updated data to websocketserver for live updates?
            // This should be done with the text/commentator updates too eventually
            break; // For now, only update one match at a time
        }
    }*/

    const match = await GetCurrentMatch();
    if (match) createOrUpdateGame(match.id, match.score1 + match.score2);
    else // No more matches to update, tournament over!
    {
        await EndTournament(tournament.id);
    }

    // Outside of tournament activity?
}

Start();
import { BuildBracket, CreateTournament, EnterPlayers, GetAllPlayers } from "@/scripts/lib/sbps";
import { SBPSTournament } from "../../../../generated/prisma";

export async function createTournament() {
    function generateTournamentName() {
        // TODO: ADD MORE!!
        const words1 = ['Super','Salty','Apex','Evo','The','Neo','Can\'t Gorf the','Cloud','Arby\'s', 'Delicious'];
        const words2 = ['Smash','Bets','Zone','Mega','Prime','Legends','Supreme','Dunked','Dorf', 'Suite', 'Expo', 'Games', 'Sunset'];
        const words3 = ['Con','[year]','Bros.']

        const words = [
            words1[Math.floor(Math.random() * words1.length)],
            words2[Math.floor(Math.random() * words2.length)],
            Math.random() < 0.40 ? words3[Math.floor(Math.random() * words3.length)] : ''
        ];

        // Keyword Replacement
        for (let i = 0; i < 3; i++) {
            words[i] = words[i].replace('[year]', new Date(Date.now()).getFullYear().toString());
        }

        return `${words[0]} ${words[1]} ${words[2]}`;
    }

    async function createEntries(tournament: SBPSTournament) {
        // TODO: Some players may not enter later
        const players = await GetAllPlayers();

        return await EnterPlayers(tournament, players.map(p => p.id));
    }

    // Tournament Details
    const name : string = generateTournamentName();
    const startDate : Date = new Date(Date.now()); // TODO: later, schedule next tournament for future date?
    const tournament = await CreateTournament({name: name, startDate:startDate});

    // Entrants and Match generation
    const entries = await createEntries(tournament);
    await BuildBracket(tournament, entries);
    return tournament;
}
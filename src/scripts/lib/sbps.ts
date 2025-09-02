import { prisma } from '@/scripts/lib/db'
import { Prisma, SBPSGame, SBPSTournament, SBPSTournamentEntry, SBPSTournamentMatch } from '../../../generated/prisma';
import { shuffle } from './helpers';

// players

export async function GetPlayer(id: string) {
    const player = await prisma.sBPSPlayer.findFirst({where: {id:id}, include: {main:true, secondary:true}});    
    return player;
}

export async function GetAllPlayers() {
    const players = await prisma.sBPSPlayer.findMany({include: {main:true, secondary:true}});
    return players;
}

type playerType = {
    tag:string,
    name:string,
    mainId:string,
    secondaryId?:string,
    weight:number,
    charm:number,
    anger:number,
    depression:number,
    intoxication:number,
    fingerCount:number,
    coordination:number,
    intelligence:number,
    techSkill:number,
    stink:number
}

export async function CreatePlayers(playerData : playerType[]) {
    const payload = await prisma.sBPSPlayer.createMany({data: playerData});
    return payload.count;
}

// characters

export async function GetCharacter(id: string) {
    const character = await prisma.sBPSCharacter.findFirst({where: {id:id}, include:{series:true}});
    return character;
}

export async function GetAllCharacters() {
    const characters = await prisma.sBPSCharacter.findMany({include:{series:true}});
    return characters;
}

export async function CreateCharacters(characterData : Prisma.SBPSCharacterCreateManyInput[]) {
    console.log(characterData);
    const payload = await prisma.sBPSCharacter.createMany({data: characterData});
    return payload.count;
}

// series

export async function GetSeries(id: string) {
    const series = await prisma.sBPSSeries.findFirst({where: {id:id}});
    return series;
} 

export async function GetAllSeries() {
    const series = await prisma.sBPSSeries.findMany();
    return series;
}

export async function CreateSeries(seriesData: Prisma.SBPSSeriesCreateManyInput[]) {
    const payload = await prisma.sBPSSeries.createMany({data: seriesData});
    return payload.count;
}

// tournaments
export async function GetTournament(id: string) {
    return await prisma.sBPSTournament.findFirst({where:{id: id}});
}

export async function GetActiveTournament() {
    return await prisma.sBPSTournament.findFirst({where:{active: true}});
}

export async function CreateTournament(tournamentData: Prisma.SBPSTournamentCreateManyInput) {
    const tournament = await prisma.sBPSTournament.create({data: tournamentData});
    return tournament;
}

export async function EndTournament(tournamentId: string) {
    const tournament = await GetTournament(tournamentId);
    if (!tournament) throw new Error("Tournament not found");

    // Set the tournament as inactive
    await prisma.sBPSTournament.update({
        where: { id: tournamentId },
        data: { active: false }
    });

    const matches = await GetTournamentMatches(tournamentId);
    const finalMatch = matches[matches.length - 1];
    const winner = finalMatch.winnerId ? await GetPlayer(finalMatch.winnerId) : null;

    if (winner) console.log(`${winner.tag} has won ${tournament.name}!`)
    return { message: "Tournament ended", winner };
}

// bracket
export async function EnterPlayers(tournmament: SBPSTournament, playerIDs: string[]) {
    const entryData = playerIDs.map(p => {return {playerId: p, tournamentId: tournmament.id}})
    await prisma.sBPSTournamentEntry.createMany({data: entryData});
    return prisma.sBPSTournamentEntry.findMany({where:{tournamentId:tournmament.id}});
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                         

export async function BuildBracket(tournament: SBPSTournament, entries: SBPSTournamentEntry[]) {
    let c = 1;
    while (c < entries.length) c *= 2;
    let byes = c - entries.length;

    const shuffledEntries = shuffle(entries); // TODO: instead of shuffling entries, use a seed based system
    const round1MatchPromises = []

    for (let i = 0; i < shuffledEntries.length; i++) {
        if (byes > 0) {
            byes--;
            round1MatchPromises.push(prisma.sBPSTournamentMatch.create({data:{
                tournamentId: tournament.id,
                round: 1,
                number: i,
                player1Id: shuffledEntries[i].playerId,
                winnerId: shuffledEntries[i].playerId
            }}));
        } else {
            round1MatchPromises.push(prisma.sBPSTournamentMatch.create({data:{
                tournamentId: tournament.id,
                round: 1,
                number: (i/2)+1,
                player1Id: shuffledEntries[i].playerId,
                player2Id: shuffledEntries[i + 1].playerId,
            }}));
            i++;
        }
    }

    const round1Matches : SBPSTournamentMatch[] = await Promise.all(round1MatchPromises);
    let previous = round1Matches;
    let roundNumber = 1;

    while (previous.length > 1) {
        const currentRoundPromises = [];
        roundNumber++;
        for (let i = 0; i < previous.length; i += 2) {
            currentRoundPromises.push(
                prisma.sBPSTournamentMatch.create({
                    data: {
                        tournamentId: tournament.id,
                        round: roundNumber,
                        number: i/2,
                        previousMatch1Id: previous[i].id,
                        previousMatch2Id: previous[i + 1].id,
                        player1Id: previous[i].winnerId,
                        player2Id: previous[i + 1].winnerId,
                    },
                })
            );
        }
        const currentRound = await Promise.all(currentRoundPromises);

        // Batch update nextMatchId for previous matches
        const updatePromises = [];
        for (let i = 0; i < previous.length; i += 2) {
            const match = currentRound[Math.floor(i / 2)];
            updatePromises.push(
                prisma.sBPSTournamentMatch.update({
                    where: { id: previous[i].id },
                    data: { nextMatchId: match.id },
                }),
                prisma.sBPSTournamentMatch.update({
                    where: { id: previous[i + 1].id },
                    data: { nextMatchId: match.id },
                })
            );
        }
        await Promise.all(updatePromises);
        previous = currentRound;
    }
}

// matches
export async function GetTournamentMatches(id: string) {
    return await prisma.sBPSTournamentMatch.findMany({
        where:{
            tournamentId: id
        },
        include: {
            player1: {select: {id: true, tag: true}},
            player2: {select: {id: true, tag: true}},
            winner:  {select: {id: true}}
        },
        orderBy: [
            { round: 'asc' },
            { nextMatchId: 'asc'}
        ]
    });
}

export async function UpdateTournamentMatches(tournamentId: string, matches: SBPSTournamentMatch[]) {
    const updatePromises = matches.map(match => 
        prisma.sBPSTournamentMatch.update({
            where: { id: match.id },
            data: {
                score1: match.score1,
                score2: match.score2,
                winnerId: match.winnerId,
                player1Id: match.player1Id,
                player2Id: match.player2Id,
            },
        })
    );
    await Promise.all(updatePromises);
}

export async function GetActiveTournamentMatches() {
    const tournament = await GetActiveTournament();
    return tournament ? await GetTournamentMatches(tournament.id) : [];
}

export async function GetMatchWithPlayers(matchId: string) {
    return await prisma.sBPSTournamentMatch.findFirst({
        where: { id: matchId },
        include: {
            player1: {include:{main:true, secondary:true}},
            player2: {include:{main:true, secondary:true}},
            nextMatch: true,
        }
    });
}

// games
export async function CreateOrObtainGame(matchId: string, gameNumber: number = 1) {
    const existingGame = await prisma.sBPSGame.findFirst({where: {matchId: matchId, number: gameNumber}});
    if (existingGame) return existingGame;

    const game = await prisma.sBPSGame.create({data: {matchId: matchId, number: gameNumber}});
    return game;
}

export async function UpdateGame(game: SBPSGame) {
    return await prisma.sBPSGame.update({where: {id: game.id}, data: game});
}
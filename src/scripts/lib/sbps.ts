import { prisma } from '@/scripts/lib/db'
import { Prisma, SBPSTournament, SBPSTournamentEntry, SBPSTournamentMatch } from '../../../generated/prisma';
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

export async function GetActiveTournamentMatches() {
    const tournament = await GetActiveTournament();
    return tournament ? await GetTournamentMatches(tournament.id) : [];
}

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

export async function EnterPlayers(tournmament: SBPSTournament, playerIDs: string[]) {
    const entryData = playerIDs.map(p => {return {playerId: p, tournamentId: tournmament.id}})
    await prisma.sBPSTournamentEntry.createMany({data: entryData});
    return prisma.sBPSTournamentEntry.findMany({where:{tournamentId:tournmament.id}});
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                         

export async function BuildBracket(tournament: SBPSTournament, entries: SBPSTournamentEntry[]) {
    console.log(`Building tournament bracket for ${entries.length} entrants`);

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
                player1Id: shuffledEntries[i].playerId,
                winnerId: shuffledEntries[i].playerId
            }}));
        } else {
            round1MatchPromises.push(prisma.sBPSTournamentMatch.create({data:{
                tournamentId: tournament.id,
                round: 1,
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

    console.log(`Bracket built.`);
}

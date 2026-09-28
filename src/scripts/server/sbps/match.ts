import { GetOrCreateGame, GetMatchWithPlayers, UpdateTournamentMatches } from "@/scripts/lib/db/sbps";
import { Prisma, SBPSGame, SBPSTournamentMatch } from "../../../../generated/prisma";
import { GamePlayer } from "./gameplayer";

export type sbpsMatchWithPlayerData = Prisma.SBPSTournamentMatchGetPayload<{
    include:{
        player1:{
            include:{
                main:true,
                secondary:true}
            },
        player2:{
            include:{
                main:true,
                secondary:true
            }
        },
        nextMatch: true
    }
}>;

const active_games : Game[] = [];

export class Game {
    match: sbpsMatchWithPlayerData;
    whichPrevious: 1|2|null;
    game : SBPSGame|null = null; // contains saved data for each players state, damage, stocks
    number : 1|2|3;

    player1: GamePlayer;
    player2: GamePlayer;
    playerGap: number = 10; // distance between players on stage (to determine if in attack range, etc.)

    constructor(match: sbpsMatchWithPlayerData, gameNumber: 1|2|3 = 1) {
        if (match.player1 == null || match.player2 == null) throw new Error("Cannot create game for match without two players.");

        this.match = match;
        this.number = gameNumber;
        this.whichPrevious = this.whichPreviousMatch();
        this.player1 = new GamePlayer(match.player1, this);
        this.player2 = new GamePlayer(match.player2, this);
        active_games.push(this);

        console.log(`[DEBUG] Match between ${match.player1.tag} and ${match.player2.tag} has begun!`)
    }

    async update() {
        console.log("[DEBUG] Match update!");
        if (!this.game) await this.generateGame();

        // update player states
        this.player1.update(this.player2);
        this.player2.update(this.player1);
        
        // compare actions
        this.contest();
    }

    // each players actions are compared to see who comes out successful
    contest() {

    }

    // determines if this match is the first or second previous match to the next match
    whichPreviousMatch() {        
        if (!this.match.nextMatch)
            return null;

        if (this.match.nextMatch.previousMatch1Id == this.match.id) return 1;
        else if (this.match.nextMatch.previousMatch2Id == this.match.id) return 2;
        else return null;
    }

    // creates SBPSGame database object
    async generateGame() {
        this.game = await GetOrCreateGame(this.match.id, this.number);
    }

    winGame(playerId: string) {
        console.log("[DEBUG] " + playerId + " wins a game");
    }

    async winSet(playerId: string) {
        this.match.winnerId = playerId;

        if (this.match.nextMatch) {
            if (this.whichPrevious == 1) this.match.nextMatch.player1Id = this.match.winnerId;
            else if (this.whichPrevious == 2) this.match.nextMatch.player2Id = this.match.winnerId;
        }

        await this.pushMatchData(this.match.nextMatch != null);
    }

    async pushMatchData(updateNext: boolean = false) {
        const matches : SBPSTournamentMatch[] = [this.match];
        if (updateNext && this.match.nextMatch) matches.push(this.match.nextMatch);
        await UpdateTournamentMatches(this.match.tournamentId, matches)
    };



    // Gets ongoing Game object
    static getGame(matchId: string, gameNumber: number) {
        const filtered = active_games.filter(g => g.match.id == matchId && g.number == gameNumber);
        if (filtered.length > 0) return filtered[0];
        else return null;
    }
}

export async function createOrUpdateGame(matchId: string, gameNumber: 1|2|3 = 1) {
    let game = Game.getGame(matchId, gameNumber);

    if (!game) {
        const mData = await GetMatchWithPlayers(matchId);
        if (mData) game = new Game(mData, gameNumber);
    }

    game?.update();
}
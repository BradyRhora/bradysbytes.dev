import { Prisma, SBPSCharacter } from "../../../../generated/prisma";
import { Game } from "./match";

type playerType = Prisma.SBPSPlayerGetPayload<{
    include: {
        main: true,
        secondary: true
    }
}>;

enum playerPosition {
    on_stage,
    on_platform,
    in_air, // above stage
    off_stage // in air beyond stage bounds
}

enum playerState {
    spawning,
    recovering, // returning to the stage
    launching, // as a result of being hit
    approaching,
    attacking,
    blocking,
    dodging,
    taunting,
    stunned
}

enum checkDifficulty {
    easy       =  .5,
    medium     = 1,
    hard       = 1.5,
    impossible = 2
}

export class GamePlayer {
    playerData: playerType;
    game: Game;
    position: playerPosition = playerPosition.in_air;
    state: playerState = playerState.spawning;
    character: SBPSCharacter;

    constructor(player: playerType, game: Game, usingSecondary = false) {
        this.playerData = player;
        this.game = game;

        if (usingSecondary && player.secondary != null) this.character = player.secondary;
        else this.character = player.main;
    }

    // character stats: speed, power, range, defense, weight, weaponsize, sex appeal, style
    // player stats   : weight, charm, anger, depression, intoxication, fingerCount, coordination, intelligence, techSkill, stink
    update(opponent: GamePlayer) {
        console.log(`What should ${this.playerData.tag} do about ${opponent.playerData.tag}...?`)
        
        // Am I in danger?
        // - off stage?
        // = Recover / Defend, else...
        // Can I attack?
        // - Opponent in range?
        // - not currently recovering / stunned
        // = Attack, else...
        // Approach opponent?

        

        // start simple...
        if (this.inAttackRange(this.game.playerGap)) { // try attacking
            this.state = playerState.attacking;
        } else if (opponent.inAttackRange(this.game.playerGap)) { // opponent can attack but i cant
            if (this.check(this.character.speed)) this.state = playerState.dodging;
            else this.state = playerState.blocking;
        } else {
            this.state = playerState.approaching;
        }
    }

    check(stat : number, difficulty : checkDifficulty = checkDifficulty.medium) {
        return Math.random() * (stat + .5) >= difficulty;
    }

    statContest(playerStat : number, opponentStat : number) {
        return Math.random() * playerStat > Math.random() * opponentStat;
    }

    inAttackRange(distance: number) {
        return distance < this.character.range * 3;
    }

    canAct() {
        const cantActStates = [playerState.launching, playerState.stunned, playerState.taunting]; // will need some kind of counter that determines when these states are over
        if (this.state in cantActStates) return false;

        return true;
    }
}
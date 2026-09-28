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
    character: SBPSCharacter; // player's currently active character
    cooldown: number = 0; // When above 0, character is unable to take actions
    damage: number = 0;

    actionScores: UtilityAction[] = [
        new UtilityAction("attack", () => {}),
        new UtilityAction("block", () => {}),
        new UtilityAction("dodge", () => {}),
        new UtilityAction("taunt", () => {}),
        new UtilityAction("recover", () => {})
    ];

    constructor(player: playerType, game: Game, usingSecondary = false) {
        this.playerData = player;
        this.game = game;

        if (usingSecondary && player.secondary != null) this.character = player.secondary;
        else this.character = player.main;
    }

    // character stats: speed, power, range, defense, weight, weaponsize, sex appeal, style
    // player stats   : weight, charm, anger, depression, intoxication, fingerCount, coordination, intelligence, techSkill, stink
    update(opponent: GamePlayer) {

        if (this.cooldown > 0) {
            console.log(`[DEBUG] ${this.playerData.tag} is on cooldown.`);
            this.cooldown--;
            return;
        }

        console.log(`[DEBUG] What should ${this.playerData.tag} do about ${opponent.playerData.tag}...?`)
        
        // Am I in danger?
        // - off stage?
        // = Recover / Defend, else...
        // Can I attack?
        // - Opponent in range?
        // - not currently recovering / stunned
        // = Attack, else...
        // Approach opponent?

        const weightedPlayerGap = this.game.playerGap / 10;
        const weightedDamage = this.damage / 200;
        // const weighted

        

        

    }

    check(stat : number, difficulty : checkDifficulty = checkDifficulty.medium) {
        return Math.random() * (stat + .5) >= difficulty;
    }

    statContest(playerStat : number, opponentStat : number) {
        return Math.random() * playerStat > Math.random() * opponentStat;
    }

    inAttackRange(distance: number) {
        return distance < this.character.range * 3; // TODO: May need tweaking
    }

    canAct() {
        if (this.cooldown > 0) return false;

        const cantActStates = [playerState.launching, playerState.stunned, playerState.taunting];
        if (this.state in cantActStates) return false;

        return true;
    }
}

class UtilityAction {
    Name: string
    Score: number = 0
    Action: () => void

    constructor(name: string, action: () => void) {
        this.Name = name;
        this.Action = action;
    }

    
}
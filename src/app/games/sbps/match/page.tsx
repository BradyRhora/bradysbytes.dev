"use client";
import { useEffect, useState } from "react";
import { SBPSTournament, SBPSTournamentMatch } from "../../../../../generated/prisma";
import { sbpsMatchWithPlayerData } from "@/scripts/server/sbps/match";
import style from "../sbps.module.css";

export default function MatchPage() {
    // should this be modified later to allow any match? Why view a match that isn't happening / is over?

    const [tournament, setTournament] = useState<SBPSTournament | undefined>();
    const [currentMatch, setCurrentMatch] = useState<sbpsMatchWithPlayerData | undefined>();

    useEffect(() => {
        fetch('/api/sbps/tournament')
            .then(data => data.json())
            .then(tournament => setTournament(tournament));

        fetch('/api/sbps/tournament/currentmatch')
            .then(data => data.json())
            .then(match => setCurrentMatch(match));
    }, []);

    return (
        <>
            <header style={{textAlign:"center"}}>
                <h1>{tournament?.name}</h1>
                <h2>{currentMatch?.player1?.tag} VS. {currentMatch?.player2?.tag}</h2>
                <h3>{currentMatch?.score1} - {currentMatch?.score2}</h3>
            </header>

            <div className={style.matchBox}>
                this is where the text goes when the stuff happens
            </div>
        </>
    );
}